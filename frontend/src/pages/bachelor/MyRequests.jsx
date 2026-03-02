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
      } catch (error) {
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
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  if (loading) {
    return <p className="p-6">Loading your requests...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Rent Requests</h1>

      {requests.length === 0 ? (
        <p>You have not sent any rent requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white shadow-md rounded p-4">
              {/* Property Title */}
              <h2 className="text-lg font-semibold">
                {request.property.title}
              </h2>

              {/* Property Location */}
              <p className="text-gray-600 mt-1">
                📍 {request.property.location}
              </p>

              {/* Rent */}
              <p className="mt-1 font-medium">৳ {request.property.rent}</p>

              {/* Status */}
              <p className="mt-3">
                Status:{" "}
                <span className={`font-bold ${getStatusStyle(request.status)}`}>
                  {request.status}
                </span>
              </p>

              {/* Date */}
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
