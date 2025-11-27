import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

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
    </div>
    )
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
