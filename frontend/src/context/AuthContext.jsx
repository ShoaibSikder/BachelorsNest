import { createContext, useState, useEffect } from "react";
import { loginUser, getProfile } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const response = await loginUser(data);

    // Save tokens
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    // Fetch profile to get role
    const profile = await getProfile();
    setUser(profile.data);

    return profile.data; // return full user object with role
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await getProfile();
          setUser(profile.data);
        } catch (error) {
          logout();
        }
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
