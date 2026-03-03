import { useEffect, useState } from "react";
import {
  getOwnerRequests,
  updateRentRequestStatus,
} from "../../api/rentalApi";

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await getOwnerRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to load owner requests");
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
      alert(`Request ${status} successfully`);
      fetchRequests(); // refresh list
    } catch (error) {
      alert("Failed to update request");
    }
  };

  if (loading) {
    return <p className="p-6">Loading requests...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Incoming Rent Requests
      </h1>

      {requests.length === 0 ? (
        <p>No rent requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white shadow-md rounded p-4"
            >
              <h2 className="text-lg font-semibold">
                {request.property.title}
              </h2>

              <p className="text-gray-600">
                📍 {request.property.location}
              </p>

              <p className="mt-1">
                👤 Bachelor: {request.bachelor.username}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span className="font-bold">
                  {request.status}
                </span>
              </p>

              {request.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      handleUpdate(request.id, "accepted")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleUpdate(request.id, "rejected")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;
