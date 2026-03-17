import { useEffect, useState } from "react";
import { getMyRentRequests } from "../../api/rentalApi";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchRequests();
  }, []);

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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {request.property.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                📍 {request.property.location}
              </p>

              <p className="font-medium text-gray-800 dark:text-white mt-1">
                ৳ {request.property.rent}
              </p>

              <p className="mt-3 text-gray-700 dark:text-gray-300">
                Status:{" "}
                <span className={`font-bold ${getStatusStyle(request.status)}`}>
                  {request.status}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Sent on: {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
