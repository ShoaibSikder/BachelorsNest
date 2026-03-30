import { useEffect, useState, useContext } from "react";
import ChatList from "../../components/chat/ChatList";
import ChatBox from "../../components/chat/ChatBox";
import { getChatUsers } from "../../api/chatApi";
import { AuthContext } from "../../context/AuthContext";

const ChatPage = () => {
  const { user } = useContext(AuthContext); // ✅ always get from context

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getChatUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]); // ✅ prevent crash
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-full rounded-xl overflow-hidden shadow-xl">
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
