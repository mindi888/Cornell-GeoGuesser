import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import fetch from "node-fetch";
import { db, auth } from './firebase'

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

app.use(cors({ 
    origin: [ 
        "http://localhost:5173", 
        "http://localhost:3000", 
        "https://cornell-geoguesser.vercel.app" ], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true
}));

app.use(express.json());


interface UserData {
    name: string;
    email: string;
    score: number;
    plays: number;
    pfp: string;
    // Add other fields you might need, like lastLogin or createdAt
}

// Interface for the data you will return to the frontend
interface RankedUser extends UserData {
    id: string; // The document ID (UID)
    rank: number;
}

app.get("/locations/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await db.collection("locations").doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Location not found" });
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: "Failed to load location" });
    }
});


// GET /users/:uid — get a specific user by UID AND calculate rank dynamically
app.get("/users/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        // 1. Fetch ALL users, sorted by score, to determine rank (Requires index!)
        const snapshot = await db.collection('users').orderBy('score', 'desc').get();
        
        let currentRank = 1;
        let previousScore = -1;
        let foundUser: RankedUser | null = null;

        // 2. Iterate through the sorted list, calculate rank, and find the target user
        snapshot.docs.forEach((doc, index) => {
            const userData = doc.data() as UserData;
            
            // Calculate rank (same logic as GET /users)
            if (userData.score !== previousScore) {
                currentRank = index + 1;
            }
            previousScore = userData.score;

            // Check if this is the user we are looking for
            if (doc.id === uid) {
                foundUser = {
                    id: uid,
                    rank: currentRank,
                    ...userData
                };
            }
        });

        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // 3. Return the found user with their calculated rank
        res.json({ user: foundUser });

    } catch (err) {
        console.error("Error fetching and ranking user:", err);
        res.status(500).json({ error: "Failed to fetch user and calculate rank" });
    }
});

/* --- POST /api/secure-login-action --- */
app.post("/api/secure-login-action", async (req, res) => {
    console.log('=== Login Action Started ===');
    console.log('Checking Firebase DB object:', db ? 'Initialized' : 'Not Initialized');
    console.log('Checking Firebase Auth object:', auth ? 'Initialized' : 'Not Initialized');
    console.log('DB can access collection function:', typeof db.collection);
    console.log('Auth can access verifyIdToken function:', typeof auth.verifyIdToken);
    
    // Add these checks
    console.log('Environment variables check:');
    console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('- FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    console.log('- FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY?.length);

    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        console.log('No token provided');
        return res.status(401).send("Unauthorized");
    }

    console.log('Token received, attempting verification...');

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        console.log('Token verified successfully for UID:', decodedToken.uid);
        
        const uid = decodedToken.uid;
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            console.log('Existing user found');
            res.json({ message: "User logged in and data retrieved", user: userDoc.data() });
        } else {
            console.log('New user, creating profile');
            await userRef.set({
                name: decodedToken.name || 'New User',
                email: decodedToken.email,
                score: 0,
                plays: 0,
            });
            res.status(201).json({ message: "New user created and logged in" });
        }

    } catch (error: any) {
        console.error('=== ERROR DURING LOGIN ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        res.status(401).send("Unauthorized: Invalid token");
    }
});
// app.post("/api/secure-login-action", async (req, res) => {
//     // 1. Get the ID token sent from the frontend client
//     console.log('Checking Firebase DB object:', db ? 'Initialized' : 'Not Initialized');
//     console.log('Checking Firebase Auth object:', auth ? 'Initialized' : 'Not Initialized');

//     // If you want to see if they have core functions
//     console.log('DB can access collection function:', typeof db.collection);
//     console.log('Auth can access verifyIdToken function:', typeof auth.verifyIdToken);
    

//     const idToken = req.headers.authorization?.split('Bearer ')[1];


//     if (!idToken) {
//         return res.status(401).send("Unauthorized");
//     }

//     try {
//         // 2. Verify the token using the Admin SDK (the secure step)
//         const decodedToken = await auth.verifyIdToken(idToken);
//         const uid = decodedToken.uid; // This is the user's unique Firebase Auth ID

//         // 3. Use the UID as the *document ID* for the user's data in Firestore
//         const userRef = db.collection('users').doc(uid);
//         const userDoc = await userRef.get();
        
//         // 4. Check if the user document exists and handle accordingly
//         if (userDoc.exists) {
//             res.json({ message: "User logged in and data retrieved", user: userDoc.data() });
//         } else {
//             // If they are a new user, create their profile with default score
//             await userRef.set({
//                 name: decodedToken.name || 'New User',
//                 email: decodedToken.email,
//                 score: 0,
//                 plays:0,
//             });
//             res.status(201).json({ message: "New user created and logged in" });
//         }

//     } catch (error) {
//         // Token was invalid, expired, or something went wrong with auth
//         res.status(401).send("Unauthorized: Invalid token");
//         console.error('Error during login process:', error)
//     }
// });

/* --- GET /users (Fetches, sorts, and ranks all users) --- */
app.get("/users", async (req, res) => {
    console.log("GET /users called for leaderboard");
    try {
        // 1. Query Firestore: Order by 'score' field in descending order (highest score first)
        const snapshot = await db.collection('users').orderBy('score', 'desc').get();

        let currentRank = 1;
        let previousScore = -1; // Initialize with a score lower than any possible actual score

        // 2. Map documents and assign rank
        const rankedUsers: RankedUser[] = snapshot.docs.map((doc, index) => {
            const userData = doc.data() as UserData;
            
            // Handle ties: If the current score is the same as the previous, keep the same rank.
            if (userData.score !== previousScore) {
                // If the score is different, update the rank to the current index + 1
                currentRank = index + 1;
            }
            
            // Update the previous score for the next iteration
            previousScore = userData.score;

            // 3. Return the user data with the calculated rank
            return {
                id: doc.id, 
                rank: currentRank,
                ...userData 
            } as RankedUser;
        });

        // The frontend will now receive a list of users, each with an assigned rank
        res.json(rankedUsers);

    } catch (error) {
        console.error("Error fetching users/leaderboard:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

/* --- PUT /users/:id (update user info in Firestore) --- */
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    // We can update name, email, or score
    const { name, email, score, plays, pfp } = req.body; 

    console.log("PUT /users/" + id + " called");

    // Create an object with only the fields that were provided in the request
    const updates: Partial<UserData> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (score !== undefined) updates.score = score;
    if (plays !== undefined) updates.plays = plays;
    if (pfp !== undefined) updates.pfp = pfp;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
    }

    try {
        const userRef = db.collection('users').doc(id);
        await userRef.update(updates);
        
        // Fetch the updated document to return to the client
        const userDoc = await userRef.get();

        if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

        res.json({ 
            message: "User updated", 
            user: { id: userDoc.id, ...userDoc.data() as UserData } 
        });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

/* --- DELETE /users/:id (remove user from Firestore) --- */
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    console.log("DELETE /users/" + id + " called");

    try {
        // Reference the specific document and delete it
        await db.collection('users').doc(id).delete();

        res.json({ message: "User deleted", removedUserId: id });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// app.listen(port, hostname, () => {
//     console.log("Listening");
// });

if (process.env.NODE_ENV !== "production") { 
    app.listen(8080, () => { 
        console.log("Local server running on http://localhost:8080"); 
    }); 
} 
export default app;
