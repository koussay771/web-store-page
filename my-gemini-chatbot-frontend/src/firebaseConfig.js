// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Optional: If you plan to use Firestore directly from the frontend

const firebaseConfig = {
  apiKey: "AIzaSyDD1PyslzTmA1QIx0YSzwn1vidP63LkKDQ",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "geministore-4dbf8", // This should match your backend's project_id
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  // measurementId: "YOUR_MEASUREMENT_ID" // Optional, if using Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get service instances
export const auth = getAuth(app); // Export auth for authentication
export const db = getFirestore(app); // Export db for Firestore (if needed)

// You can also export other Firebase services (e.g., storage) if you use them in the frontend