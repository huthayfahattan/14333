# Firebase Deployment Guide

## 🚀 Deploy to Firebase

### Prerequisites
1. **Node.js** (version 16 or higher)
2. **Firebase CLI** installed globally
3. **Firebase Project** created

### Installation Steps

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Login to Firebase
```bash
firebase login
```

#### 3. Initialize Firebase Project
```bash
firebase init
```

Select the following services:
- ✅ **Firestore** (Database)
- ✅ **Hosting** (Web hosting)
- ✅ **Storage** (File storage)

#### 4. Configure Project Settings
- **Project ID:** `lolivo-restaurant`
- **Public Directory:** `.` (current directory)
- **Single Page App:** Yes
- **Overwrite index.html:** No

### Deployment Commands

#### Deploy Everything
```bash
firebase deploy
```

#### Deploy Specific Services
```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore

# Deploy only Storage rules
firebase deploy --only storage
```

### Firebase Configuration

#### 1. Update Firebase Config
Replace the placeholder values in `index.html`:

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

#### 2. Get Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lolivo-restaurant`
3. Go to **Project Settings** > **General**
4. Scroll down to **Your apps**
5. Copy the config object

### Database Structure

#### Firestore Collections

##### Orders Collection (`/orders/{orderId}`)
```javascript
{
  id: "order_123",
  customer: {
    fullName: "John Doe",
    phone: "+966501234567",
    fulfillment: "delivery",
    address: "123 Main St, Riyadh",
    distance: 5.2,
    notes: "Extra spicy"
  },
  items: [
    {
      id: "special-sandwich",
      name: "L'olivo Special Sandwich",
      price: 27.6,
      qty: 2,
      customization: {
        breadType: "ciabatta",
        extraIngredients: ["Extra Cheese", "Bacon"],
        specialNotes: "Well done",
        finalPrice: 35.6
      }
    }
  ],
  totals: {
    count: 2,
    subtotal: 55.2,
    deliveryFee: 15,
    total: 70.2
  },
  status: "pending",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

##### Restaurant Collection (`/restaurant/menu`)
```javascript
{
  categories: [
    {
      id: "sandwiches-signature",
      title: "🥪 Signature Sandwiches",
      description: "Selection of the finest L'olivo signature sandwiches",
      items: [...]
    }
  ],
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### URLs After Deployment

- **Web App:** `https://lolivo-restaurant.web.app`
- **Custom Domain:** `https://lolivo.com` (if configured)
- **Firebase Console:** `https://console.firebase.google.com/project/lolivo-restaurant`

### Environment Variables

Create `.env` file (for development):
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=lolivo-restaurant.firebaseapp.com
FIREBASE_PROJECT_ID=lolivo-restaurant
FIREBASE_STORAGE_BUCKET=lolivo-restaurant.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Testing Deployment

#### 1. Local Testing
```bash
firebase serve
```
Visit: `http://localhost:5000`

#### 2. Emulator Testing
```bash
firebase emulators:start
```
- **Hosting:** `http://localhost:5000`
- **Firestore:** `http://localhost:8080`
- **Storage:** `http://localhost:9199`

### Troubleshooting

#### Common Issues

1. **Permission Denied**
   - Check Firestore rules
   - Verify authentication

2. **Build Errors**
   - Check file paths
   - Verify dependencies

3. **Deployment Failed**
   - Check Firebase project ID
   - Verify billing account

### Production Checklist

- [ ] Update Firebase config with real values
- [ ] Set up proper Firestore security rules
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure CDN
- [ ] Set up monitoring
- [ ] Configure backups

### Support

- **Firebase Documentation:** https://firebase.google.com/docs
- **Firebase Support:** https://firebase.google.com/support
- **Community:** https://firebase.google.com/community
