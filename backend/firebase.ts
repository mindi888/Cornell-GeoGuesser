require('dotenv').config({ path: '../.env' }); // <-- Load the .env file from the root directory

import * as admin from 'firebase-admin';

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from "firebase/auth";

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key must be specifically parsed to interpret the \n as a real newline
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

export { db };
export const auth = getAuth();

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Our web app's Firebase configuration (example)
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
// export const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// export const db = getFirestore(app);
// //db logic here

// export const auth = getAuth();




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


