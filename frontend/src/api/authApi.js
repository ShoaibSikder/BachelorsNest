import api from "./axios";

export const loginUser = (data) => api.post("token/", data);

export const registerUser = (data) => api.post("accounts/register/", data);

export const getProfile = () => api.get("accounts/profile/");

export const getUserProfile = (userId) => api.get(`accounts/users/${userId}/`);

export const requestPasswordReset = (data) =>
  api.post("accounts/password-reset/", data);

export const verifyPasswordResetToken = (data) =>
  api.post("accounts/password-reset-verify/", data);

export const confirmPasswordReset = (data) =>
  api.post("accounts/password-reset-confirm/", data);

export const updateProfile = (data) =>
  api.patch("accounts/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
