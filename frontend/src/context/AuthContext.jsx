import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  getProfile,
  requestPasswordReset,
  confirmPasswordReset,
  updateProfile as updateProfileApi,
} from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    const response = await loginUser(data);

    // Save tokens
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    // Fetch profile to get role
    const profile = await getProfile();
    setUser(profile.data);
    setLoading(false);

    return profile.data; // return full user object with role
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const resetPasswordRequest = async (email) => {
    return await requestPasswordReset({ email });
  };

  const resetPasswordConfirm = async (token, newPassword) => {
    return await confirmPasswordReset({ token, new_password: newPassword });
  };

  const updateProfile = async (data) => {
    const response = await updateProfileApi(data);
    setUser(response.data);
    return response.data;
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
      setLoading(false);
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        resetPasswordRequest,
        resetPasswordConfirm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
