// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your specific configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcuRKy2fxI-0ONH4GQCNWfcBZ4Kpl40Q8",
  authDomain: "portfolio-88557.firebaseapp.com",
  projectId: "portfolio-88557",
  storageBucket: "portfolio-88557.firebasestorage.app",
  messagingSenderId: "1019691312874",
  appId: "1:1019691312874:web:e8de8660e6bd3c28c19993",
  measurementId: "G-BFPVXYPJ1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools so your website can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);