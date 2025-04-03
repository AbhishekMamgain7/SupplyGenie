// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlsmtFTtPSavPqvgaSEXrxRwd4l7wOUYI",
  authDomain: "supplygenie-d7928.firebaseapp.com",
  projectId: "supplygenie-d7928",
  storageBucket: "supplygenie-d7928.firebasestorage.app",
  messagingSenderId: "242235620699",
  appId: "1:242235620699:web:0f35fa0efe09cc9b4e2e7e",
  measurementId: "G-TEZCSKPEK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);

export { app, database, analytics};