import { useLocation, useNavigate } from "react-router-dom";
import L, { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
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
  const { guess, correctLocation, timedOut } = location.state as ResultsState;

  const distMeters =
    guess && correctLocation
      ? L.latLng(correctLocation).distanceTo(L.latLng(guess))
      : Infinity;

  const auth = getAuth();
  const { user, addPoints } = useUser();
  const [pointsEarned, setPointsEarned] = useState(0);

  const customMarker = new L.Icon({
    iconUrl: "/Bear-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowSize: [50, 50],
    shadowAnchor: [20, 50],
  });

  const getScore = (dist: number) => {
    if (timedOut || dist > 3000) {
      return 0;
    }
    const scoreCutOffs = [3000, 2000, 1200, 700, 350, 200, 100, 50, 25, 10, 0];
    for (let i = 1; i < scoreCutOffs.length; i++) {
      if (dist > scoreCutOffs[i]) {
        return Math.round(
          (10 * (dist - scoreCutOffs[i])) / (scoreCutOffs[i] - scoreCutOffs[i - 1]) +
            10 * i
        );
      }
    }
    return -10000;
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Unique key per user+round
    const roundKey = `scored-${user.uid}-${JSON.stringify(correctLocation)}-${JSON.stringify(
      guess
    )}`;
    const pointsKey = `${roundKey}-points`;

    // If already scored, restore pointsEarned
    const storedPoints = localStorage.getItem(pointsKey);
    if (storedPoints) {
      setPointsEarned(parseInt(storedPoints, 10));
      return;
    }

    // Otherwise calculate and award
    let earned = 0;
    if (timedOut) {
      earned = 0;
    } else if (guess) {
      earned = getScore(distMeters);
    }

    setPointsEarned(earned);
    addPoints(earned);

    const curUser = auth.currentUser;
    if (curUser) {
      fetch(`http://localhost:8080/users/${curUser.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: user.score + earned }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Score updated successfully:", data))
        .catch((err) => console.error("Error updating score:", err));
    }

    // Mark round as scored and persist earned points
    localStorage.setItem(roundKey, "true");
    localStorage.setItem(pointsKey, earned.toString());
  }, [user, timedOut, guess, correctLocation, distMeters, navigate, addPoints, auth]);

  const handlePlayClick = () => navigate("/play");
  const handleHomeClick = () => navigate("/home");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: "24px",
        boxSizing: "border-box",
        backgroundColor: "rgba(226, 206, 171, 1)",
      }}
    >
      {timedOut ? (
        <h1 style={{ color: "red" }}>Time's Up! Beebe Got Away!</h1>
      ) : (
        <h1>Results</h1>
      )}

      {guess ? (
        <MapContainer center={correctLocation} zoom={13} style={{ width: "800px", height: "400px" }}>
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

          <Polyline positions={[guess, correctLocation]} pathOptions={{ color: "red", weight: 3 }} />
        </MapContainer>
      ) : (
        <div
          style={{
            width: "800px",
            height: "400px",
            border: "2px solid red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>The correct location is not revealed when time runs out.</h2>
        </div>
      )}

      <p style={{ marginBottom: "5px" }}>
        {timedOut ? `Distance: N/A` : `Your distance from Beebe: ${distMeters.toFixed(2)} meters`}
      </p>
      <p style={{ marginBottom: "5px", marginTop: "0px" }}>Points Earned: {pointsEarned}</p>
      <p style={{ marginBottom: "5px", marginTop: "0px" }}>Total Points: {user?.score}</p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <button
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            fontSize: "1.1rem",
            backgroundColor: "rgba(82, 48, 18, 0.8)",
            color: "white",
          }}
          onClick={handlePlayClick}
        >
          Play Again
        </button>
        <button
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            fontSize: "1.1rem",
            backgroundColor: "rgba(82, 48, 18, 0.8)",
            color: "white",
          }}
          onClick={handleHomeClick}
        >
          <img src={homeButton} alt="Home" style={{ width: "30px", filter: "invert(1)" }} />
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
