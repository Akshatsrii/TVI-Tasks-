// src/firebase/remoteConfig.js
// ─────────────────────────────────────────────
// 🎛️ FIREBASE REMOTE CONFIG
//
// What it does:
//   • Lets you change app behavior WITHOUT publishing a new build
//   • Example: Turn a feature ON/OFF from Firebase Console
//   • Example: Show different UI to different user groups (A/B Testing)
//
// HOW TO SET UP IN FIREBASE CONSOLE:
//   1. Go to Firebase Console → Remote Config
//   2. Click "Add parameter"
//   3. Add these parameters:
//      - Key: show_premium_section   | Value: true  (boolean)
//      - Key: hero_banner_text       | Value: "Welcome to our store!" (string)
//      - Key: discount_percentage    | Value: 20  (number)
//      - Key: new_ui_enabled         | Value: false (boolean) ← feature flag!
//   4. Click "Publish changes"
// ─────────────────────────────────────────────

import {
  getRemoteConfig,
  fetchAndActivate,
  getString,
  getBoolean,
  getNumber,
  getValue,
} from "firebase/remote-config";
import app from "./firebase";

// Initialize Remote Config
export const remoteConfig = getRemoteConfig(app);

// ─────────────────────────────────────────────
// ⏱️ Minimum fetch interval
// In development: 0 seconds (fetch every time)
// In production: 3600 seconds (1 hour) is recommended
// ─────────────────────────────────────────────
remoteConfig.settings.minimumFetchIntervalMillis = 0; // Change to 3600000 for production

// ─────────────────────────────────────────────
// 📦 DEFAULT VALUES
// These are used BEFORE fetching from server
// They act as fallback if network is unavailable
// ─────────────────────────────────────────────
remoteConfig.defaultConfig = {
  show_premium_section: false,       // feature flag: hide premium section by default
  hero_banner_text: "Discover Amazing Products",
  discount_percentage: 0,
  new_ui_enabled: false,             // feature flag: new UI off by default
};

// ─────────────────────────────────────────────
// 🚀 FETCH AND ACTIVATE
// Call this once when app loads
// fetchAndActivate = fetch from server + activate the values
// ─────────────────────────────────────────────
export const initRemoteConfig = async () => {
  try {
    const activated = await fetchAndActivate(remoteConfig);
    console.log(`[RemoteConfig] Fetched and activated. Fresh values: ${activated}`);
    return true;
  } catch (error) {
    console.error("[RemoteConfig] Failed to fetch:", error);
    return false;
  }
};

// ─────────────────────────────────────────────
// 📖 GETTER HELPERS
// Use these to read config values anywhere in your app
// ─────────────────────────────────────────────

// Get a string value (returns string)
export const getConfigString = (key) => {
  const value = getString(remoteConfig, key);
  console.log(`[RemoteConfig] getString("${key}") → "${value}"`);
  return value;
};

// Get a boolean value (returns true/false)
export const getConfigBoolean = (key) => {
  const value = getBoolean(remoteConfig, key);
  console.log(`[RemoteConfig] getBoolean("${key}") → ${value}`);
  return value;
};

// Get a number value (returns number)
export const getConfigNumber = (key) => {
  const value = getNumber(remoteConfig, key);
  console.log(`[RemoteConfig] getNumber("${key}") → ${value}`);
  return value;
};

// Get a raw Value object (use .asString(), .asBoolean(), .asNumber())
export const getConfigValue = (key) => {
  const value = getValue(remoteConfig, key);
  console.log(`[RemoteConfig] getValue("${key}") → ${value.asString()}`);
  return value;
};