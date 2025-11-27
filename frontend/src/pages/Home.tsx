import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { signOut } from "../auth/auth";

const HomePage = () => {
    const navigate = useNavigate();
    const{user} = useUser();
    
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("Profile page refresh!");
        if(!user){
            navigate("/");
        }
    },[]);

    const handleSignOutClick = async () => {
        await signOut();
        navigate("/");
    };

    const handleProfileClick = async () => {
        navigate("/profile");
    };

    const handlePlayClick = async () => {
        navigate("/play");
    };

    return( 
      <div
        style={{
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(226, 206, 171, 1)",
        }}
        >
        {/* Map Image */}
        <div
          style={{
            position: "fixed",
            top: "280px",
            left: "74%",
            transform: "translateX(-50%)",
        }}
        >
          <img
            src="/leafletMap.png"
            alt="Bear"
            style={{
            width: "680px",
            height: "420px",
            borderRadius: "8px",
            objectFit: "cover",
            }}
          />
          <button 
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "15px 30px",
                fontSize: "1.5rem",
                backgroundColor: "rgba(82, 48, 18, 0.8)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
            }}
            onClick={handlePlayClick}>
            Play
          </button>
        </div>
        
        {/* Header */}
        <header
            style={{
            width: "100%",
            height: "100px",
            backgroundColor: "rgba(82, 48, 18, 0.91)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            color: "white",
            position: "relative",
            }}
        >
            <h1 style={{ margin: 0, fontSize: "3rem", padding: 25 }}>
            Cornell GeoGuesser
            </h1>

            {user && (
            <div style={{ position: "relative" }}>
                <img
                    src="/cover_art.png"
                    alt="Profile"
                    onClick={() => setOpen(!open)}
                    style={{
                    width: "77px",
                    height: "77px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    objectFit: "cover",
                    border: "3px solid white",
                    }}
                />

                {open && (
                    <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "80px",
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "8px",
                        //boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        minWidth: "100px",
                        zIndex: 10,
                    }}
                    >
                    <button
                        style={{
                        display: "block",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        borderBottomLeftRadius: "0",
                        borderBottomRightRadius: "0",
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        }}
                        onClick={handleProfileClick}
                    >
                        Profile
                    </button>
                    <button
                        style={{
                        display: "block",
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "0px",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        background: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        }}
                        onClick={handleSignOutClick}
                    >
                        Log Out
                    </button>
                    </div>
                )}
            </div>
            )}
        </header>
      </div>
    );
};

export default HomePage;

// <div>
// <center>
//     <h1>Welcome Home!</h1>
//     <button onClick={handlePlayClick}> Play</button>
//     <button onClick={handleProfileClick}> Profile</button>
// </center>
// </div>