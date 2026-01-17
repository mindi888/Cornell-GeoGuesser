import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import pfp1 from "./assets/pfp/pfp1.png"
import pfp2 from "./assets/pfp/pfp2.png"
import pfp3 from "./assets/pfp/pfp3.png"
import pfp4 from "./assets/pfp/pfp4.png"
import pfp5 from "./assets/pfp/pfp5.png"
import pfp6 from "./assets/pfp/pfp6.png"

const pfpMap: Record<string, string> = {
  "pfp1.png": pfp1,
  "pfp2.png": pfp2,
  "pfp3.png": pfp3,
  "pfp4.png": pfp4,
  "pfp5.png": pfp5,
  "pfp6.png": pfp6,
};

interface UserData {
  uid: string;
  name: string;
  email: string;
  score: number;
  plays: number;
  pfp: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
  addPoints: (points: number) => void;
  addPlays: () => void;
  changePfp: (pic: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);


  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("logged in");
        await new Promise(r => setTimeout(r, 600)); // wait 600ms for Firestore to finish writing

        // Optionally fetch extra data from your backend
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${firebaseUser.uid}`);
          const data = await res.json();

          const pfpFromDB = data.user.pfp;
          let pfpPath = pfp1;
          
          if (pfpFromDB?.includes('pfp')) {
            const match = pfpFromDB.match(/pfp(\d+)/);
            if (match) {
              pfpPath = pfpMap[`pfp${match[1]}.png`] || pfp1;
            }
          }
        
        setUser(
          {
          uid: firebaseUser.uid,
          name: data.user.name,
          email: firebaseUser.email || "",
          score: data.user.score || 0,
          plays: data.user.plays ?? 0,
          pfp: pfpPath,
          }
        );
        
        setLoading(false); // Move this HERE, after user is set
        } catch (error) {
          console.error("Error fetching user:", error);
          setLoading(false);
          }
        } else {
          console.log("logged out");
          setUser(null);
          setLoading(false); // Also set loading false here
      }
    });

    return unsubscribe;
  }, []);

  const addPoints = (points: number) => {
    if (!user) return;
    setUser({ ...user, score: user.score + points });
  };

  const addPlays = () => {
    if (!user) return;
    setUser({ ...user, plays: user.plays + 1 });
  };

  const changePfp = (pic: string) => {
    if (!user) return;
    setUser({ ...user, pfp: pic });
  };

  return (
    <UserContext.Provider value={{ user, setUser, addPoints, addPlays, changePfp }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!;
