import api from "./axios";

export const sendRentRequest = (propertyId) =>
  api.post("rentals/request/", {
    property: propertyId,
  });
