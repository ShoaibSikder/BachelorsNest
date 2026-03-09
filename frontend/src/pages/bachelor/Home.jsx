import { useEffect, useState } from "react";
import { getApprovedProperties } from "../../api/propertyApi";
import { sendRentRequest, getMyRentRequests } from "../../api/rentalApi";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  // ✅ Fetch Properties
  const fetchProperties = async () => {
    try {
      const response = await getApprovedProperties();
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties");
    }
  };

  // ✅ Fetch My Requests
  const fetchMyRequests = async () => {
    try {
      const response = await getMyRentRequests();
      setMyRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch my requests");
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchMyRequests();
    const interval = setInterval(() => {
      fetchMyRequests(); // refresh every 5 seconds
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Send Rent Request
  const handleRentRequest = async (propertyId) => {
    try {
      await sendRentRequest(propertyId);
      alert("Rent request sent successfully!");
      fetchMyRequests(); // refresh status after sending
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to send request.");
    }
  };

  // ✅ Check request status for property
  const getRequestStatus = (propertyId) => {
    const request = myRequests.find(
      (req) => req.property === propertyId, // IMPORTANT: property is likely ID
    );
    return request ? request.status : null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const status = getRequestStatus(property.id);

            return (
              <div key={property.id} className="bg-white shadow-md rounded p-4">
                {property.images && property.images.length > 0 && (
                  <img
                    src={
                      property.images[0].image.startsWith("http")
                        ? property.images[0].image
                        : `http://127.0.0.1:8000${property.images[0].image}`
                    }
                    alt={property.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}

                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <p className="text-gray-700 mb-1">📍 {property.location}</p>
                <p className="font-bold mb-4">৳ {property.rent}</p>

                {/* 🔥 Smart Button Logic */}

                {!status && (
                  <button
                    onClick={() => handleRentRequest(property.id)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Send Rent Request
                  </button>
                )}

                {status === "pending" && (
                  <button
                    disabled
                    className="w-full bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed"
                  >
                    Request Sent
                  </button>
                )}

                {status === "accepted" && (
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded">
                    Send Message
                  </button>
                )}

                {status === "rejected" && (
                  <button
                    disabled
                    className="w-full bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                  >
                    Rejected
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BachelorHome;
