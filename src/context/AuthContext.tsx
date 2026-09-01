import { getCurrentUser } from "@/lib/appwrite/api";
import { isAppwriteConfigured } from "@/lib/appwrite/config";
import { CURRENT_DEMO_USER, getStoredUser } from "@/lib/mock/mockData";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER: IUser = CURRENT_DEMO_USER;

export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: true,
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
  const [user, setUser] = useState<IUser>(getStoredUser() || INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const navigate = useNavigate();

  const loginAsDemoUser = () => {
    const demoUser = getStoredUser() || INITIAL_USER;
    setUser(demoUser);
    setIsAuthenticated(true);
    localStorage.setItem("meowbox_logged_in", "true");
    navigate("/");
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      if (!isAppwriteConfigured) {
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

      // If appwrite configured but no session
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAppwriteConfigured) {
      if (
        localStorage.getItem("cookieFallback") === "[]" ||
        localStorage.getItem("cookieFallback") === null
      ) {
        // Appwrite session check
        checkAuthUser();
      } else {
        checkAuthUser();
      }
    } else {
      // Demo / Mock mode is enabled by default
      const loggedIn = localStorage.getItem("meowbox_logged_in");
      if (loggedIn === "false") {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUser(getStoredUser() || INITIAL_USER);
      }
    }
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
