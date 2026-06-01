import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";

export const onOrderCreated = onDocumentCreated("orders/{orderId}", (event) => {
  const order = event.data?.data();
  logger.log("New order created", { orderId: event.params.orderId, order });
  // e.g. notify seller, update inventory
});

export const onOrderUpdated = onDocumentUpdated("orders/{orderId}", (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (before?.status !== after?.status) {
    logger.log("Order status changed", { from: before?.status, to: after?.status });
  }
});

export const onOrderDeleted = onDocumentDeleted("orders/{orderId}", (event) => {
  logger.log("Order deleted", { orderId: event.params.orderId });
  // cleanup related data
});