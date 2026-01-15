import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import pfp1 from "./assets/pfp/pfp1.png"

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
        
        // Optionally fetch extra data from your backend
        try {
          const res = await fetch(`http://localhost:8080/users/${firebaseUser.uid}`);
          const data = await res.json();

        
        setUser(
          {
          uid: firebaseUser.uid,
          name: data.user.name,
          email: firebaseUser.email || "",
          score: data.user.score || 0,
          plays: data.user.plays ?? 0,
          pfp: data.user.pfp || pfp1,
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
  }, [auth]);

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
