import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRentRequests, cancelRentRequest } from "../../api/rentalApi";
import MessageBox from "../../components/MessageBox";
import ConfirmModal from "../../components/ConfirmModal";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("info");
  const [confirmRequestId, setConfirmRequestId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMyRentRequests();
      setRequests(response.data);
    } catch {
      console.error("Failed to fetch rent requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id) => {
    setConfirmRequestId(id);
  };

  const confirmCancel = async () => {
    if (!confirmRequestId) return;

    try {
      await cancelRentRequest(confirmRequestId);
      setRequests((prev) => prev.filter((req) => req.id !== confirmRequestId));
      setNotification("Request canceled successfully.");
      setNotificationType("success");
    } catch {
      setNotification("Failed to cancel request");
      setNotificationType("error");
    } finally {
      setConfirmRequestId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-600 dark:text-gray-300">
        Loading your requests...
      </p>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 transition">
      <MessageBox
        type={notificationType}
        message={notification}
        onClose={() => setNotification(null)}
        className="mb-6"
      />
      <ConfirmModal
        open={Boolean(confirmRequestId)}
        title="Confirm cancellation"
        message="Are you sure you want to cancel this request?"
        confirmLabel="Yes, cancel"
        cancelLabel="No, keep it"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmRequestId(null)}
      />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        My Rent Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No requests yet.</p>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl"
            >
              {/* PROPERTY INFO */}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {request.property?.title || "No Title"}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                📍 {request.property?.location || "No Location"}
              </p>

              <p className="font-medium text-gray-800 dark:text-white mt-1">
                ৳ {request.property?.rent || "N/A"}
              </p>

              {/* STATUS */}
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Status:{" "}
                <span className={`font-bold ${getStatusStyle(request.status)}`}>
                  {request.status}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Sent on: {new Date(request.created_at).toLocaleDateString()}
              </p>

              {/* ACTION BUTTONS */}
              {request.status === "pending" && (
                <button
                  onClick={() => handleCancel(request.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Cancel Request
                </button>
              )}

              {request.status === "accepted" && (
                <button
                  onClick={() =>
                    navigate("/bachelor/chats", {
                      state: { selectedUser: request.property?.owner },
                    })
                  }
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                >
                  Message Owner
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
