import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../config";
import {
  Send,
  AlertCircle,
  CheckCircle,
  Users,
  MessageSquare,
} from "lucide-react";

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState("broadcast");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("bachelor");
  const [selectedUser, setSelectedUser] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("notifications/admin/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get("notifications/admin/logs/");
      setLogs(response.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("notifications/admin/broadcast/", { message });
      setSuccess("Broadcast notification sent successfully!");
      setMessage("");
      setTimeout(() => setSuccess(""), 3000);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send broadcast");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleNotification = async (e) => {
    e.preventDefault();
    if (!message.trim() || !role) {
      setError("Message and role are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("notifications/admin/role/", { role, message });
      setSuccess(`Notification sent to all ${role}s!`);
      setMessage("");
      setTimeout(() => setSuccess(""), 3000);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) {
      setError("Message and user are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("notifications/admin/individual/", {
        user_id: selectedUser,
        message,
      });
      const userName = users.find(
        (u) => u.id === parseInt(selectedUser),
      )?.username;
      setSuccess(`Message sent to ${userName}!`);
      setMessage("");
      setSelectedUser("");
      setTimeout(() => setSuccess(""), 3000);
      fetchLogs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs =
    logFilter === "all" ? logs : logs.filter((log) => log.level === logFilter);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="text-gray-800 dark:text-white p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Messaging & Notifications</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Send and manage system notifications and messages.
        </p>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-300 bg-green-100 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("broadcast")}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === "broadcast"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Send size={18} className="inline mr-2" />
          Broadcast
        </button>
        <button
          onClick={() => setActiveTab("role")}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === "role"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <Users size={18} className="inline mr-2" />
          By Role
        </button>
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === "individual"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <MessageSquare size={18} className="inline mr-2" />
          Individual
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === "logs"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          <AlertCircle size={18} className="inline mr-2" />
          System Logs
        </button>
      </div>

      {activeTab === "broadcast" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            Send Broadcast Notification
          </h3>
          <form onSubmit={handleBroadcast}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Broadcast"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "role" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            Send Role-Based Notification
          </h3>
          <form onSubmit={handleRoleNotification}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bachelor">Bachelors</option>
                <option value="owner">Owners</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "individual" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Send Individual Message</h3>
          <form onSubmit={handleIndividualMessage}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Search & Select User
              </label>
              <div className="relative" ref={dropdownRef}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      if (!e.target.value) setSelectedUser("");
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser("");
                        setUserSearch("");
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 max-h-48 overflow-y-auto z-10 mt-1 shadow-lg">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(user.id);
                            setUserSearch(user.username);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition ${
                            selectedUser === user.id
                              ? "bg-blue-100 dark:bg-blue-900"
                              : "hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email} • {user.role}
                          </p>
                        </button>
                      ))
                    ) : userSearch ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No users available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Selected:{" "}
                    <span className="font-bold">
                      {users.find((u) => u.id === parseInt(selectedUser))
                        ?.username || ""}
                    </span>
                  </p>
                </div>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">System Logs & Activity</h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Filter by Level
            </label>
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    log.level === "error"
                      ? "bg-red-50 dark:bg-red-900 border-red-500"
                      : log.level === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900 border-yellow-500"
                        : log.level === "critical"
                          ? "bg-purple-50 dark:bg-purple-900 border-purple-500"
                          : "bg-blue-50 dark:bg-blue-900 border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{log.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {log.message}
                      </p>
                      {log.username && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          By: {log.username}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                      {new Date(log.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No logs found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
