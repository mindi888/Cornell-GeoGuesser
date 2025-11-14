import { useNavigate } from "react-router-dom";
const ResultsPage = () => {
    const navigate = useNavigate();

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
            <button onClick={handlePlayClick}> Play Again</button>
            <button onClick={handleHomeClick}> Home</button>
        </center>
        </div>
    )
};

export default ResultsPage;