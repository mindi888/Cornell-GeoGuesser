import { createContext, useContext, useState } from "react";

interface UserData {
  uid: string;
  name: string;
  email: string;
  score: number;
  pfp: string;
}

//var: user, stores database stuff locally
interface UserContextType {
  user: UserData | null;
  setUser: (u: UserData | null) => void;
  addPoints: (points: number) => void;
  changePfp: (pic: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const addPoints = (points: number) => {
    if (!user) return;
    setUser({ ...user, score: user.score + points });
  };

  const changePfp = (pic: string) => {
    if(!user) return;
    setUser({...user, pfp: pic});
  }

  return (
    <UserContext.Provider value={{ user, setUser, addPoints, changePfp }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext)!;