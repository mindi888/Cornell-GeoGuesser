//require('dotenv').config({ path: '../.env' }); 

import admin from "firebase-admin";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // Production: use full JSON from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  console.log("✅ Using FIREBASE_SERVICE_ACCOUNT_JSON");
} else {
  // Fallback to individual env vars (for backwards compatibility)
  console.log("⚠️ Falling back to individual env vars");
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  };
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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