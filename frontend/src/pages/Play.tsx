import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/Map";
import type { LatLngExpression } from "leaflet";

const PlayPage = () => {
    const navigate = useNavigate();
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [imageFileName, setImageFileName] = useState<string | null>(null);
    const [correctLocation, setCorrectLocation] = useState<LatLngExpression | null>(null);

    const images = Object.fromEntries(
        Array.from({ length: 48 }, (_, i) => [
            i + 1,
            new URL(`../assets/Locations/img${i + 1}.JPG`, import.meta.url).href
        ])
        );

    // Log marker position changes for debugging
    useEffect(() => {
        const random = Math.floor(Math.random() * 48) + 1;
        setImageFileName(images[random]);
        fetch(`http://localhost:8080/locations/img${random}.JPG`)
            .then(res => res.json())
            .then(data => {
                setCorrectLocation([data.latitude, data.longitude]);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        console.log("Marker position set to:", markerPosition);
    }, [markerPosition]);


    const handleGuessClick = async () => {
        if (!markerPosition) {
            alert("Place a pin on the map first!");
            return;
        }
        // navigate("/results", { state: { guess: markerPosition } });
        navigate("/results", { 
            state: { 
                guess: markerPosition,
                correctLocation: correctLocation // Pass as LatLngExpression
            } 
        });

    };

    return (         
        <div style={{ textAlign: "center", padding: "24px"}}>
            <h1>Can you guess where in Cornell this image is located?</h1>
            <p>Click on the map to place your marker, then click "Guess" to submit. </p>
            <div style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                marginTop: "24px",
                minHeight: "1000px"
            }}>
            <div style={{ flex: 1}}>
            <InteractiveMap
                markerPosition={markerPosition}
                setMarkerPosition={setMarkerPosition}
            />
            </div>

            {/* RIGHT: IMAGE */}
            <div style={{ flex: 1}}>
                {imageFileName ? (
                    <img src={imageFileName} 
                    alt="Location" style={{ width: "100%", objectFit: "cover"}}/>
                ) : (
                    <p>Loading location...</p>
                )}
                </div>
            </div>

            <button
                style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem" }}
                onClick={handleGuessClick}
                // disabled={!correctCoords} // Disable until coords are loaded
            >
                Guess
            </button>
        </div>
    );
};

export default PlayPage;