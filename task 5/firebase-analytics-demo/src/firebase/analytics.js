import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export const trackLogin = () => {
  logEvent(analytics, "login");
};

export const trackSignup = () => {
  logEvent(analytics, "sign_up");
};

export const trackPurchase = () => {
  logEvent(analytics, "purchase", {
    currency: "INR",
    value: 999
  });
};

export const trackSearch = () => {
  logEvent(analytics, "search", {
    search_term: "Laptop"
  });
};

export const trackButtonClick = () => {
  logEvent(analytics, "button_click", {
    button_id: "buy_now"
  });
};