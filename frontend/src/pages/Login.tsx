import { useState } from "react";
import { signIn, signOut } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useUser(); // User context
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      if (isLoggedIn) {
        // Sign out
        await signOut();
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      //Sign in
      const result = await signIn();
      if (!result) return;

      const auth = getAuth();
      const curUser = auth.currentUser;

      if (curUser) {
        console.log("went into curUser if statement");
        const res = await fetch(`http://localhost:8080/users/${curUser.uid}`);
        const data = await res.json();
        setUser(data.user); // store in your UserContext
      }

      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
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
        textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
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