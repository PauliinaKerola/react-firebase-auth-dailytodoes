// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjUyh-d4XTs5lEjCUiRC3RT_7jNKRqGGI",
  authDomain: "dailytasks-af3e8.firebaseapp.com",
  projectId: "dailytasks-af3e8",
  storageBucket: "dailytasks-af3e8.appspot.com",
  messagingSenderId: "25887214865",
  appId: "1:25887214865:web:fbbe74eaef003aa03950b0",
  measurementId: "G-C5TESNLZ4Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
