import {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

// ─── Admin Init Guard ─────────────────────────────────────────────────────────

if (!admin.apps.length) {
  admin.initializeApp();
}

// ─── Types ────────────────────────────────────────────────────────────────────

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

// ─── Status Machine ───────────────────────────────────────────────────────────
// Defines which transitions are valid. Prevents e.g. jumping from
// "pending" → "delivered" or un-cancelling an order.

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ["confirmed", "cancelled"],
  confirmed:  ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  ["refunded"],
  cancelled:  [],
  refunded:   [],
};

function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDb(): admin.firestore.Firestore {
  return admin.firestore();
}

/**
 * Validate core order fields. Returns a list of problems,
 * empty if the order is well-formed.
 */
function validateOrder(order: Partial<Order>): string[] {
  const errors: string[] = [];

  if (!order.buyerId) errors.push("missing buyerId");
  if (!order.sellerId) errors.push("missing sellerId");
  if (!isOrderStatus(order.status)) errors.push(`invalid status: ${order.status}`);
  if (!Array.isArray(order.items) || order.items.length === 0)
    errors.push("items must be a non-empty array");
  if (typeof order.totalAmount !== "number" || order.totalAmount < 0)
    errors.push("totalAmount must be a non-negative number");

  return errors;
}

/**
 * Decrement inventory for each item in the order.
 * Uses a transaction per product to avoid race conditions on concurrent orders.
 */
async function decrementInventory(items: OrderItem[], orderId: string): Promise<void> {
  const db = getDb();

  await Promise.all(
    items.map(async ({ productId, quantity }) => {
      const ref = db.collection("inventory").doc(productId);

      try {
        await db.runTransaction(async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists) {
            logger.warn("Inventory doc not found — skipping", { productId, orderId });
            return;
          }

          const current = (snap.data()?.stock as number) ?? 0;
          if (current < quantity) {
            logger.warn("Insufficient stock — skipping decrement", {
              productId,
              orderId,
              current,
              requested: quantity,
            });
            return;
          }

          tx.update(ref, {
            stock: admin.firestore.FieldValue.increment(-quantity),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
      } catch (err) {
        logger.error("Inventory decrement failed", { productId, orderId, err });
        // Non-fatal: log and continue; add to a dead-letter queue in production
      }
    })
  );
}

/**
 * Restore inventory when an order is cancelled or refunded.
 */
async function restoreInventory(items: OrderItem[], orderId: string): Promise<void> {
  const db = getDb();

  await Promise.all(
    items.map(async ({ productId, quantity }) => {
      try {
        await db.collection("inventory").doc(productId).update({
          stock: admin.firestore.FieldValue.increment(quantity),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        logger.error("Inventory restore failed", { productId, orderId, err });
      }
    })
  );
}

/**
 * Write a notification document. A separate Cloud Function (or FCM trigger)
 * picks these up and delivers push/email/SMS.
 */
async function queueNotification(
  recipientId: string,
  type: string,
  payload: Record<string, unknown>
): Promise<void> {
  const db = getDb();
  try {
    await db.collection("notifications").add({
      recipientId,
      type,
      payload,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    logger.error("Failed to queue notification", { recipientId, type, err });
    // Non-fatal — notification failure should never block order processing
  }
}

/**
 * Delete all sub-collection documents for an order in batches.
 */
async function deleteSubcollections(
  orderId: string,
  subcollections: string[]
): Promise<void> {
  const db = getDb();

  for (const sub of subcollections) {
    const ref = db.collection("orders").doc(orderId).collection(sub);
    let hasMore = true;

    while (hasMore) {
      const snap = await ref.limit(400).get();
      if (snap.empty) { hasMore = false; break; }

      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();

      hasMore = snap.size === 400;
    }
  }
}

// ─── Triggers ─────────────────────────────────────────────────────────────────

export const onOrderCreated = onDocumentCreated(
  { document: "orders/{orderId}", retry: true },
  async (event) => {
    const orderId = event.params.orderId;
    const order = event.data?.data() as Partial<Order> | undefined;

    if (!order) {
      logger.warn("onOrderCreated: no data on event", { orderId });
      return;
    }

    // Validate shape
    const errors = validateOrder(order);
    if (errors.length > 0) {
      logger.error("onOrderCreated: invalid order document", { orderId, errors });
      return; // Don't throw — a malformed doc will never be valid on retry
    }

    logger.info("New order created", {
      orderId,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      itemCount: order.items!.length,
      totalAmount: order.totalAmount,
    });

    // Decrement inventory for all items concurrently
    await decrementInventory(order.items!, orderId);

    // Notify buyer (confirmation) and seller (new sale)
    await Promise.all([
      queueNotification(order.buyerId!, "order_confirmed", { orderId }),
      queueNotification(order.sellerId!, "new_order", { orderId }),
    ]);
  }
);

export const onOrderUpdated = onDocumentUpdated(
  { document: "orders/{orderId}", retry: true },
  async (event) => {
    const orderId = event.params.orderId;
    const before = event.data?.before.data() as Partial<Order> | undefined;
    const after = event.data?.after.data() as Partial<Order> | undefined;

    if (!before || !after) {
      logger.warn("onOrderUpdated: missing before/after data", { orderId });
      return;
    }

    const prevStatus = before.status;
    const nextStatus = after.status;

    // Status unchanged — nothing order-state-related to do
    if (prevStatus === nextStatus) return;

    // Validate both sides are known statuses
    if (!isOrderStatus(prevStatus) || !isOrderStatus(nextStatus)) {
      logger.error("onOrderUpdated: unrecognised status value", {
        orderId, prevStatus, nextStatus,
      });
      return;
    }

    // Enforce state machine
    if (!isValidTransition(prevStatus, nextStatus)) {
      logger.error("onOrderUpdated: illegal status transition — reverting", {
        orderId, from: prevStatus, to: nextStatus,
      });

      // Revert to previous status to maintain consistency
      try {
        await event.data!.after.ref.update({ status: prevStatus });
      } catch (err) {
        logger.error("Failed to revert illegal transition", { orderId, err });
      }
      return;
    }

    logger.info("Order status changed", { orderId, from: prevStatus, to: nextStatus });

    // ── Side-effects per transition ──────────────────────────────────────────

    if (nextStatus === "cancelled" || nextStatus === "refunded") {
      // Restore inventory when order is cancelled or refunded
      if (Array.isArray(after.items) && after.items.length > 0) {
        await restoreInventory(after.items, orderId);
      }
      await queueNotification(after.buyerId!, `order_${nextStatus}`, { orderId });
    }

    if (nextStatus === "shipped") {
      await queueNotification(after.buyerId!, "order_shipped", {
        orderId,
        // Attach tracking info if present on the doc
        trackingNumber: (after as Record<string, unknown>).trackingNumber ?? null,
      });
    }

    if (nextStatus === "delivered") {
      await queueNotification(after.buyerId!, "order_delivered", { orderId });
    }
  }
);

export const onOrderDeleted = onDocumentDeleted(
  { document: "orders/{orderId}", retry: true },
  async (event) => {
    const orderId = event.params.orderId;
    const order = event.data?.data() as Partial<Order> | undefined;

    logger.info("Order deleted", {
      orderId,
      buyerId: order?.buyerId,
      status: order?.status,
    });

    // Cascade-delete known sub-collections
    await deleteSubcollections(orderId, ["items", "events", "messages"]);

    // If a non-terminal order is hard-deleted, restore inventory
    const activeStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped"];
    if (
      isOrderStatus(order?.status) &&
      activeStatuses.includes(order!.status!) &&
      Array.isArray(order?.items)
    ) {
      logger.info("Hard-deleted active order — restoring inventory", { orderId });
      await restoreInventory(order.items as OrderItem[], orderId);
    }
  }
);