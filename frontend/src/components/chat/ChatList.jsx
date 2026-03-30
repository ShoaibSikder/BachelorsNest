import Loader from "./Loader";

const ChatList = ({ users = [], activeUser, onSelectUser, loadingUsers }) => {
  return (
    <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
      <h2 className="p-4 font-bold text-lg text-gray-800 dark:text-white">
        Chats
      </h2>

      {loadingUsers ? (
        <Loader text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          No chats yet.
        </div>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user?.id}
              onClick={() => onSelectUser(user)}
              className={`p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition ${
                activeUser?.id === user?.id
                  ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              {user?.username || "Unknown User"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
