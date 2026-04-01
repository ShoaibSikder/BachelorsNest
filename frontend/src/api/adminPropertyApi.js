import api from "./axios"; // import the axios instance with JWT interceptor

const API = "properties"; // base path already handled in api

// 🔹 Get all properties (Admin)
export const getAllProperties = () => {
  return api.get(`${API}/admin/all/`);
};

// 🔹 Approve property
export const approveProperty = (id) => {
  return api.patch(`${API}/approve/${id}/`);
};

// 🔹 Reject property
export const rejectProperty = (id) => {
  return api.patch(`${API}/reject/${id}/`);
};

// 🔹 Delete property
export const deleteProperty = (id) => {
  return api.delete(`${API}/update-delete/${id}/`);
};

// 🔹 Update property
export const updateProperty = (id, data) => {
  return api.put(`${API}/update-delete/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
