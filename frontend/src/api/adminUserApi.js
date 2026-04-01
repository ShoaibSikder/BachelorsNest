import api from "./axios";

// Users
export const getUsers = () => api.get("accounts/admin/users/");
export const addUser = (data) => api.post("accounts/admin/users/add/", data);
export const editUser = (id, data) =>
  api.patch(`accounts/admin/users/${id}/`, data); // PATCH, not PUT and no /edit/
export const deleteUser = (id) => api.delete(`accounts/admin/users/${id}/`); // DELETE, no /delete/
export const toggleBanUser = (id) =>
  api.patch(`accounts/admin/users/${id}/ban/`); // PATCH, no /toggle-ban/
export const changeUserRole = (id, role) =>
  api.patch(`accounts/admin/users/${id}/role/`, { role }); // PATCH, not POST
export const getUserLogs = (id) => api.get(`accounts/admin/users/${id}/logs/`);
