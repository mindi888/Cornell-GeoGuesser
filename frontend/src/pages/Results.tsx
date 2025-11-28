import { useLocation, useNavigate } from "react-router-dom";
import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";
import homeButton from "../assets/homebutton.png";

interface ResultsState {
    guess: LatLngExpression;
    correctLocation: LatLngExpression;
    timedOut: boolean;
}

const ResultsPage = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    // const state = location.state as ResultsState;
    const { guess, correctLocation, timedOut } = location.state as ResultsState;
    // const guess = state.guess;
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    // const correctLocation: LatLngExpression = [42.4470, -76.4832]; // Cornell coords
    // const correctLocation = state.correctLocation;
    const distMeters = (guess && correctLocation) 
        ? L.latLng(correctLocation).distanceTo(L.latLng(guess))
        : Infinity;

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
        if (timedOut || dist > 3000) {
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


useEffect(() => {
      if(!user){
        navigate("/");
      }
      if (!user || effectRan.current) return;

      // 1. Calculate points
      let earned = 0;
      if (timedOut) {
          earned = 0; // Explicitly zero points for time out
      } else if (guess) {
          earned = getScore(distMeters);
      } else {
          // This should ideally not happen if timedOut is false and guess is null
          earned = 0; 
      }
      
      setPointsEarned(earned);
      addPoints(earned);

      // 2. Update Firestore score
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
    }, [timedOut, guess]);

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
      {timedOut ? (
          <h1 style={{ color: 'red' }}>Time's Up! Beebe Got Away!</h1>
      ) : (
          <h1>Results</h1>
      )}
      {guess ? (
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
          <Popup>Beebe</Popup>
        </Marker>

        <Marker position={guess} icon={customMarker}>
          <Popup>You</Popup>
        </Marker>

        <Polyline
          positions={[guess, correctLocation]}
          pathOptions={{ color: "red", weight: 3 }}
        />
      </MapContainer>
      ) : (
          <div style={{ width: "800px", height: "400px", border: '2px solid red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2>The correct location is not revealed when time runs out.</h2>
          </div>
      )}

      <p style={{marginBottom: "5px"}}>
          {timedOut 
              ? `Distance: N/A` 
              : `Your distance from Beebe: ${distMeters.toFixed(2)} meters`
          }
      </p>
      <p style={{
            marginBottom: "5px", 
            marginTop: "0px"
        }}>Points Earned: {pointsEarned}</p>
      <p style={{
            marginBottom: "5px", 
            marginTop: "0px"
        }}>Total Points: {user?.score}</p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <button 
          style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}}
          onClick={handlePlayClick}>Play Again</button>
        <button 
          style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}} 
          onClick={handleHomeClick}>
          <img src={homeButton} alt="Home" style={{ width: "30px", filter: "invert(1)" }}/>
        </button>
      </div>
    </div>
  );
};


export default ResultsPage;