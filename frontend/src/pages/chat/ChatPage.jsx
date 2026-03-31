import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import ChatList from "../../components/chat/ChatList";
import ChatBox from "../../components/chat/ChatBox";
import { getChatUsers } from "../../api/chatApi";
import { AuthContext } from "../../context/AuthContext";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ✅ get selected user from navigation
  const selectedUser = location.state?.selectedUser;

  const fetchUsers = async () => {
    try {
      const res = await getChatUsers();
      setUsers(res.data || []);

      // ✅ auto select user if came from "Message Owner"
      if (selectedUser && !res.data.find((u) => u.id === selectedUser.id)) {
        setUsers((prev) => [selectedUser, ...prev]);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatList
        users={users}
        activeUser={activeUser}
        onSelectUser={setActiveUser}
        loadingUsers={loadingUsers}
      />

      <ChatBox activeUser={activeUser} currentUser={user} />
    </div>
  );
};

export default ChatPage;
