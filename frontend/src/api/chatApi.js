import api from "./axios";

// Users you can chat with (owners or bachelors with accepted requests)
export const getChatUsers = async () => {
  return await api.get("/messages/users/"); // ✅ updated path
};

// Fetch messages with a specific user
export const getConversation = async (userId) => {
  return await api.get(`/messages/conversation/${userId}/`);
};

// Send a message to a specific user
export const sendMessageAPI = async (userId, content) => {
  return await api.post("/messages/send/", { receiver: userId, content });
};
