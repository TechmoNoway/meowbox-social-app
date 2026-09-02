import { getCurrentUser } from "@/lib/appwrite/api";
import { isAppwriteConfigured } from "@/lib/appwrite/config";
import { CURRENT_DEMO_USER, getStoredUser } from "@/lib/mock/mockData";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER: IUser = CURRENT_DEMO_USER;

export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: true,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  loginAsDemoUser: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  loginAsDemoUser: () => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const loginAsDemoUser = () => {
    const demoUser = getStoredUser() || INITIAL_USER;
    setUser(demoUser);
    setIsAuthenticated(true);
    setIsLoading(false);
    localStorage.setItem("meowbox_logged_in", "true");
    navigate("/");
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      if (!isAppwriteConfigured) {
        const loggedIn = localStorage.getItem("meowbox_logged_in");
        if (loggedIn === "false") {
          setIsAuthenticated(false);
          return false;
        }
        const storedUser = getStoredUser() || INITIAL_USER;
        setUser(storedUser);
        setIsAuthenticated(true);
        return true;
      }

      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });

        setIsAuthenticated(true);
        return true;
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
    user,
    isLoading,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    loginAsDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
