import api from "./axios";
import axiosInstance from "./axiosInstance";

export const sendRentRequest = (propertyId) =>
  api.post("rentals/request/", {
    property: propertyId,
  });

export const getMyRentRequests = () => {
  return axiosInstance.get("/rentals/bachelor/");
};