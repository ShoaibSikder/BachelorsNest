import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedProperties } from "../../api/propertyApi";
import { sendRentRequest, getMyRentRequests } from "../../api/rentalApi";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch properties
  const fetchProperties = async () => {
    try {
      const response = await getApprovedProperties();
      setProperties(response.data);
    } catch {
      console.error("Failed to fetch properties");
    }
  };

  // 🔹 Fetch my requests
  const fetchMyRequests = async () => {
    try {
      const response = await getMyRentRequests();
      setMyRequests(response.data);
    } catch {
      console.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchMyRequests();
  }, []);

  // 🔹 Send request
  const handleRentRequest = async (propertyId) => {
    try {
      await sendRentRequest(propertyId);

      // ✅ instant UI update
      setMyRequests((prev) => [
        ...prev,
        {
          property: { id: propertyId },
          status: "pending",
        },
      ]);
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to send request.");
    }
  };

  // 🔹 Get request status (FIXED)
  const getRequestStatus = (propertyId) => {
    const request = myRequests.find((req) => req.property?.id === propertyId);
    return request ? request.status : null;
  };

  // 🔹 Get full request (for chat navigation)
  const getRequestObject = (propertyId) => {
    return myRequests.find((req) => req.property?.id === propertyId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Available Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No properties available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const status = getRequestStatus(property.id);
            const request = getRequestObject(property.id);

            return (
              <div
                key={property.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl flex flex-col h-full"
              >
                {/* TOP CONTENT */}
                <div className="space-y-3">
                  {/* IMAGE */}
                  {property.images?.length > 0 && (
                    <img
                      src={
                        property.images[0].image.startsWith("http")
                          ? property.images[0].image
                          : `http://127.0.0.1:8000${property.images[0].image}`
                      }
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}

                  {/* TITLE */}
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {property.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {property.description}
                  </p>

                  {/* LOCATION */}
                  <p className="text-gray-700 dark:text-gray-300">
                    📍 {property.location}
                  </p>

                  {/* RENT */}
                  <p className="font-bold text-lg text-gray-800 dark:text-white">
                    ৳ {property.rent}
                  </p>
                </div>

                {/* BUTTON SECTION */}
                <div className="mt-auto pt-4">
                  {/* ✅ NO REQUEST */}
                  {!status && (
                    <button
                      onClick={() => handleRentRequest(property.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:scale-[1.02] transition"
                    >
                      Send Rent Request
                    </button>
                  )}

                  {/* 🟡 PENDING */}
                  {status === "pending" && (
                    <button className="w-full bg-yellow-500 text-white p-3 rounded-lg cursor-not-allowed">
                      Request Sent
                    </button>
                  )}

                  {/* 🟢 ACCEPTED */}
                  {status === "accepted" && (
                    <button
                      onClick={() => navigate(`/chat/${request?.owner}`)}
                      className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Send Message
                    </button>
                  )}

                  {/* 🔴 REJECTED */}
                  {status === "rejected" && (
                    <button
                      onClick={() => handleRentRequest(property.id)}
                      className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
                    >
                      Request Again
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BachelorHome;
