import { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  editUser,
  deleteUser,
  toggleBanUser,
  changeUserRole,
  getUserLogs,
} from "../../api/adminUserApi";
import ConfirmModal from "../../components/ConfirmModal";
import MessageBox from "../../components/MessageBox";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [logsUserId, setLogsUserId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("info");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "bachelor",
  });
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Populate formData whenever a user is selected for edit
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        password: "", // blank for security
        role: selectedUser.role || "bachelor",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "bachelor",
      });
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setNotification("Failed to load users. Please refresh.");
      setNotificationType("error");
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteUserId(id);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDeleteUserId) return;
    try {
      await deleteUser(confirmDeleteUserId);
      setNotification("User deleted successfully.");
      setNotificationType("success");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      setNotification("Failed to delete user. Please try again.");
      setNotificationType("error");
    } finally {
      setConfirmDeleteUserId(null);
    }
  };

  const handleBan = async (id) => {
    try {
      await toggleBanUser(id);
      setNotification("User ban state updated successfully.");
      setNotificationType("success");
      fetchUsers();
    } catch (err) {
      console.error("Failed to update ban state", err);
      setNotification("Failed to update ban state. Please try again.");
      setNotificationType("error");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await changeUserRole(id, role);
      setNotification("User role updated successfully.");
      setNotificationType("success");
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
      setNotification("Failed to update user role. Please try again.");
      setNotificationType("error");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      };

      if (selectedUser?.id) {
        await editUser(selectedUser.id, payload);
        setNotification("User updated successfully.");
      } else {
        await addUser(payload);
        setNotification("User added successfully.");
      }
      setNotificationType("success");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      setNotification(
        "Failed to save user. Please check the form and try again.",
      );
      setNotificationType("error");
    }
  };

  const viewLogs = async (id) => {
    setLogsUserId(id);
    try {
      const res = await getUserLogs(id);
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "active") return !u.is_banned;
    if (filter === "banned") return u.is_banned;
    return true;
  });

  return (
    <div className="text-gray-800 dark:text-white">
      <MessageBox
        type={notificationType}
        message={notification}
        onClose={() => setNotification(null)}
        className="mb-6"
      />
      <ConfirmModal
        open={Boolean(confirmDeleteUserId)}
        title="Confirm delete"
        message="Delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmDeleteUserId(null)}
      />
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Filters */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded px-3 py-1 transition ${
            filter === "all"
              ? "bg-slate-500 text-white dark:bg-slate-400 dark:text-slate-900"
              : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`rounded px-3 py-1 transition ${
            filter === "active"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("banned")}
          className={`rounded px-3 py-1 transition ${
            filter === "banned"
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
          }`}
        >
          Banned
        </button>
        <button
          onClick={() => setSelectedUser({})}
          className="rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="bachelor">Bachelor</option>
                  </select>
                </td>
                <td>
                  {u.is_banned ? (
                    <span className="text-red-600 font-semibold">Banned</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="rounded bg-blue-500 px-2 py-1 text-white transition hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBan(u.id)}
                    className={`rounded px-2 py-1 text-white transition ${
                      u.is_banned
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {u.is_banned ? "Unban" : "Ban"}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="rounded bg-red-700 px-2 py-1 text-white transition hover:bg-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => viewLogs(u.id)}
                    className="rounded bg-green-700 px-2 py-1 text-white transition hover:bg-green-800"
                  >
                    Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {selectedUser !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-95 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {selectedUser?.id ? "Edit User" : "Add User"}
            </h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      selectedUser?.id
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required={!selectedUser?.id}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500 dark:text-gray-300"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="bachelor">Bachelor</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-3 rounded-lg mr-2 shadow-md"
                >
                  {selectedUser?.id ? "Save" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition text-gray-900 dark:text-white font-semibold px-4 py-3 rounded-lg shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsUserId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-95 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">User Logs</h3>

            {logs.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No logs available for this user.
              </p>
            ) : (
              <ul className="mb-6 space-y-3">
                {logs.map((log, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-2"
                  >
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="text-gray-800 dark:text-gray-100 ml-2">
                      {log.action}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setLogsUserId(null)}
              className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-3 rounded-lg shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
