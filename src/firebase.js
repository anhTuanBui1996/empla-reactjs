// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc5-6svKc_tffJjSXYDlHrfjOo2WBuFmI",
  authDomain: "empla-caae5.firebaseapp.com",
  projectId: "empla-caae5",
  storageBucket: "empla-caae5.appspot.com",
  messagingSenderId: "257700651468",
  appId: "1:257700651468:web:8b22a86caade9c5a743d69",
  measurementId: "G-E6KQ0QP77G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
