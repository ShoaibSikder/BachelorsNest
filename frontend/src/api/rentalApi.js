import api from "./axios";
import axiosInstance from "./axiosInstance";

export const sendRentRequest = (propertyId) =>
  api.post("rentals/request/", {
    property: propertyId,
  });

export const getMyRentRequests = () => {
  return axiosInstance.get("/rentals/bachelor/");
};

// Owner - Get incoming requests
export const getOwnerRequests = () => {
  return axiosInstance.get("/rentals/owner/");
};

// Owner - Update request status
export const updateRentRequestStatus = (id, status) => {
  return axiosInstance.patch(`/rentals/update/${id}/`, {
    status: status,
  });
};
