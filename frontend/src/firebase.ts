import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Our web app's Firebase configuration (example)
const firebaseConfig = {
  apiKey: "AIzaSyCHla7lE-lgqKpYIaNbs4jlg2bcuXHOSWI",
  authDomain: "cornell-geoguesser-a5fdd.firebaseapp.com",
  projectId: "cornell-geoguesser-a5fdd",
  storageBucket: "cornell-geoguesser-a5fdd.firebasestorage.app",
  messagingSenderId: "657767365273",
  appId: "1:657767365273:web:29f6facecfebf671d51608",
  measurementId: "G-SGYHCTBYY8"
};
console.log(firebaseConfig)
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export const auth = getAuth(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCHla7lE-lgqKpYIaNbs4jlg2bcuXHOSWI",
//   authDomain: "cornell-geoguesser-a5fdd.firebaseapp.com",
//   projectId: "cornell-geoguesser-a5fdd",
//   storageBucket: "cornell-geoguesser-a5fdd.firebasestorage.app",
//   messagingSenderId: "657767365273",
//   appId: "1:657767365273:web:29f6facecfebf671d51608",
//   measurementId: "G-SGYHCTBYY8"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


