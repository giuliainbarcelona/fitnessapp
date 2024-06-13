import { createContext, useState, useContext } from "react";
import { useEffect } from "react";

const AuthContext = createContext();
const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const signIn = (user) => {
    console.log("LOGIN");
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };
  const signOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        signIn,
        signOut,
      }}
      {...props}
    />
  );
};
const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth, AuthContext };
