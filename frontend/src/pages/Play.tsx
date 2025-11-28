import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../components/Map";
import type { LatLngExpression } from "leaflet";
import { useUser } from "../UserContext";

const TIME_LIMIT_SECONDS = 30;

const PlayPage = () => {
    const navigate = useNavigate();
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [imageFileName, setImageFileName] = useState<string | null>(null);
    const [correctLocation, setCorrectLocation] = useState<LatLngExpression | null>(null);
    const { user } = useUser();
    const hasInitialized = useRef(false);

    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
    const [hasTimedOut, setHasTimedOut] = useState(false);

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

    useEffect(() => {
        // Stop the timer if the game hasn't initialized yet or if the time has run out
        if (!correctLocation || timeLeft === 0 || hasTimedOut) {
            return;
        }

        // Decrease the timer every second
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    
                    // Trigger the time-out action
                    handleTimeOut(); 
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(timer);
    }, [correctLocation, timeLeft, hasTimedOut]);

    const handleTimeOut = () => {
        setHasTimedOut(true); // Stop the timer loop

        // Navigate to results with a special state indicating time ran out
        navigate("/results", {
            state: {
                guess: null, // No guess was made
                correctLocation: correctLocation,
                timedOut: true
            }
        });
    };

    // Update handleGuessClick to prevent interaction after timeout
    const handleGuessClick = () => {
        // If the game has already timed out, do nothing
        if (hasTimedOut) return; 

        if (!markerPosition) {
            alert("Place a pin on the map first!");
            return;
        }

        // Navigate normally on a successful guess
        navigate("/results", {
            state: {
                guess: markerPosition,
                correctLocation: correctLocation,
                timedOut: false // Explicitly set to false
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
            padding: "30px",
            boxSizing: "border-box",
            backgroundColor: "rgba(226, 206, 171, 1)",
        }}>
            <h1 style={{
            marginBottom: "0px", 
            marginTop: "0px"
        }}>Can you find where Beebe is?</h1>
            <p style={{marginTop: "2px"}}>Click on the map to place your marker, then click "Guess" to submit.</p>
            <h2 style={{ color: timeLeft <= 10 ? 'red' : 'green', fontSize: '1.25rem', marginBottom: '8px', marginTop: "0px"}}>
                Time Left: {timeLeft}s
            </h2>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: "30px",
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
                style={{ marginTop: "10px", padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "rgba(82, 48, 18, 0.8)", color: "white"}}
                onClick={handleGuessClick}
                disabled={hasTimedOut || !correctLocation} // Disable if timed out or still loading
            >
                {hasTimedOut ? "Time's Up!" : "Guess"}
            </button>
        </div>
    );
};

export default PlayPage;