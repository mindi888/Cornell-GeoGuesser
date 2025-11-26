require('dotenv').config({ path: '../.env' }); 

import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 2. Define the serviceAccount object using process.env variables
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  // The private key needs to specifically interpret the literal `\n` characters 
  // in your .env string as actual newlines.
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
};


const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore();

export { db };
export const auth = admin.auth();

// const serviceAccount: admin.ServiceAccount = {
//   projectId: process.env.PROJECT_ID,
//   clientEmail: process.env.CLIENT_EMAIL,
//   // The private key must be specifically parsed to interpret the \n as a real newline
//   privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n').trim()
// };
// const app = initializeApp({
//   credential: cert(serviceAccount),
// });

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


