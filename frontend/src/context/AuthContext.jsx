import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  getProfile,
  requestPasswordReset,
  verifyPasswordResetToken,
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

    // Save user info from login response
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("role", response.data.role);

    const basicUser = {
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
    };

    setUser(basicUser);
    setLoading(false);

    getProfile()
      .then((profile) => setUser(profile.data))
      .catch(() => {});

    return basicUser;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const resetPasswordRequest = async (email) => {
    return await requestPasswordReset({ email });
  };

  const resetPasswordVerifyToken = async (token) => {
    return await verifyPasswordResetToken({ token });
  };

  const resetPasswordConfirm = async (token, newPassword) => {
    return await confirmPasswordReset({ token, new_password: newPassword });
  };

  const updateProfile = async (data, config = {}) => {
    const response = await updateProfileApi(data, config);
    setUser(response.data);
    return response.data;
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const cachedUser = {
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
          role: localStorage.getItem("role"),
        };

        if (cachedUser.role) {
          setUser(cachedUser);
          setLoading(false);
        }

        try {
          const profile = await getProfile();
          setUser(profile.data);
        } catch {
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
        resetPasswordVerifyToken,
        resetPasswordConfirm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
