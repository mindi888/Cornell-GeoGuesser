import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

interface UserData {
  uid: string;
  name: string;
  email: string;
  score: number;
  pfp: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
  addPoints: (points: number) => void;
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
        // Optionally fetch extra data from your backend
        const res = await fetch(`http://localhost:8080/users/${firebaseUser.uid}`);
        const data = await res.json();

        setUser({
          uid: firebaseUser.uid,
          name: data.user.name || firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          score: data.user.score || 0,
          pfp: data.user.pfp || firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addPoints = (points: number) => {
    if (!user) return;
    setUser({ ...user, score: user.score + points });
  };

  const changePfp = (pic: string) => {
    if (!user) return;
    setUser({ ...user, pfp: pic });
  };

  return (
    <UserContext.Provider value={{ user, setUser, addPoints, changePfp }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!;

// import { createContext, useContext, useState } from "react";

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   score: number;
//   pfp: string;
// }

// //var: user, stores database stuff locally
// interface UserContextType {
//   user: UserData | null;
//   setUser: (u: UserData | null) => void;
//   addPoints: (points: number) => void;
//   changePfp: (pic: string) => void;
// }

// const UserContext = createContext<UserContextType | null>(null);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserData | null>(null);

//   const addPoints = (points: number) => {
//     if (!user) return;
//     setUser({ ...user, score: user.score + points });
//   };

//   const changePfp = (pic: string) => {
//     if(!user) return;
//     setUser({...user, pfp: pic});
//   }

//   return (
//     <UserContext.Provider value={{ user, setUser, addPoints, changePfp }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext)!;