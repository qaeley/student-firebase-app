import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your real keys from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC96l8y90Eq4vw13nA9EsmAEdumDBHTEYI",
  authDomain: "student-firebase-app-24.firebaseapp.com",
  projectId: "student-firebase-app-24",
  storageBucket: "student-firebase-app-24.firebasestorage.app",
  messagingSenderId: "890395650234",
  appId: "1:890395650234:web:261b11d27d73a5fda4ba83",
  measurementId: "G-Y2L18LBVQ7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);