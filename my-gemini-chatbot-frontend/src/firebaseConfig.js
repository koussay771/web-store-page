import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // تأكد من وجود هذا
import { getFirestore } from "firebase/firestore"; // وتأكد من وجود هذا

const firebaseConfig = {
 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// ... (يمكنك حذف getAnalytics إذا كنت لا تستخدمها)
