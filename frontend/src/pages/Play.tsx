import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/Map";
import type { LatLngExpression } from "leaflet";
import 'leaflet/dist/leaflet.css';

const PlayPage = () => {
    const navigate = useNavigate();
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

    // Log marker position changes for debugging
    useEffect(() => {
        console.log("Marker position set to:", markerPosition);
    }, [markerPosition]);

    const handleGuessClick = async () => {
        if (!markerPosition) {
            alert("Place a pin on the map first!");
            return;
        }
        navigate("/results");
    };

    return (
        <div style={{ textAlign: "center", padding: "24px" }}>
            <h1>Where you play the game</h1>
            <p>Click on the map to place your marker, then click "Guess" to submit.</p>

            <InteractiveMap
                markerPosition={markerPosition}
                setMarkerPosition={setMarkerPosition}
            />

            <button
                style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem" }}
                onClick={handleGuessClick}
            >
                Guess
            </button>
        </div>
    );
};

export default PlayPage;