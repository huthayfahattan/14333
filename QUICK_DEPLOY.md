# 🚀 L'olivo Restaurant - Quick Deploy Guide

## Firebase Deployment (Manual Method)

### 📋 Prerequisites
- Google account
- Internet connection
- 10 minutes

### 🎯 Quick Steps

#### 1. Create Firebase Project
- Go to: https://console.firebase.google.com/
- Click "Create a project"
- Name: `lolivo-restaurant`
- Click "Create project"

#### 2. Enable Services
**Firestore Database:**
- Left menu → "Firestore Database"
- "Create database" → "Start in test mode"
- Location: `us-central1`

**Storage:**
- Left menu → "Storage" 
- "Get started" → "Start in test mode"

**Hosting:**
- Left menu → "Hosting"
- "Get started"

#### 3. Get Firebase Config
- Project Settings (gear icon)
- "Your apps" → "Add app" → Web
- Copy the config object

#### 4. Update Config
Replace in `index.html`:
```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "lolivo-restaurant.firebaseapp.com",
  projectId: "lolivo-restaurant",
  storageBucket: "lolivo-restaurant.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### 5. Deploy Files
- Go to "Hosting"
- Upload all project files:
  - `index.html`
  - `styles.css` 
  - `script.js`
  - `manifest.json`
  - `sw.js`
  - `business-registration.json`

#### 6. Set Database Rules
**Firestore Rules:**
- Go to "Firestore Database" → "Rules"
- Replace with rules from `firestore.rules`

**Storage Rules:**
- Go to "Storage" → "Rules" 
- Replace with rules from `storage.rules`

### 🌐 Your App URLs
- **Live App:** `https://lolivo-restaurant.web.app`
- **Console:** `https://console.firebase.google.com/project/lolivo-restaurant`

### ✅ Test Your App
1. Visit the live URL
2. Test customer ordering
3. Test store management
4. Test admin features

### 🎉 Done!
Your restaurant app is now live on Firebase!

### 📞 Support
- Firebase Docs: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
