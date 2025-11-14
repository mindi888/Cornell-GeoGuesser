import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
    const navigate = useNavigate();

    const handleHomeClick = async () => {
        navigate("/home");
    };

    return(
    <center>
        <h1>Where your cute profile lives</h1>
        <button onClick={handleHomeClick}> Home</button>
    </center>
    )
};

export default ProfilePage;