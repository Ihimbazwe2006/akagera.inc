import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIRIMAzyx76nUktVo--HCWMjUsV8smRys",
  authDomain: "ussd-1-9aa3a.firebaseapp.com",
  projectId: "ussd-1-9aa3a",
  storageBucket: "ussd-1-9aa3a.firebasestorage.app",
  messagingSenderId: "133100715006",
  appId: "1:133100715006:web:f65b50822caef2aeeadeaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
