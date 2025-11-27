import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import fetch from "node-fetch";
import { db, auth } from './firebase'

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

interface UserData {
    name: string;
    email: string;
    score: number;
    // Add other fields you might need, like lastLogin or createdAt
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

/* --- GET /users (list all logged-in users from Firestore) --- */
// Make the handler function 'async'
app.get("/users", async (req, res) => {
    console.log("GET /users called");
    try {
        const snapshot = await db.collection('users').get();
        // Map documents to the UserData interface + an ID
        const users = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() as UserData 
        }));
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

/* --- POST /api/secure-login-action --- */
app.post("/api/secure-login-action", async (req, res) => {
    // 1. Get the ID token sent from the frontend client
    console.log('Checking Firebase DB object:', db ? 'Initialized' : 'Not Initialized');
    console.log('Checking Firebase Auth object:', auth ? 'Initialized' : 'Not Initialized');

    // If you want to see if they have core functions
    console.log('DB can access collection function:', typeof db.collection);
    console.log('Auth can access verifyIdToken function:', typeof auth.verifyIdToken);
    

    const idToken = req.headers.authorization?.split('Bearer ')[1];


    if (!idToken) {
        return res.status(401).send("Unauthorized");
    }

    try {
        // 2. Verify the token using the Admin SDK (the secure step)
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid; // This is the user's unique Firebase Auth ID

        // 3. Use the UID as the *document ID* for the user's data in Firestore
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        
        // 4. Check if the user document exists and handle accordingly
        if (userDoc.exists) {
            res.json({ message: "User logged in and data retrieved", user: userDoc.data() });
        } else {
            // If they are a new user, create their profile with default score
            await userRef.set({
                name: decodedToken.name || 'New User',
                email: decodedToken.email,
                score: 0,
            });
            res.status(201).json({ message: "New user created and logged in" });
        }

    } catch (error) {
        // Token was invalid, expired, or something went wrong with auth
        res.status(401).send("Unauthorized: Invalid token");
        console.error('Error during login process:', error)
    }
});

/* --- PUT /users/:id (update user info in Firestore) --- */
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    // We can update name, email, or score
    const { name, email, score } = req.body; 

    console.log("PUT /users/" + id + " called");

    // Create an object with only the fields that were provided in the request
    const updates: Partial<UserData> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (score !== undefined) updates.score = score;

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

app.listen(port, hostname, () => {
    console.log("Listening");
});

