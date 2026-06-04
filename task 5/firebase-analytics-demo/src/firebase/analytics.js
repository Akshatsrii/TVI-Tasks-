


import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import app from "./firebase";


export const analytics = getAnalytics(app);


export const logCustomEvent = (eventName, params = {}) => {
  logEvent(analytics, eventName, params);
  console.log(`[Analytics] Event: ${eventName}`, params); // helpful in development
};


export const logBuyNowClick = (productId, productName, price) => {
  logEvent(analytics, "button_click", {
    button_id: "buy_now",
    product_id: productId,
    product_name: productName,
    price: price,
  });
  console.log(`[Analytics] buy_now clicked → ${productName}`);
};


export const logSearch = (searchTerm) => {
  logEvent(analytics, "search", {
    search_term: searchTerm,
  });
  console.log(`[Analytics] search → "${searchTerm}"`);
};


export const logLogin = (method = "email") => {
  logEvent(analytics, "login", {
    method: method,
  });
  console.log(`[Analytics] login via ${method}`);
};

export const logSignUp = (method = "email") => {
  logEvent(analytics, "sign_up", {
    method: method,
  });
  console.log(`[Analytics] sign_up via ${method}`);
};

export const logPurchase = (transactionId, value, currency = "USD", items = []) => {
  logEvent(analytics, "purchase", {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
  console.log(`[Analytics] purchase → $${value} (${transactionId})`);
};

export const logPageView = (pageName, pageLocation) => {
  logEvent(analytics, "page_view", {
    page_title: pageName,
    page_location: pageLocation,
  });
  console.log(`[Analytics] page_view → ${pageName}`);
};


export const setAnalyticsUserId = (userId) => {
  setUserId(analytics, userId);
  console.log(`[Analytics] userId set → ${userId}`);
};

export const setAnalyticsUserProperties = (properties) => {
  setUserProperties(analytics, properties);
  console.log(`[Analytics] userProperties set`, properties);
};