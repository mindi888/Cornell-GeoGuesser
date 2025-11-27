import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import homeButton from "../assets/homebutton.png";
import pfp1 from "../assets/pfp/pfp1.png";
import pfp2 from "../assets/pfp/pfp2.png";
import pfp3 from "../assets/pfp/pfp3.png";
import pfp4 from "../assets/pfp/pfp4.png";
import { useUser } from "../UserContext";
import { getAuth } from "firebase/auth";

const pfps = [pfp1, pfp2, pfp3, pfp4];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, changePfp } = useUser();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const auth = getAuth();
  const curUser = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const handleHomeClick = () => navigate("/home");

  const handleProfilePicClick = (index: number, img: string) => {
    setSelectedIndex(index);
    changePfp(img);

    if (curUser && user) {
        fetch(`http://localhost:8080/users/${curUser.uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pfp: img}),
        })
        .then(res => res.json())
        .then(data => console.log("pfp updated successfully:", data))
        .catch(err => console.error("Error updating pfp:", err));
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", padding: "40px" }}>
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
        }}
      >
        <img src={homeButton} alt="Home" style={{ width: "60px" }} />
      </button>

      {/* Main Content: Two Columns */}
      <div style={{ display: "flex", gap: "50px" }}>
        {/* Left Column: Profile Picture + Button Gallery */}
        <div style={{ marginTop: "40px", marginLeft: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" }}>
          {/* Current Profile Picture */}
          <img
            src={user?.pfp}
            alt="Profile"
            style={{ width: "200px", height: "200px"}}
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
                  backgroundColor: selectedIndex === index ? "#d3d3d3" : "#fffefeff",
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
          <h1 style={{ fontSize: "50px", marginBottom: "10px", marginTop: "0px"}}>{user?.name}</h1>
          <p style={{marginBottom: "5px"}}>Total Score: {user?.score}</p>
          <p>Ranking: {/* user?.rank */}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;