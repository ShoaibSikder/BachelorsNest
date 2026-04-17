import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { X, MessageCircle, User } from "lucide-react";
import { getApprovedProperties } from "../../api/propertyApi";
import { sendRentRequest, getMyRentRequests } from "../../api/rentalApi";
import MessageBox from "../../components/MessageBox";
import PropertyCard from "../../components/PropertyCard";
const BachelorHome = () => {
  const [properties, setProperties] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [modalImage, setModalImage] = useState(null); // for lightbox
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();
  const { searchText = "" } = useOutletContext() || {};

  const normalizeString = (value) => String(value || "").toLowerCase();
  const searchValue = searchText.trim().toLowerCase();

  const filteredProperties = properties.filter((property) => {
    const searchableText = [
      property.title,
      property.description,
      property.location,
      property.property_type,
      property.owner?.username,
    ]
      .filter(Boolean)
      .map(normalizeString)
      .join(" ");

    return !searchValue || searchableText.includes(searchValue);
  });

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

  // Handle clicks outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

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
      setMessage("Your request was sent successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to send request.");
      setMessageType("error");
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
      <MessageBox
        type={messageType}
        message={message}
        onClose={() => setMessage(null)}
        className="mb-6"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Available Properties
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Search properties from the sidebar.
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredProperties.length} of {properties.length} properties
        </p>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No properties available.
        </p>
      ) : filteredProperties.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No properties match your search or filter criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const status = getRequestStatus(property.id);
            const request = getRequestObject(property.id);

            const badge = status ? (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium
                  ${status === "pending" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200"}
                  ${status === "accepted" && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"}
                  ${status === "rejected" && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200"}
                `}
              >
                {status}
              </span>
            ) : null;

            const footer = (
              <div>
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
                    onClick={() =>
                      navigate("/bachelor/chats", {
                        state: { selectedUser: property.owner },
                      })
                    }
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
            );

            return (
              <PropertyCard
                key={property.id}
                property={property}
                onImageClick={(imgUrl) => setModalImage(imgUrl)}
                onOwnerClick={(owner) =>
                  owner?.id && navigate(`/bachelor/profile/${owner.id}`)
                }
                badge={badge}
                footer={footer}
                headerRight={
                  <div
                    className="relative"
                    ref={(el) => (menuRefs.current[property.id] = el)}
                  >
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === property.id ? null : property.id,
                        )
                      }
                      className="text-xl px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      ⋯
                    </button>
                    {openMenuId === property.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() =>
                            property.owner?.id &&
                            navigate(`/bachelor/profile/${property.owner.id}`)
                          }
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <User size={16} /> View Owner Profile
                        </button>
                        <button
                          onClick={() =>
                            navigate("/bachelor/chats", {
                              state: { selectedUser: property.owner },
                            })
                          }
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <MessageCircle size={16} /> Message Owner
                        </button>
                      </div>
                    )}
                  </div>
                }
              />
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
