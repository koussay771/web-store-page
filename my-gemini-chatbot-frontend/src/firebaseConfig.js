// my-gemini-chatbot-frontend/src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; // إذا كنت تستخدم Google Analytics

// Your web app's Firebase configuration (القيم الحقيقية التي حصلت عليها)
const firebaseConfig = {
  apiKey: "AIzaSyDD1PyslzTmA1QIx0YSzwn1vidP63LkKDQ",
  authDomain: "geministore-4dbf8.firebaseapp.com",
  projectId: "geministore-4dbf8",
  storageBucket: "geministore-4dbf8.firebasestorage.app",
  messagingSenderId: "276507236259",
  appId: "1:276507236259:web:e71c6f0cf88e766c41ac16",
  measurementId: "G-HXCZ0L3RXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (تأكد من تصدير الخدمات التي تحتاجها)
export const auth = getAuth(app);
export const db = getFirestore(app);
// يمكنك حذف السطر التالي إذا لم تكن تستخدم Analytics في تطبيقك:
const analytics = getAnalytics(app);
