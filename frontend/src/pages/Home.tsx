import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { signOut } from "../auth/auth";
// Define the shape of the data you expect from the backend
interface RankedUser {
    id: string;
    name: string;
    email: string;
    score: number;
    rank: number; // The new property calculated in the backend
}

const HomePage = () => {
    const navigate = useNavigate();
    const{user} = useUser();
    
    // New state to store the list of ranked users
    const [leaderboard, setLeaderboard] = useState<RankedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        console.log("Profile page refresh!");
        if(!user){
            navigate("/");
        }

        const fetchLeaderboard = async () => {
            try {
                // Fetch from the backend endpoint that returns ranked users
                const response = await fetch("http://localhost:8080/users"); 
                
                if (!response.ok) {
                    throw new Error("Failed to fetch leaderboard data.");
                }
                
                const data: RankedUser[] = await response.json();
                setLeaderboard(data);
                
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Could not load leaderboard. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
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
        {/*Leader Board*/}
        <center>
        <hr style={{ margin: "30px auto", width: "80%" }} />

            {/* Leaderboard Section */}
            <h2>Global Leaderboard</h2>
            
            {isLoading && <p>Loading rankings...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            
            {!isLoading && !error && leaderboard.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <table style={{ borderCollapse: 'collapse', width: '60%', maxWidth: '600px', margin: '20px 0' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th style={tableHeaderStyle}>Rank</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((rankedUser) => (
                                <tr 
                                    key={rankedUser.id} 
                                    style={rankedUser.id === user?.uid ? highlightedRowStyle : tableRowStyle}
                                >
                                    <td style={tableCellStyle}>{rankedUser.rank}</td>
                                    <td style={tableCellStyle}>
                                        {/* Highlight the current user's name */}
                                        {rankedUser.name} {rankedUser.id === user?.uid ? " (You)" : ""}
                                    </td>
                                    <td style={tableCellStyle}>{rankedUser.score.toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {!isLoading && !error && leaderboard.length === 0 && (
                <p>No users found yet. Be the first to play!</p>
            )}
    </center>
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

// Simple inline styles for the table (can be moved to a CSS file)
const tableHeaderStyle = { padding: '10px', textAlign: 'left', background: '#f4f4f4' } as React.CSSProperties;
const tableCellStyle = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' } as React.CSSProperties;
const tableRowStyle = { transition: 'background-color 0.2s' } as React.CSSProperties;
const highlightedRowStyle = { 
    ...tableRowStyle, 
    fontWeight: 'bold', 
    backgroundColor: '#e6ffe6', // Light green highlight
} as React.CSSProperties;

export default HomePage;

