// Firebase Configuration Template
// Replace the placeholder values with your actual Firebase project config

const firebaseConfig = {
  // Get these values from Firebase Console > Project Settings > General > Your apps
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with your API key
  authDomain: "lolivo-restaurant.firebaseapp.com",    // Replace with your auth domain
  projectId: "lolivo-restaurant",                     // Replace with your project ID
  storageBucket: "lolivo-restaurant.appspot.com",    // Replace with your storage bucket
  messagingSenderId: "123456789012",                  // Replace with your sender ID
  appId: "1:123456789012:web:abcdef1234567890abcdef", // Replace with your app ID
  measurementId: "G-XXXXXXXXXX"                       // Replace with your measurement ID (optional)
};

// How to get these values:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project: lolivo-restaurant
// 3. Click the gear icon (Project Settings)
// 4. Scroll down to "Your apps" section
// 5. Click "Add app" > Web app
// 6. Copy the config object values
// 7. Replace the placeholder values above

export { firebaseConfig };
