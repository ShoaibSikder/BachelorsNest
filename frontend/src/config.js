// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Rentals
  RENTALS_ADMIN: `${API_BASE_URL}/api/rentals/admin/`,
  RENTALS_OWNER: `${API_BASE_URL}/api/rentals/owner/`,
  RENTALS_BACHELOR: `${API_BASE_URL}/api/rentals/bachelor/`,
  RENTAL_UPDATE: (id) => `${API_BASE_URL}/api/rentals/update/${id}/`,
  RENTAL_DELETE: (id) => `${API_BASE_URL}/api/rentals/delete/${id}/`,

  // Properties
  PROPERTIES_LIST: `${API_BASE_URL}/api/properties/`,
  PROPERTY_DETAIL: (id) => `${API_BASE_URL}/api/properties/${id}/`,
};

export default API_BASE_URL;
