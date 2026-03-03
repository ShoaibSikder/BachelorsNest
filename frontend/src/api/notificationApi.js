import api from "./axios";

// Get logged-in user's notifications
export const getNotifications = () => {
  return api.get("notifications/");
};

// (Optional) Mark notification as read
export const markNotificationAsRead = (id) => {
  return api.patch(`notifications/${id}/read/`);
};
