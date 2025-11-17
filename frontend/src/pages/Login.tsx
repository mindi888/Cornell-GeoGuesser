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
        const output = await signIn();
          if (output) {
            setIsLoggedIn(!isLoggedIn);
            navigate("/home");
          }
        }
        
    };
  
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url("/cornell_cover.jpg")`,  
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textShadow: "0 0 10px rgba(0, 0, 0, 0.8)"
      }}
    >
    <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)", // overlay
          zIndex: 0,      //behind the context
        }}
    />
    <div
        style={{
          position: "relative",
          zIndex: 1,      // in front of image and overlay
          textAlign: "center",
          color: "white",
          textShadow: "0 0 12px rgba(0,0,0,0.9)" 
        }}
    >

      <h1 style={{ fontSize: "5rem", marginBottom: "20px" }}>
        Cornell GeoGuesser
      </h1>

        <button
            onClick={handleLoginClick}
            style={{
              padding: "12px 24px",
              fontSize: "1.2rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              color: "white",
              backgroundColor: "rgba(82, 48, 18, 0.91)"
            }}
        >
            {isLoggedIn ? "Sign Out" : "Log In"}
        </button>
      </div>
    </div>
    )
    
};

export default LoginPage;
