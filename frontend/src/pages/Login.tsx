import { useState } from "react";
import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        if(isLoggedIn){
        await signOut();
        }
        else{
        await signIn();
        }
        setIsLoggedIn(!isLoggedIn);
        navigate("/home");
    };
  
  return(
    <div
        // style={{
        // width: "90vw",
        // display: "flex",
        // justifyContent: "flex-end",
        // gap: "12px",}}
    >
    <center>
    <h1>Login!</h1>
        {isLoggedIn && user && <p>Hello, {user.displayName}</p>}
        <button onClick={handleLoginClick}>
            {isLoggedIn ? "Sign Out" : "Log In"}
        </button>
    </center>
    </div>
    )
    
};

export default LoginPage;
