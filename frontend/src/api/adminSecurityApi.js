import api from "./axios";

export const getSecuritySettings = () =>
  api.get("accounts/admin/security-settings/");

export const updateSecuritySettings = (data) =>
  api.put("accounts/admin/security-settings/", data);
