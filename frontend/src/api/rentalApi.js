import api from "./axios";

export const sendRentRequest = (propertyId) =>
  api.post("rentals/request/", { property: propertyId });

export const getMyRentRequests = () => api.get("rentals/bachelor/");

export const getOwnerRequests = () => api.get("rentals/owner/");

export const updateRentRequestStatus = (id, status) =>
  api.patch(`rentals/update/${id}/`, { status });

export const cancelRentRequest = (id) => api.delete(`/rentals/delete/${id}/`);
