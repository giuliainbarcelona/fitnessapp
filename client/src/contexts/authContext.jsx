import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const signIn = (user) => {
    console.log("LOGIN");
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const signOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
  };

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

export { AuthProvider, useAuth };
