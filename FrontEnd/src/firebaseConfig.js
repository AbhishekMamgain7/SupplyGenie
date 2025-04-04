// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAap2lNJSM09O2GhsEuJtqnStWlIwkFo48",
  authDomain: "supplygenie-11374.firebaseapp.com",
  projectId: "supplygenie-11374",
  storageBucket: "supplygenie-11374.firebasestorage.app",
  messagingSenderId: "665297033943",
  appId: "1:665297033943:web:dd78fbd52aef03ac556e92",
  measurementId: "G-NPY41R1TB0",
  databaseURL: "https://supplygenie-11374-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);

export { app, database, analytics };