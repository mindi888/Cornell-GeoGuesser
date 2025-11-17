import { useLocation, useNavigate } from "react-router-dom";
import L, { LatLngExpression } from "leaflet";
import 'leaflet/dist/leaflet.css';

interface ResultsState {
    guess: LatLngExpression;
}

const ResultsPage = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state as ResultsState;
    const guess = state.guess;

    const correctLocation: LatLngExpression = [42.4470, -76.4832]; // Cornell coords

    const distMeters = L.latLng(guess).distanceTo(L.latLng(correctLocation));

    fetch("/backend/api/users/update-score", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: distMeters }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Score updated successfully:", data);
    })
    .catch((error) => {
        console.error("Error updating score:", error);
    });

    const handlePlayClick = async () => {
        navigate("/play");
    };
    const handleHomeClick = async () => {
        navigate("/home");
    };

    return(
        <div>
        <center>
            <h1>Results</h1>
            <p>Your distance from goal: {distMeters.toFixed(2)} meters</p>
            <button onClick={handlePlayClick}> Play Again</button>
            <button onClick={handleHomeClick}> Home</button>
        </center>
        </div>
    )
};

export default ResultsPage;