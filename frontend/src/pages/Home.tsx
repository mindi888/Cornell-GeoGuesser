import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();

    const handlePlayClick = async () => {
        navigate("/play");
    };
    const handleProfileClick = async () => {
        navigate("/profile");
    };

    return(
    <div>
    <center>
        <h1>Welcome Home!</h1>
        <button onClick={handlePlayClick}> Play</button>
        <button onClick={handleProfileClick}> Profile</button>
    </center>
    </div>
    )
};

export default HomePage;
