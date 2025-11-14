import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { WeatherResponse } from "@full-stack/types";
import fetch from "node-fetch";

const app: Express = express();

const hostname = "0.0.0.0";
const port = 8080;

app.use(cors());
app.use(express.json());

// type WeatherData = {
//     latitude: number;
//     longitude: number;
//     timezone: string;
//     timezone_abbreviation: string;
//     current: {
//         time: string;
//         interval: number;
//         precipitation: number;
//     };
// };

// app.get("/weather", async (req, res) => {
//     console.log("GET /api/weather was called");
//     try {
//         const response = await fetch(
//             "https://api.open-meteo.com/v1/forecast?latitude=40.7411&longitude=73.9897&current=precipitation&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=America%2FNew_York&forecast_days=1"
//         );
//         const data = (await response.json()) as WeatherData;
//         const output: WeatherResponse = {
//             raining: data.current.precipitation > 0.5,
//         };
//         res.json(output);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

// Users stored in memory (starts empty)
const users: { id: number; username: string }[] = [];

/* --- GET /users (list all logged-in users) --- */
app.get("/users", (req, res) => {
    console.log("GET /users called");
    res.json(users);
});

/* --- POST /users (user logs in -> add to array) --- */
app.post("/users", (req, res) => {
    const { username } = req.body;

    console.log("POST /users called with:", username);

    // Optional: check if user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.json({
            message: "User already logged in",
            user: existingUser
        });
    }

    // Create new user entry
    const newUser = {
        id: users.length + 1,
        username
    };

    users.push(newUser);

    res.json({
        message: "User logged in",
        user: newUser
    });
});

/* --- PUT /users/:id (update user info) --- */
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    console.log("PUT /users/" + id + " called with:", username);

    const user = users.find((u) => u.id === parseInt(id));
    if (!user) return res.status(404).json({ error: "User not found" });

    user.username = username;
    res.json({ message: "User updated", user });
});

/* --- DELETE /users/:id (remove user) --- */
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    console.log("DELETE /users/" + id + " called");

    const index = users.findIndex((u) => u.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: "User not found" });

    const removedUser = users.splice(index, 1);

    res.json({ message: "User deleted", removedUser });
});

app.listen(port, hostname, () => {
    console.log("Listening");
});
