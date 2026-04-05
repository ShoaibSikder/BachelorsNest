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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [logsUserId, setLogsUserId] = useState(null);
  const [logs, setLogs] = useState([]);

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
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteUserId(id);
  };

  const confirmDeleteUser = async () => {
    if (!confirmDeleteUserId) return;
    try {
      await deleteUser(confirmDeleteUserId);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setConfirmDeleteUserId(null);
    }
  };

  const handleBan = async (id) => {
    await toggleBanUser(id);
    fetchUsers();
  };

  const handleRoleChange = async (id, role) => {
    await changeUserRole(id, role);
    fetchUsers();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser?.id) {
        await editUser(selectedUser.id, formData);
      } else {
        await addUser(formData);
      }
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
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
          className="bg-gray-300 px-3 py-1 rounded"
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className="bg-green-400 px-3 py-1 rounded"
        >
          Active
        </button>
        <button
          onClick={() => setFilter("banned")}
          className="bg-red-400 px-3 py-1 rounded"
        >
          Banned
        </button>
        <button
          onClick={() => setSelectedUser({})}
          className="bg-blue-500 px-3 py-1 rounded text-white"
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
                    className="border rounded px-2 py-1 bg-gray-700"
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
                    className="bg-blue-500 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBan(u.id)}
                    className={`px-2 py-1 rounded text-white ${
                      u.is_banned ? "bg-green-500" : "bg-red-600"
                    }`}
                  >
                    {u.is_banned ? "Unban" : "Ban"}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-700 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => viewLogs(u.id)}
                    className="bg-green-700 px-2 py-1 rounded text-white"
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
                <input
                  type="password"
                  placeholder={
                    selectedUser?.id
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition"
                  required={!selectedUser?.id}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-semibold">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition"
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
