// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvdqw7EgiLtik9YXj0A5IE6u5q8S1PN2Y",
  authDomain: "data-visualization-27549.firebaseapp.com",
  projectId: "data-visualization-27549",
  storageBucket: "data-visualization-27549.appspot.com",
  messagingSenderId: "238812678290",
  appId: "1:238812678290:web:f420637103dc31a5c23e4b",
  measurementId: "G-26Z23G1RQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };