import "dotenv/config";
import admin from "firebase-admin";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.log("Using FIREBASE_SERVICE_ACCOUNT_JSON");
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();



// import admin from 'firebase-admin';
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';

// // 2. Define the serviceAccount object using process.env variables

// const serviceAccount: admin.ServiceAccount = {
//   projectId: process.env.PROJECT_ID,
//   clientEmail: process.env.CLIENT_EMAIL,
//   // The private key needs to specifically interpret the literal `\n` characters 
//   // in your .env string as actual newlines.
//   privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
// };



// const app = initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = getFirestore();

// export { db };
// export const auth = admin.auth();