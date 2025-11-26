import { useLocation, useNavigate } from "react-router-dom";
import L, { LatLngExpression} from "leaflet";
import InteractiveMap from "../components/Map";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

interface ResultsState {
    guess: LatLngExpression;
}

const ResultsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as ResultsState;
    const guess = state.guess;
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

    const correctLocation: LatLngExpression = [42.4470, -76.4832]; // Cornell coords
    const distMeters = L.latLng(guess).distanceTo(L.latLng(correctLocation));

    const customMarker = new L.Icon({
        iconUrl: "/Bear-icon.png", // path to your image
        iconSize: [40, 40],     // width and height of the icon
        iconAnchor: [20, 40],   // point of the icon that corresponds to the marker's location
        popupAnchor: [0, -40],  // point from which the popup opens relative to the icon
        //shadowUrl: "/marker-shadow.png", // optional
        shadowSize: [50, 50],          // optional
        shadowAnchor: [20, 50],        // optional
    });

    // Update user score
    fetch("/backend/api/users/update-score", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: distMeters }),
    })
    .then((response) => response.json())
    .then((data) => console.log("Score updated successfully:", data))
    .catch((error) => console.error("Error updating score:", error));

    const handlePlayClick = () => navigate("/play");
    const handleHomeClick = () => navigate("/home");

    return (
        <div style={{ textAlign: "center", padding: "30px" }}>
            <h1>Results</h1>
                <MapContainer
                    center={correctLocation}
                    zoom={13}
                    style={{ width: "400px", height: "400px" }} // square map
                    >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {/* User's marker */}
                    {markerPosition && <Marker position={markerPosition} />}

                    {/* Correct location marker */}
                    <Marker position={correctLocation}>
                        <Popup>Correct Location</Popup>
                    </Marker>
                    <Marker position={guess} icon={customMarker}>
                        <Popup>Your Guess</Popup>
                    </Marker>

                    <Polyline
                        positions={[guess, correctLocation]}
                        pathOptions={{ color: "red", weight: 3 }} // optional styling
                    />
                </MapContainer>
                

            <p>Your distance from goal: {distMeters.toFixed(2)} meters</p>
            <p>Points Earned: {/*some points calc func*/} </p>
            <p>Total Points: {/*access user total points*/} </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                <button onClick={handlePlayClick}>Play Again</button>
                <button onClick={handleHomeClick}>Home</button>
            </div>
        </div>
    );
};

export default ResultsPage;