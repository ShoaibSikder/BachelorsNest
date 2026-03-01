import api from "./axios";

export const getApprovedProperties = () =>
  api.get("properties/");
