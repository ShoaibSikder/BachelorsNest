import api from "./axios";

// Get approved properties (public, paginated by the backend)
export const getApprovedProperties = (params = {}) =>
  api.get("properties/approved/", { params });

export const getSavedProperties = () => api.get("properties/saved/");

export const toggleWishlist = (id) => api.post(`properties/${id}/wishlist/`);

// Get all properties of the logged-in owner
export const getOwnerProperties = () => api.get("properties/owner/");

// Delete a property by ID
export const deleteProperty = (id) =>
  api.delete(`properties/update-delete/${id}/`);

// Update a property by ID (for edit)
export const updateProperty = (id, data, config = {}) =>
  api.put(`properties/update-delete/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
    ...config,
  });

// Add property with images
export const addProperty = (data, config = {}) =>
  api.post("properties/add/", data, {
    headers: { "Content-Type": "multipart/form-data" },
    ...config,
  });
