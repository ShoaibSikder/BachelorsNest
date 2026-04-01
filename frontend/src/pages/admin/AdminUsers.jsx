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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    fetchUsers();
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
    if (selectedUser) {
      await editUser(selectedUser.id, formData);
    } else {
      await addUser(formData);
    }
    setSelectedUser(null);
    fetchUsers();
  };

  const viewLogs = async (id) => {
    setLogsUserId(id);
    const res = await getUserLogs(id);
    setLogs(res.data);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (filter === "active") return !u.is_banned;
    if (filter === "banned") return u.is_banned;
    return true;
  });

  return (
    <div className="text-gray-800 dark:text-white">
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser?.id ? "Edit User" : "Add User"}
            </h2>
            <form className="space-y-3" onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border p-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border p-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border p-2"
                required={!selectedUser.id}
              />
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border p-2"
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="bachelor">Bachelor</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {selectedUser?.id ? "Save" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-400 px-3 py-1 rounded"
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-black">User Logs</h3>
            {logs.length === 0 ? (
              <p className="text-black">No logs available for this user.</p>
            ) : (
              <ul className="mb-4 space-y-2">
                {logs.map((log, i) => (
                  <li key={i} className="text-black border-b pb-1">
                    <span className="font-semibold">
                      {new Date(log.timestamp).toLocaleString()}:
                    </span>{" "}
                    {log.action}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setLogsUserId(null)}
              className="px-3 py-1 bg-blue-600 text-white rounded"
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