import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import homeButton from "../assets/homebutton.png";
import pfp1 from "../assets/pfp/pfp1.png";
import pfp2 from "../assets/pfp/pfp2.png";
import pfp3 from "../assets/pfp/pfp3.png";
import pfp4 from "../assets/pfp/pfp4.png";
import pfp5 from "../assets/pfp/pfp5.png";
import pfp6 from "../assets/pfp/pfp6.png";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";

// Define the shape of the data you will fetch from the backend
interface FetchedProfileData {
    id: string;
    name: string;
    email: string;
    score: number;
    plays: number;
    pfp: string;
    rank: number;
}
const pfpFilenames = ["pfp1.png", "pfp2.png", "pfp3.png", "pfp4.png", "pfp5.png", "pfp6.png"];
const pfps = [pfp1, pfp2, pfp3, pfp4, pfp5, pfp6];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, changePfp } = useUser();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const auth = getAuth();
  const curUser = auth.currentUser;

  const [profile, setProfile] = useState<FetchedProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

if (!curUser) {
        setIsLoading(false);
        return;
    }

    const fetchProfileData = async () => {
        try {
            // Use the backend endpoint to get the user's data by UID
            const response = await fetch(`http://localhost:8080/users/${curUser.uid}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch user profile data.");
            }

            const data = await response.json();
            
            // Assuming the backend returns { user: { ...data } }
            setProfile(data.user as FetchedProfileData); 

        } catch (err) {
            console.error("Error fetching profile data with rank:", err);
            // Optionally set an error state here
        } finally {
            setIsLoading(false);
        }
    };

    fetchProfileData();

  }, [user, curUser, navigate]);

  const handleHomeClick = () => navigate("/home");

  const handleProfilePicClick = (index: number, img: string) => {
    setSelectedIndex(index);
    changePfp(img);

    if (curUser && user) {
        fetch(`http://localhost:8080/users/${curUser.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pfp: pfpFilenames[index] }),
        })
        .then(res => res.json())
        .then(data => console.log("pfp updated successfully:", data))
        .catch(err => console.error("Error updating pfp:", err));
    }
  };

  return (
    
    <div style={{ 
      position: "relative", 
      minHeight: "100vh", 
      width: "100vw", 
      padding: "40px", 
      backgroundImage: `url("/profile_background.png")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      }}>
      {/* Home Button (Top Right) */}
      <button
        onClick={handleHomeClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          padding: "10px",
          cursor: "pointer",
          zIndex: 10,
          backgroundColor: "rgba(82, 48, 18, 0.8)"
        }}
      >
        <img src={homeButton} alt="Home" style={{ width: "60px", filter: "invert(1)" }} />
      </button>

      {/* Main Content: Two Columns */}
      <div style={{ display: "flex", gap: "50px" }}>
        {/* Left Column: Profile Picture + Button Gallery */}
        <div style={{ marginTop: "30px", marginLeft: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {/* Current Profile Picture */}
          <img
            src={user?.pfp}
            alt="Profile"
            style={{ width: "250px", height: "250px", borderRadius: "50%", border: "7px solid rgba(82, 48, 18, 0.8)"}}
          />

          {/* Scrollable Button Gallery */}
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: "repeat(2, 120px)",
              gap: "20px",
              maxHeight: "60vh",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {pfps.map((img, index) => (
              <button
                key={index}
                onClick={() => handleProfilePicClick(index, img)}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "15px",
                  border: "1px solid #5b5b5bff",
                  backgroundColor: selectedIndex === index ? "rgba(47, 27, 10, 0.8)" : "rgba(82, 48, 18, 0.8)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  transition: "all 0.2s ease",
                  boxShadow: selectedIndex === index ? "0 4px 10px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <img src={img} alt={"pfp" + (index + 1)} style={{ width: "100px", height: "100px" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Profile Info */}
        <div style={{marginTop: "40px", marginLeft: "50px", display: "flex", flexDirection: "column", justifyContent: "flex-start", fontSize: "22px" }}>
          {/* Show loading state */}
            {isLoading && <h1>Loading...</h1>}
            
            {/* Show content once loaded */}
            {!isLoading && profile && (
                <>
                    <h1 style={{ fontSize: "50px", marginBottom: "10px", marginTop: "0px"}}>{profile.name}</h1>
                    <p style={{marginBottom: "5px"}}>Total Score: {profile.score.toFixed(0)}</p>
                    <p style={{marginBottom: "5px"}}>Average Score: {profile.plays > 0 ? (profile.score / profile.plays).toFixed(0) : 0}</p>
                    <p style={{marginBottom: "5px"}}>Total Plays: {profile.plays}</p>
                    <p>Ranking: #{profile.rank}</p> 
                    <p style={{ fontSize: "16px", color: "#888", marginTop: "5px" }}></p>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;