import { useCallback, useEffect, useState, useContext } from "react";
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
  const [isCompact, setIsCompact] = useState(false);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleUserProfileClick = (targetUser) => {
    if (!targetUser) return;
    const baseRoute = `/${user?.role || "bachelor"}`;
    navigate(`${baseRoute}/profile/${targetUser.id}`);
  };

  // ✅ get selected user from navigation
  const selectedUser = location.state?.selectedUser;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getChatUsers();
      setUsers(res.data || []);

      setNotice("");
      if (selectedUser) {
        const contact = res.data.find(u => u.id === selectedUser.id);
        setActiveUser(contact || null);
        if (!contact) setNotice("Messaging opens once a rental request is accepted.");
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
      setNotice("Unable to load your conversations.");
    } finally {
      setLoadingUsers(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
    {notice && <p role="status" className="mb-3 text-sm">{notice}</p>}
    <div className="flex h-[calc(100vh-10.5rem)] min-h-[30rem] overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:h-[calc(100vh-9rem)]">
      {(!isCompact || !activeUser) && (
        <ChatList
          users={users}
          activeUser={activeUser}
          onSelectUser={setActiveUser}
          onUserProfileClick={handleUserProfileClick}
          loadingUsers={loadingUsers}
        />
      )}

      {(!isCompact || activeUser) && (
        <ChatBox
          activeUser={activeUser}
          currentUser={user}
          onBack={isCompact ? () => setActiveUser(null) : undefined}
        />
      )}
    </div>
    </>
  );
};

export default ChatPage;
