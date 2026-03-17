import api from "./axios";

// Get all approved properties (public)
export const getApprovedProperties = () => api.get("properties/approved/");

// Get all properties of the logged-in owner
export const getOwnerProperties = () => api.get("properties/owner/");

// Delete a property by ID
export const deleteProperty = (id) =>
  api.delete(`properties/update-delete/${id}/`);

// Update a property by ID (for edit)
export const updateProperty = (id, data) =>
  api.put(`properties/update-delete/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Add property with images
export const addProperty = (data) =>
  api.post("properties/add/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
