import { useLocation, useNavigate } from "react-router-dom";
import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";

interface ResultsState {
    guess: LatLngExpression;
    correctLocation: LatLngExpression;
}

const ResultsPage = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    // const state = location.state as ResultsState;
    const { guess, correctLocation } = location.state as ResultsState;
    // const guess = state.guess;
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    // const correctLocation: LatLngExpression = [42.4470, -76.4832]; // Cornell coords
    // const correctLocation = state.correctLocation;
    const distMeters = L.latLng(correctLocation).distanceTo(L.latLng(guess));
    const auth = getAuth();
    const{user, addPoints} = useUser();
    const[pointsEarned, setPointsEarned] = useState(0);

    const customMarker = new L.Icon({
        iconUrl: "/Bear-icon.png", // path to your image
        iconSize: [40, 40],     // width and height of the icon
        iconAnchor: [20, 40],   // point of the icon that corresponds to the marker's location
        popupAnchor: [0, -40],  // point from which the popup opens relative to the icon
        //shadowUrl: "/marker-shadow.png", // optional
        shadowSize: [50, 50],          // optional
        shadowAnchor: [20, 50],        // optional
    });

    const getScore = (dist: number) => {
        if (dist > 3000) {
            return 0;
        }
        const scoreCutOffs = [3000, 2000, 1200, 700, 350, 200, 100, 50, 25, 10, 0];
        for (let i: number = 1; i < scoreCutOffs.length; i++) {
            if (dist > scoreCutOffs[i]) {
                return Math.round(10 * (dist - scoreCutOffs[i]) / (scoreCutOffs[i] - scoreCutOffs[i - 1]) + 10 * i);
            }
        }
        return -10000;
    }
    // return 0;


const effectRan = useRef(false); //makes it so stuff doesn't double when useEffect runs twice

useEffect(() => {
  if(!user){
    navigate("/");
  }
  if (!user || effectRan.current) return;

  const earned = getScore(distMeters);
  setPointsEarned(earned);
  //adds points to user, the one stored locally with a field for score
  addPoints(earned);

  //curUser is the one from auth that doesn't have field for score
  const curUser = auth.currentUser;
  if (curUser) {
    fetch(`http://localhost:8080/users/${curUser.uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: user.score + earned }),
    })
      .then(res => res.json())
      .then(data => console.log("Score updated successfully:", data))
      .catch(err => console.error("Error updating score:", err));
  }

  effectRan.current = true;
  //console.log("local user score:"+user.score)
}, []);

  const handlePlayClick = () => navigate("/play");
  const handleHomeClick = () => navigate("/home");

  return (
    <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",  
            justifyContent: "center",
            minHeight: "100vh",
            width: "100vw",   
            padding: "24px",
            boxSizing: "border-box",
            backgroundColor: "rgba(226, 206, 171, 1)"
        }}>
      <h1>Results</h1>

      <MapContainer
        center={correctLocation}
        zoom={13}
        style={{ width: "800px", height: "400px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={correctLocation}>
          <Popup>Correct Location</Popup>
        </Marker>

        <Marker position={guess} icon={customMarker}>
          <Popup>Your Guess</Popup>
        </Marker>

        <Polyline
          positions={[guess, correctLocation]}
          pathOptions={{ color: "red", weight: 3 }}
        />
      </MapContainer>

      <p style={{
            marginBottom: "5px", 
        }}>Your distance from goal: {distMeters.toFixed(2)} meters</p>
      <p style={{
            marginBottom: "5px", 
            marginTop: "0px"
        }}>Points Earned: {pointsEarned}</p>
      <p style={{
            marginBottom: "5px", 
            marginTop: "0px"
        }}>Total Points: {user?.score}</p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <button style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}}
        onClick={handlePlayClick}>Play Again</button>
        <button style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}} onClick={handleHomeClick}>Home</button>
      </div>
    </div>
  );
};


export default ResultsPage;