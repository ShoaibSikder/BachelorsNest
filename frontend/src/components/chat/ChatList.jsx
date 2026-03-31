import Loader from "./Loader";

const ChatList = ({ users = [], activeUser, onSelectUser, loadingUsers }) => {
  // ✅ Sort users by latest message (newest first)
  const sortedUsers = [...users].sort((a, b) => {
    return new Date(b.last_timestamp || 0) - new Date(a.last_timestamp || 0);
  });

  return (
    <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
      <h2 className="p-4 font-bold text-lg text-gray-800 dark:text-white">
        Chats
      </h2>

      {loadingUsers ? (
        <Loader text="Loading users..." />
      ) : sortedUsers.length === 0 ? (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          No chats yet.
        </div>
      ) : (
        <ul>
          {sortedUsers.map((user) => (
            <li
              key={user?.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition ${
                activeUser?.id === user?.id
                  ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              {/* ✅ Profile Icon */}
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* ✅ User Info */}
              <div className="flex flex-col overflow-hidden">
                <span className="text-gray-800 dark:text-white truncate">
                  {user?.username || "Unknown User"}
                </span>

                {/* Optional: show last message */}
                {user?.last_message && (
                  <span className="text-sm text-gray-500 truncate">
                    {user.last_message}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
