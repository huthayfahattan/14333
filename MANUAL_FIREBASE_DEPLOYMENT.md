# Firebase Manual Deployment Guide

## 🚀 Manual Firebase Deployment Steps

Since we cannot install Node.js locally due to permission restrictions, here's how to deploy manually:

### Step 1: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Create a project"
3. Project name: `lolivo-restaurant`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Services
1. **Firestore Database:**
   - Go to "Firestore Database" in left menu
   - Click "Create database"
   - Choose "Start in test mode" (for now)
   - Select location: `us-central1` or `asia-southeast1`

2. **Storage:**
   - Go to "Storage" in left menu
   - Click "Get started"
   - Choose "Start in test mode"
   - Select same location as Firestore

3. **Hosting:**
   - Go to "Hosting" in left menu
   - Click "Get started"
   - Follow the setup wizard

### Step 3: Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. App nickname: `lolivo-web`
5. Copy the config object

### Step 4: Update Config in Code
Replace the placeholder config in `index.html` with your real config:

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

### Step 5: Deploy Using Firebase Console
1. Go to "Hosting" in Firebase Console
2. Click "Add files" or drag and drop your project files
3. Upload all files: `index.html`, `styles.css`, `script.js`, `manifest.json`, etc.

### Step 6: Set Up Firestore Rules
1. Go to "Firestore Database" > "Rules"
2. Replace the default rules with our custom rules from `firestore.rules`

### Step 7: Set Up Storage Rules
1. Go to "Storage" > "Rules"
2. Replace the default rules with our custom rules from `storage.rules`

### Alternative: Use Firebase CLI Online
You can also use Firebase CLI in a browser-based environment:

1. Go to: https://replit.com/
2. Create a new Repl
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Clone your repository
5. Run: `firebase deploy`

### Your App URLs After Deployment:
- **Web App:** `https://lolivo-restaurant.web.app`
- **Custom Domain:** `https://lolivo-restaurant.firebaseapp.com`
- **Firebase Console:** `https://console.firebase.google.com/project/lolivo-restaurant`

### Database Structure:
The app will automatically create these collections:
- `/orders` - Customer orders
- `/restaurant/menu` - Menu items and categories
- `/admin/settings` - Restaurant settings

### Testing:
1. Visit your deployed URL
2. Test customer ordering
3. Test store order management
4. Test admin menu management

### Next Steps:
1. Set up custom domain (optional)
2. Configure SSL certificate
3. Set up monitoring and analytics
4. Configure backup strategies
