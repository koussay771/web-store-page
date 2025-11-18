// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app'; // Import getApps and getApp
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API Key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual Auth Domain
  projectId: "YOUR_PROJECT_ID", // Replace with your actual Project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your actual Storage Bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual Messaging Sender ID
  appId: "YOUR_APP_ID" // Replace with your actual App ID
};

// Initialize Firebase only if no app has been initialized yet
let app;
if (!getApps().length) { // Check if any Firebase app instances exist
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // If an app already exists, get the default one
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };