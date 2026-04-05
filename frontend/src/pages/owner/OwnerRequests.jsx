import { useEffect, useState } from "react";
import { getOwnerRequests, updateRentRequestStatus } from "../../api/rentalApi";
import MessageBox from "../../components/MessageBox";

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("info");

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
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {request.property.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              📍 {request.property.location}
            </p>

            <p className="mt-2 text-gray-700 dark:text-gray-300">
              👤 {request.bachelor.username}
            </p>

            <p className="mt-2 font-bold text-gray-800 dark:text-white">
              Status: {request.status}
            </p>

            {request.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdate(request.id, "accepted")}
                  className="flex-1 bg-green-600 text-white p-2 rounded-lg"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleUpdate(request.id, "rejected")}
                  className="flex-1 bg-red-500 text-white p-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerRequests;
