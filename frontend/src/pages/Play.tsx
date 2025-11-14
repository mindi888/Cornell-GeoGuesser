import { useNavigate } from "react-router-dom";
const PlayPage = () => {
    const navigate = useNavigate();

    const handleGuessClick = async () => {
        navigate("/results");
    };

    return(
    <center>
        <h1>Where you play the game</h1>
        <h1>Leaflet goes here</h1>
        <button onClick={handleGuessClick}>Guess</button>
    </center>
    )
};

export default PlayPage;