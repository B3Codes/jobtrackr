// AuthContext.jsx

import { createContext, useContext, useState } from 'react';

// create context for auth
const AuthContext = createContext();

// Provide component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUSer] = useState(null); // user data like name/email
  // token from local storage
  const [token, setToken] = useState(localStorage.getItem('token') || "");

  // login function - saves token + user info
  const login = (userData, jwt) => {
    console.log("User Data:", userData); // Log the user data for debugging
    console.log("JWT:", jwt); // Log the JWT for debugging
    setUSer(userData);
    setToken(jwt);
    localStorage.setItem('token', jwt); // save token to local storage
    console.log("Token saved to local storage:", localStorage.getItem('token')); // Log the token saved to local storage
  };

  // logout function - clears token + user info
  const logout = () => {
    setUSer(null);
    setToken("");
    localStorage.removeItem('token'); // remove token from local storage
  };


  return (
    <AuthContext.Provider value={{user, token, login, logout}}>
      {children}
    </AuthContext.Provider>
  )

}

// custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);