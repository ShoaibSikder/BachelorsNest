import api from "./axios";

export const loginUser = (data) => api.post("token/", data);

export const registerUser = (data) => api.post("accounts/register/", data);

export const getProfile = () => api.get("accounts/profile/");

export const requestPasswordReset = (data) =>
  api.post("accounts/password-reset/", data);

export const confirmPasswordReset = (data) =>
  api.post("accounts/password-reset-confirm/", data);
