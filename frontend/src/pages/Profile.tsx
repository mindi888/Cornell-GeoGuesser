import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useEffect } from "react";

const ProfilePage = () => {
    const navigate = useNavigate();
    const{user} = useUser();

    useEffect(() => {
        console.log("Profile page refresh!");
        if(!user){
            navigate("/");
        }
    });

    const handleHomeClick = async () => {
        navigate("/home");
    };

    return(
    <center>
        <h1>Profile</h1>
        <img></img>
        <p>{user?.name}</p>
        <p>Total Score: {user?.score}</p>
        <button onClick={handleHomeClick}> Home</button>
    </center>
    )
};

export default ProfilePage;