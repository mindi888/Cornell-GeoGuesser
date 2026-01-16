import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, getAuth, onAuthStateChanged } from "firebase/auth";

const provider = new GoogleAuthProvider();

interface BackendUserResponse {
    message: string;
    uid: string;
    userData: { name: string; email: string; score: number; pfp: string };
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, restore their info
    console.log("User still signed in:", user.uid);
  } else {
    // User is signed out
    console.log("No user signed in");
  }
});

export const signIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken; // This is the access token for Google APIs, not the ID token for your backend

        const user = result.user;
        
        // --- NEW STEP: Call your secure backend endpoint ---
        const idToken = await user.getIdToken(); // Get the Firebase ID token
        
        // Define your backend endpoint URL
        const backendUrl = `${import.meta.env.VITE_API_URL}/api/secure-login-action`;

        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                // Pass the ID token securely in the Authorization header
                'Authorization': `Bearer ${idToken}`, 
                'Content-Type': 'application/json'
            },
            // Optionally, pass other data if your backend expects it
            body: JSON.stringify({ email: user.email, name: user.displayName}) 
        });

        if (!backendResponse.ok) {
            throw new Error(`Backend authentication failed: ${backendResponse.statusText}`);
        }

        const backendData: BackendUserResponse = await backendResponse.json();
        console.log("Backend successfully processed login:", backendData.message);
        // --- END NEW STEP ---

        //already have this in login!!
        // if (User) {
        //     console.log("went into updating userContext if statement");
        //     const res = await fetch(`http://localhost:8080/users/${User.uid}`);
        //     const data = await res.json();
        //     setUser(data.user); // store in your UserContext
        // }

        // You can now return the user object and the backend data if needed
        return { user, backendData };
        
    } catch (err: any) {
        // ... (existing error handling code) ...
        console.log(`An error ${err.code} occurred... message: ${err.message}`);
        return null;
    }
};


export const signOut = async () => {
  await auth.signOut();
};
