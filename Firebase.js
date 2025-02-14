// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCji74ZRTrgpQIPvfBwHtuzhZVp_OUeU4",
  authDomain: "queen-294db.firebaseapp.com",
  projectId: "queen-294db",
  storageBucket: "queen-294db.firebasestorage.app",
  messagingSenderId: "1003384964025",
  appId: "1:1003384964025:web:9a25ebca9121f6c7f7ec68",
  measurementId: "G-RPSEHWS62B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const DATABASE = getFirestore(app);
const AUTH = getAuth(app)
const STORAGE = getStorage(app)


export default app
export { AUTH, DATABASE, STORAGE };

