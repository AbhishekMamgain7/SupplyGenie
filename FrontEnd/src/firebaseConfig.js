// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPd_zFfTsEvN2L1asX4NtAH13oA0xn2AA",
  authDomain: "techsolutionist-3d995.firebaseapp.com",
  projectId: "techsolutionist-3d995",
  storageBucket: "techsolutionist-3d995.firebasestorage.app",
  messagingSenderId: "571618500703",
  appId: "1:571618500703:web:77448485649a18f012bbea",
  measurementId: "G-V18M9QFN6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);

export { app, database };