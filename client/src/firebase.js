// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogproject-7bdca.firebaseapp.com",
  projectId: "blogproject-7bdca",
  storageBucket: "blogproject-7bdca.appspot.com",
  messagingSenderId: "513132298777",
  appId: "1:513132298777:web:4b85ad8f42ed69ed566088"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
