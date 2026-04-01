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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [logsUserId, setLogsUserId] = useState(null);
  const [logs, setLogs] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "bachelor",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter & search
  useEffect(() => {
    let data = users;
    if (search) {
      data = data.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (roleFilter) {
      data = data.filter((u) => u.role === roleFilter);
    }
    if (statusFilter) {
      data = data.filter((u) =>
        statusFilter === "active" ? !u.is_banned : u.is_banned,
      );
    }
    setFilteredUsers(data);
  }, [search, roleFilter, statusFilter, users]);

  // Handlers
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

  const openEditModal = (user) => {
    setEditUserData(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditUserData(null);
    setFormData({ username: "", email: "", password: "", role: "bachelor" });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editUserData) {
      await editUser(editUserData.id, formData);
    } else {
      await addUser(formData);
    }
    setModalOpen(false);
    fetchUsers();
  };

  const viewLogs = async (id) => {
    setLogsUserId(id);
    const res = await getUserLogs(id);
    setLogs(res.data);
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="bachelor">Bachelor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-500">
            <tr>
              <th className="p-3">Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t text-gray-800">
                <td className="p-3">{user.username}</td>
                <td>{user.email}</td>

                {/* Role */}
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 bg-blue-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="bachelor">Bachelor</option>
                  </select>
                </td>

                {/* Status */}
                <td>
                  {user.is_banned ? (
                    <span className="text-red-500">Banned</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>

                <td>{new Date(user.date_joined).toLocaleDateString()}</td>

                {/* Actions */}
                <td className="space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBan(user.id)}
                    className="px-3 py-1 bg-orange-600 text-white rounded"
                  >
                    {user.is_banned ? "Unban" : "Ban"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => viewLogs(user.id)}
                    className="px-3 py-1 bg-gray-700 text-white rounded"
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
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded shadow-lg w-96"
          >
            <h3 className="text-xl font-bold mb-4">
              {editUserData ? "Edit User" : "Add User"}
            </h3>

            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="mb-2 p-2 w-full border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mb-2 p-2 w-full border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mb-2 p-2 w-full border rounded"
              required={!editUserData}
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="mb-4 p-2 w-full border rounded"
            >
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="bachelor">Bachelor</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                {editUserData ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs Modal */}
      {logsUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
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
