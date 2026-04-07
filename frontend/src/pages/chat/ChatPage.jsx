import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleUserProfileClick = (targetUser) => {
    if (!targetUser) return;
    const baseRoute = `/${user?.role || "bachelor"}`;
    navigate(`${baseRoute}/profile/${targetUser.id}`);
  };

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

  // ✅ auto set selected user as active when navigating from "Message Owner"
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const foundUser = users.find((u) => u.id === selectedUser.id);
      if (foundUser) {
        setActiveUser(foundUser);
      } else if (selectedUser.id) {
        setActiveUser(selectedUser);
      }
    }
  }, [selectedUser, users]);

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatList
        users={users}
        activeUser={activeUser}
        onSelectUser={setActiveUser}
        onUserProfileClick={handleUserProfileClick}
        loadingUsers={loadingUsers}
      />

      <ChatBox activeUser={activeUser} currentUser={user} />
    </div>
  );
};

export default ChatPage;
