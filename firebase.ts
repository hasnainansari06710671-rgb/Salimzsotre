
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuKVSzw9arSYf7El9AMkweOEfbjpxCsSA",
  authDomain: "salimz-64d99.firebaseapp.com",
  projectId: "salimz-64d99",
  storageBucket: "salimz-64d99.firebasestorage.app",
  messagingSenderId: "491780906458",
  appId: "1:491780906458:web:7e78bca11a52c08df6b4e3",
  measurementId: "G-1JV8S91GSP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
