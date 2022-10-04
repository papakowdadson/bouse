// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARJhhYeTdkR9wdN7UKzS7W1YZc20i41Hk",
  authDomain: "bouse-591ae.firebaseapp.com",
  projectId: "bouse-591ae",
  storageBucket: "bouse-591ae.appspot.com",
  messagingSenderId: "558857659936",
  appId: "1:558857659936:web:91926ace63ac18b7573e45",
  measurementId: "G-THWVF56GX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();