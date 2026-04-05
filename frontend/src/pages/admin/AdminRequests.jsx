import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected, cancelled
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all rent requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Fetch from the admin endpoint
      const response = await fetch(API_ENDPOINTS.RENTALS_ADMIN, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError("You do not have admin access. Contact your administrator.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Transform the data to match the component structure
      const transformedRequests = (Array.isArray(data) ? data : []).map(
        (request) => ({
          id: request.id,
          userId: request.bachelor?.id,
          userName:
            request.bachelor?.first_name && request.bachelor?.last_name
              ? `${request.bachelor.first_name} ${request.bachelor.last_name}`
              : request.bachelor?.username || "Unknown User",
          userEmail: request.bachelor?.email || "N/A",
          userPhone: request.bachelor?.phone || "N/A",
          propertyId: request.property?.id,
          propertyName: request.property?.title || "Unknown Property",
          address: request.property?.location || "N/A",
          rentAmount: request.property?.rent || 0,
          status: request.status,
          requestDate: new Date(request.created_at).toISOString().split("T")[0],
          moveInDate: request.moveInDate || "N/A",
          duration: request.duration || "N/A",
          ...request,
        }),
      );

      setRequests(transformedRequests);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(`Failed to load requests: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search requests
  useEffect(() => {
    let filtered = [...requests];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    // Search by user or property (search all fields)
    if (searchTerm.trim()) {
      filtered = filtered.filter((req) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          req.userName.toLowerCase().includes(searchLower) ||
          req.userEmail.toLowerCase().includes(searchLower) ||
          req.propertyName.toLowerCase().includes(searchLower) ||
          req.address.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredRequests(filtered);
  }, [requests, filterStatus, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 dark:text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading rent requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 dark:text-white p-6">
      <div className="mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Rent Request Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all rent requests from users
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-4 space-y-2">
        <div className="space-x-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1 rounded ${filterStatus === "all" ? "bg-gray-400 dark:bg-gray-500" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1 rounded ${filterStatus === "pending" ? "bg-yellow-400" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("accepted")}
            className={`px-3 py-1 rounded ${filterStatus === "accepted" ? "bg-green-400" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-3 py-1 rounded ${filterStatus === "rejected" ? "bg-red-400" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            Rejected
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by user name, email, or property name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
        />

        {/* Result Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-center">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border-r">User</th>
              <th className="p-2 border-r">Property</th>
              <th className="p-2 border-r">Rent Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr className="border-t">
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-600 dark:text-gray-400"
                >
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-2 border-r text-left">
                    <div className="font-medium">{request.userName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {request.userEmail}
                    </div>
                  </td>
                  <td className="p-2 border-r text-left">
                    <div className="font-medium">{request.propertyName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {request.address}
                    </div>
                  </td>
                  <td className="p-2 border-r font-semibold">
                    ${request.rentAmount}/mo
                  </td>
                  <td className="p-2">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(request.status)}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRequests;
