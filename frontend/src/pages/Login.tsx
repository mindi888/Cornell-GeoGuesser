import { useState } from "react";
import { signIn, signOut } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser, changePfp } = useUser(); // User context
  const navigate = useNavigate();

  const handleLoginClick = async () => {
  try {
    const result = await signIn();
    if (result) {
      // Small delay ensures the UserContext/onAuthStateChanged 
      // listener processes the new user before you move pages.
      setTimeout(() => {
        navigate("/home");
      }, 100); 
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
};

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url("/Cover_Art.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
        position: "relative",
      }}
    >

      {/* Content */}
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundImage: `url("/cover_art.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "flex-end", // pushes content to bottom
          alignItems: "center",       // keeps it horizontally centered
          flexDirection: "column",
          paddingBottom: "5.7%",       // adjust how far up from bottom
          position: "relative",
        }}
      >

        <button
          onClick={handleLoginClick}
          style={{
            padding: "13px 24px",
            fontSize: "1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            color: "white",
            backgroundColor: "rgba(82, 48, 18, 0.91)",
          }}
        >
          {isLoggedIn ? "Sign Out" : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;