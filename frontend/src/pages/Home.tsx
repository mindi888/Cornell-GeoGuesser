import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
const HomePage = () => {
    const navigate = useNavigate();

    const{user} = useUser();

    useEffect(() => {
        console.log("Profile page refresh!");
        if(!user){
            navigate("/");
        }
    });

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
