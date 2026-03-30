import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { getApprovedProperties } from "../../api/propertyApi";
import { sendRentRequest, getMyRentRequests } from "../../api/rentalApi";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [modalImage, setModalImage] = useState(null); // for lightbox
  const navigate = useNavigate();

  // 🔹 Time formatter (Facebook style)
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

  // 🔹 Get request status
  const getRequestStatus = (propertyId) => {
    const request = myRequests.find((req) => req.property?.id === propertyId);
    return request ? request.status : null;
  };

  // 🔹 Get full request object
  const getRequestObject = (propertyId) => {
    return myRequests.find((req) => req.property?.id === propertyId);
  };

  return (
    <div className="p-4 md:p-6">
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
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                {/* 🔹 HEADER (Owner + Time) */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {/* OWNER IMAGE */}
                    {property.owner?.profile_image ? (
                      <img
                        src={
                          property.owner.profile_image.startsWith("http")
                            ? property.owner.profile_image
                            : `http://127.0.0.1:8000${property.owner.profile_image}`
                        }
                        alt="owner"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                        {property.owner?.username?.charAt(0) || "U"}
                      </div>
                    )}

                    {/* OWNER NAME + LOCATION + TIME */}
                    <div>
                      <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                        {property.owner?.username || "Unknown Owner"}
                      </h2>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        📍 {property.location} •{" "}
                        {formatTime(property.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* THREE DOT MENU */}
                  <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    ⋯
                  </button>
                </div>

                {/* 🔹 IMAGES (Collage style) */}
                {property.images?.length > 0 && (
                  <div className="grid gap-1 w-full">
                    {property.images.length === 1 && (
                      <img
                        src={
                          property.images[0].image.startsWith("http")
                            ? property.images[0].image
                            : `http://127.0.0.1:8000${property.images[0].image}`
                        }
                        alt={`${property.title} 1`}
                        className="w-full h-60 object-cover rounded cursor-pointer"
                        onClick={() => setModalImage(property.images[0].image)}
                      />
                    )}

                    {property.images.length === 2 && (
                      <div className="grid grid-cols-2 gap-1">
                        {property.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={
                              img.image.startsWith("http")
                                ? img.image
                                : `http://127.0.0.1:8000${img.image}`
                            }
                            alt={`${property.title} ${idx + 1}`}
                            className="w-full h-40 object-cover rounded cursor-pointer"
                            onClick={() =>
                              setModalImage(
                                img.image.startsWith("http")
                                  ? img.image
                                  : `http://127.0.0.1:8000${img.image}`,
                              )
                            }
                          />
                        ))}
                      </div>
                    )}

                    {property.images.length === 3 && (
                      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60">
                        <img
                          src={
                            property.images[0].image.startsWith("http")
                              ? property.images[0].image
                              : `http://127.0.0.1:8000${property.images[0].image}`
                          }
                          alt={`${property.title} 1`}
                          className="row-span-2 w-full h-full object-cover rounded cursor-pointer"
                          onClick={() =>
                            setModalImage(property.images[0].image)
                          }
                        />
                        <img
                          src={
                            property.images[1].image.startsWith("http")
                              ? property.images[1].image
                              : `http://127.0.0.1:8000${property.images[1].image}`
                          }
                          alt={`${property.title} 2`}
                          className="w-full h-full object-cover rounded cursor-pointer"
                          onClick={() =>
                            setModalImage(property.images[1].image)
                          }
                        />
                        <img
                          src={
                            property.images[2].image.startsWith("http")
                              ? property.images[2].image
                              : `http://127.0.0.1:8000${property.images[2].image}`
                          }
                          alt={`${property.title} 3`}
                          className="w-full h-full object-cover rounded cursor-pointer"
                          onClick={() =>
                            setModalImage(property.images[2].image)
                          }
                        />
                      </div>
                    )}

                    {property.images.length >= 4 && (
                      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60 relative">
                        {property.images.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={
                              img.image.startsWith("http")
                                ? img.image
                                : `http://127.0.0.1:8000${img.image}`
                            }
                            alt={`${property.title} ${idx + 1}`}
                            className="w-full h-full object-cover rounded cursor-pointer"
                            onClick={() =>
                              setModalImage(
                                img.image.startsWith("http")
                                  ? img.image
                                  : `http://127.0.0.1:8000${img.image}`,
                              )
                            }
                          />
                        ))}

                        {property.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-2xl font-bold rounded">
                            +{property.images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 🔹 CONTENT */}
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {property.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">
                      ৳ {property.rent}
                    </p>

                    {/* STATUS BADGE */}
                    {status && (
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
                          ${status === "pending" && "bg-yellow-100 text-yellow-700"}
                          ${status === "accepted" && "bg-green-100 text-green-700"}
                          ${status === "rejected" && "bg-red-100 text-red-700"}
                        `}
                      >
                        {status}
                      </span>
                    )}
                  </div>

                  {/* 🔹 BUTTON */}
                  <div className="mt-4">
                    {!status && (
                      <button
                        onClick={() => handleRentRequest(property.id)}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                      >
                        Request Rent
                      </button>
                    )}

                    {status === "pending" && (
                      <button className="w-full bg-gray-300 text-gray-700 py-2.5 rounded-lg cursor-not-allowed">
                        Request Sent
                      </button>
                    )}

                    {status === "accepted" && (
                      <button
                        onClick={() => navigate(`/chat/${request?.owner}`)}
                        className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition"
                      >
                        Message Owner
                      </button>
                    )}

                    {status === "rejected" && (
                      <button
                        onClick={() => handleRentRequest(property.id)}
                        className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition"
                      >
                        Request Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔹 IMAGE MODAL */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <img
              src={modalImage}
              alt="Large view"
              className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BachelorHome;
