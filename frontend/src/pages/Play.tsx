import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/Map";
import type { LatLngExpression } from "leaflet";
import { useUser } from "../UserContext";

const PlayPage = () => {
    const navigate = useNavigate();
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [imageFileName, setImageFileName] = useState<string | null>(null);
    const [correctLocation, setCorrectLocation] = useState<LatLngExpression | null>(null);
    const { user } = useUser();
    const hasInitialized = useRef(false);

    // REF + HEIGHT STATE
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapHeight, setMapHeight] = useState<number | null>(null);

    // Load available image paths
    const images = Object.fromEntries(
        Array.from({ length: 48 }, (_, i) => [
            i + 1,
            new URL(`../assets/Locations/img${i + 1}.JPG`, import.meta.url).href
        ])
    );

    // Main initialization effect
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (!user) {
            navigate("/");
            return;
        }

        const random = Math.floor(Math.random() * 48) + 1;
        setImageFileName(images[random]);

        fetch(`http://localhost:8080/locations/img${random}.JPG`)
            .then(res => res.json())
            .then(data => {
                setCorrectLocation([data.latitude, data.longitude]);
            })
            .catch(err => console.error(err));
    }, []);

    // Measure & sync map height
    useEffect(() => {
        const updateHeight = () => {
            if (mapContainerRef.current) {
                setMapHeight(mapContainerRef.current.offsetHeight);
            }
        };

        updateHeight(); // initial measurement
        window.addEventListener("resize", updateHeight);

        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const handleGuessClick = () => {
        if (!markerPosition) {
            alert("Place a pin on the map first!");
            return;
        }

        navigate("/results", {
            state: {
                guess: markerPosition,
                correctLocation
            }
        });
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",  
            justifyContent: "center",
            minHeight: "100vh",
            width: "100vw",   
            padding: "50px",
            boxSizing: "border-box",
            backgroundColor: "rgba(226, 206, 171, 1)",
        }}>
            <h1 style={{
            marginBottom: "5px", 
            marginTop: "0px"
        }}>Can you find where Beebe is?</h1>
            <p style={{marginTop: "5px"}}>Click on the map to place your marker, then click "Guess" to submit.</p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: "50px",
                    marginTop: "10px",
                    flexDirection: "row",
                    width: "100%", 
                    maxWidth: "1600px" 
                }}
            >
                {/* LEFT: MAP */}
                <div style={{ flex: 1}} ref={mapContainerRef}>
                    <InteractiveMap
                        markerPosition={markerPosition}
                        setMarkerPosition={setMarkerPosition}
                    />
                </div>

                {/* RIGHT: IMAGE */}
                <div style={{ flex: 1}}>
                    {imageFileName ? (
                        <img
                            src={imageFileName}
                            alt="Location"
                            style={{
                                width: "100%",
                                height: mapHeight ?? "auto",
                                objectFit: "cover"
                            }}
                        />
                    ) : (
                        <p>Loading location...</p>
                    )}
                </div>
            </div>

            <button
                style={{ marginTop: "16px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}}
                onClick={handleGuessClick}
            >
                Guess
            </button>
        </div>
    );
};

export default PlayPage;