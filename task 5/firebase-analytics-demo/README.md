# 🔥 Firebase Analytics Demo — Complete Setup Guide

## 📁 Project Structure
```
firebase-analytics-demo/
├── public/
├── src/
│   ├── firebase/
│   │   ├── firebase.js        ← Firebase init (put your config here)
│   │   ├── analytics.js       ← All analytics events
│   │   └── remoteConfig.js    ← Remote Config + feature flags
│   ├── components/
│   │   ├── Navbar.jsx         ← login, sign_up, search events
│   │   ├── ProductCard.jsx    ← button_click, purchase events
│   │   └── PremiumSection.jsx ← feature flag UI + setUserProperties
│   ├── pages/
│   │   └── Home.jsx           ← page_view, fetches Remote Config
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

---

## 🚀 STEP 1: Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Enter project name (e.g. `firebase-analytics-demo`)
4. **Enable Google Analytics** → click Continue
5. Select or create a Google Analytics account → click "Create project"

---

## 🔑 STEP 2: Add Your Firebase Config

1. In Firebase Console → Project Overview → click the **web icon `</>`**
2. Register your app (nickname: `web-demo`)
3. Copy the `firebaseConfig` object shown

4. Open **`src/firebase/firebase.js`** and replace the placeholder:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← paste your actual values
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX",    // ← REQUIRED for Analytics
};
```

---

## 📊 STEP 3: Enable Analytics

1. Firebase Console → Left sidebar → **Analytics → Dashboard**
2. If not already enabled, click **"Enable Google Analytics"**
3. Make sure `measurementId` (`G-XXXXXX`) is in your config ✅

---

## 🎛️ STEP 4: Set Up Remote Config

1. Firebase Console → Left sidebar → **Remote Config**
2. Click **"Create configuration"** (first time) or **"Add parameter"**
3. Add these 4 parameters:

| Parameter Key          | Data Type | Default Value                  |
|------------------------|-----------|--------------------------------|
| `show_premium_section` | Boolean   | `false`                        |
| `hero_banner_text`     | String    | `Discover Amazing Products`    |
| `discount_percentage`  | Number    | `0`                            |
| `new_ui_enabled`       | Boolean   | `false`                        |

4. Click **"Publish changes"** (top right)

---

## 💻 STEP 5: Run the App

```bash
# 1. Navigate to project folder
cd firebase-analytics-demo

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173
```

---

## 🧪 STEP 6: Test Analytics with DebugView

### Method A: Chrome Extension (Easiest)
1. Install **"Google Analytics Debugger"** Chrome extension
2. Enable it (click the extension icon)
3. Reload your app
4. Go to Firebase Console → Analytics → **DebugView**
5. Click buttons in the app — see events appear in real time!

### Method B: URL Parameter
Add `?debug_mode=true` to your URL:
```
http://localhost:5173/?debug_mode=true
```

### Method C: Browser Console
Without any setup, open DevTools (F12) → Console.  
You'll see `[Analytics] Event: ...` logs for every event.

---

## 🚩 STEP 7: Test Feature Flags

1. Run the app — `show_premium_section` starts as `false` (hidden)
2. Go to Firebase Console → **Remote Config**
3. Set `show_premium_section` to **`true`**
4. Click **"Publish changes"**
5. Reload the app — the Premium Section appears! ✅

### Test A/B Testing (new_ui_enabled):
- Set `new_ui_enabled` to `true` → Premium Section shows **new modern UI**
- Set `new_ui_enabled` to `false` → Premium Section shows **classic UI**

---

## 📋 Analytics Events Reference

| Event Name              | Where Triggered      | Key Parameters                    |
|-------------------------|----------------------|-----------------------------------|
| `page_view`             | Page load            | page_title, page_location         |
| `button_click`          | "Add to Cart"        | button_id, product_id, price      |
| `purchase`              | "Buy Now"            | transaction_id, value, items[]    |
| `search`                | Search form          | search_term                       |
| `login`                 | Login button         | method                            |
| `sign_up`               | Sign Up button       | method                            |
| `premium_upgrade_click` | Upgrade button       | ui_variant, discount_offered      |

---

## 🔧 Remote Config Keys Reference

| Key                    | Type    | Effect                                      |
|------------------------|---------|---------------------------------------------|
| `show_premium_section` | Boolean | Shows/hides entire Premium section          |
| `new_ui_enabled`       | Boolean | A/B test: switches between two UI variants  |
| `hero_banner_text`     | String  | Changes the hero section headline           |
| `discount_percentage`  | Number  | Shows discount badge (0 = no discount)      |

---

## ⚠️ Common Issues

**"Analytics not working"**
→ Make sure `measurementId` is in your firebaseConfig  
→ Analytics only works on deployed sites or with DebugView enabled

**"Remote Config returns default values"**
→ Make sure you clicked "Publish changes" in Firebase Console  
→ Check minimumFetchIntervalMillis is set to 0 in development

**"Module not found errors"**
→ Run `npm install` again  
→ Make sure you're in the project root directory

---

## 📦 Key Firebase SDK Functions Used

```js
// Analytics
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";

logEvent(analytics, 'button_click', { button_id: 'buy_now' });  // custom event
logEvent(analytics, 'purchase', { transaction_id: 'T001', value: 99 });  // built-in
setUserId(analytics, 'user_123');          // link events to user
setUserProperties(analytics, { subscription: 'premium' }); // segment users

// Remote Config  
import { getRemoteConfig, fetchAndActivate, getString, getBoolean, getNumber } from "firebase/remote-config";

await fetchAndActivate(remoteConfig);      // fetch + activate in one step
const flag = getBoolean(remoteConfig, 'show_premium_section');  // read boolean
const text = getString(remoteConfig, 'hero_banner_text');       // read string
const disc = getNumber(remoteConfig, 'discount_percentage');    // read number
```