import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOwnerRequests, updateRentRequestStatus } from "../../api/rentalApi";
import MessageBox from "../../components/MessageBox";

const getImageUrl = (image) =>
  image?.startsWith("http") ? image : `http://127.0.0.1:8000${image}`;

const formatTime = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const posted = new Date(dateString);
  const diff = Math.floor((now - posted) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return posted.toLocaleDateString();
};

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("info");
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const response = await getOwnerRequests();
      setRequests(response.data);
    } catch {
      console.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateRentRequestStatus(id, status);
      fetchRequests();
      setNotification(
        `Request ${status === "accepted" ? "accepted" : "rejected"} successfully.`,
      );
      setNotificationType("success");
    } catch {
      setNotification("Failed to update request");
      setNotificationType("error");
    }
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const handleProfileClick = (user) => {
    if (user?.id) {
      navigate(`/owner/profile/${user.id}`);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-600 dark:text-gray-300">Loading requests...</p>
    );
  }

  return (
    <div>
      <MessageBox
        type={notificationType}
        message={notification}
        onClose={() => setNotification(null)}
        className="mb-6"
      />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Incoming Requests
      </h2>

      <div className="space-y-5">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >
            {/* Header with Profile and Username */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleProfileClick(request.bachelor)}
                    className="flex items-center gap-3 text-left bg-white dark:bg-gray-900 rounded-xl p-2"
                    aria-label={`View profile of ${request.bachelor?.username || "user"}`}
                  >
                    {request.bachelor?.profile_image ? (
                      <img
                        src={getImageUrl(request.bachelor.profile_image)}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {request.bachelor?.username?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.bachelor?.username || "Unknown User"}
                      </h3>
                    </div>
                  </button>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTime(request.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
                {request.property.title}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  📍 {request.property.location}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                {request.property.description}
              </p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                ৳ {request.property.rent}
              </p>
            </div>

            {/* Action Buttons */}
            {request.status === "pending" && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(request.id, "accepted")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdate(request.id, "rejected")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerRequests;
