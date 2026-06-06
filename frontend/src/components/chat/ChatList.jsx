import Loader from "./Loader";
import { getMediaUrl } from "../../config";

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  return getMediaUrl(image);
};

const ChatList = ({
  users = [],
  activeUser,
  onSelectUser,
  onUserProfileClick,
  loadingUsers,
}) => {
  // ✅ Sort users by latest message (newest first)
  const sortedUsers = [...users].sort((a, b) => {
    return new Date(b.last_timestamp || 0) - new Date(a.last_timestamp || 0);
  });

  const getDisplayName = (user) => {
    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    return fullName || user?.username || "Unknown User";
  };

  return (
    <div className="h-full w-full shrink-0 overflow-y-auto border-gray-300 dark:border-gray-700 lg:w-80 lg:border-r xl:w-1/3">
      <h2 className="p-4 text-lg font-bold text-gray-800 dark:text-white">
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
              className={`flex cursor-pointer items-center gap-3 p-4 transition hover:bg-gray-200 dark:hover:bg-gray-800 ${
                activeUser?.id === user?.id
                  ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              {/* ✅ Profile Icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUserProfileClick?.(user);
                }}
                className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View profile of ${user?.username || "user"}`}
              >
                {user?.profile_image ? (
                  <img
                    src={getImageUrl(user.profile_image)}
                    alt={user.username || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </button>

              {/* ✅ User Info */}
              <div className="flex min-w-0 flex-col overflow-hidden">
                <span className="text-gray-800 dark:text-white truncate">
                  {getDisplayName(user)}
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {user?.role || "user"}
                  {user?.phone_number ? ` • ${user.phone_number}` : ""}
                </span>

                {user?.last_message && (
                  <span className="text-sm text-gray-500 truncate">
                    {user.last_message}
                  </span>
                )}

                {!user?.last_message && user?.bio && (
                  <span className="text-sm text-gray-500 truncate">
                    {user.bio}
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
