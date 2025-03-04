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
  apiKey: "AIzaSyCBEQHEb-4weEackit4v81WnE5We8Uct7E",
  authDomain: "giftycash-b3695.firebaseapp.com",
  projectId: "giftycash-b3695",
  storageBucket: "giftycash-b3695.firebasestorage.app",
  messagingSenderId: "170078169882",
  appId: "1:170078169882:web:4e516d72d7f7b11e781aa3",
  measurementId: "G-510LB21JJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const DATABASE = getFirestore(app);
const AUTH = getAuth(app)
const STORAGE = getStorage(app)


export default app
export { AUTH, DATABASE, STORAGE };

