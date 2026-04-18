import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Heart, MessageCircle, User, X } from "lucide-react";

import { getApprovedProperties, toggleWishlist } from "../../api/propertyApi";
import { getMyRentRequests, sendRentRequest } from "../../api/rentalApi";
import MessageBox from "../../components/MessageBox";
import PropertyCard from "../../components/PropertyCard";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [modalImage, setModalImage] = useState(null);
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
      property.available_from,
    ]
      .filter(Boolean)
      .map(normalizeString)
      .join(" ");

    return !searchValue || searchableText.includes(searchValue);
  });

  const fetchProperties = async () => {
    try {
      const response = await getApprovedProperties();
      setProperties(response.data);
    } catch {
      setMessage("Failed to fetch properties.");
      setMessageType("error");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const getRequestStatus = (propertyId) => {
    const request = myRequests.find((req) => req.property?.id === propertyId);
    return request ? request.status : null;
  };

  const handleRentRequest = async (propertyId) => {
    try {
      await sendRentRequest(propertyId);
      await fetchMyRequests();
      await fetchProperties();
      setMessage("Your request was sent successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to send request.");
      setMessageType("error");
    }
  };

  const handleWishlistToggle = async (propertyId) => {
    try {
      const response = await toggleWishlist(propertyId);
      const { saved } = response.data;

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                is_saved: saved,
                saved_count: Math.max(
                  (property.saved_count || 0) + (saved ? 1 : -1),
                  0,
                ),
              }
            : property,
        ),
      );

      setMessage(response.data.detail);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to update wishlist.");
      setMessageType("error");
    }
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
            Browse listings, save favorites, and send rent requests.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm text-gray-600 dark:text-gray-300 sm:items-end">
          <p>
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/bachelor/saved")}
              className="rounded-full bg-white px-4 py-2 font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-700"
            >
              Saved Properties
            </button>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No properties available.
        </p>
      ) : filteredProperties.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No properties match your search criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => {
            const status = getRequestStatus(property.id);

            const badge = status ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === "pending" &&
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200"
                } ${
                  status === "accepted" &&
                  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                } ${
                  status === "rejected" &&
                  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200"
                } ${
                  status === "cancelled" &&
                  "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {status}
              </span>
            ) : null;

            const requestDisabled =
              !property.is_available || (property.vacancy_count ?? 0) <= 0;

            const footer = (
              <div className="space-y-2">
                {!status ? (
                  <button
                    onClick={() => handleRentRequest(property.id)}
                    disabled={requestDisabled}
                    className={`w-full rounded-lg py-2.5 font-medium text-white transition ${
                      requestDisabled
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {requestDisabled ? "Currently Full" : "Request Rent"}
                  </button>
                ) : status === "pending" ? (
                  <button className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-2.5 text-gray-700">
                    Request Sent
                  </button>
                ) : status === "accepted" ? (
                  <button
                    onClick={() =>
                      navigate("/bachelor/chats", {
                        state: { selectedUser: property.owner },
                      })
                    }
                    className="w-full rounded-lg bg-green-600 py-2.5 text-white transition hover:bg-green-700"
                  >
                    Message Owner
                  </button>
                ) : (
                  <button
                    onClick={() => handleRentRequest(property.id)}
                    disabled={requestDisabled}
                    className={`w-full rounded-lg py-2.5 font-medium text-white transition ${
                      requestDisabled
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
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
                    className="flex items-center gap-2"
                    ref={(el) => (menuRefs.current[property.id] = el)}
                  >
                    <button
                      onClick={() => handleWishlistToggle(property.id)}
                      className={`rounded-full p-2 transition ${
                        property.is_saved
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      }`}
                      aria-label={
                        property.is_saved
                          ? "Remove from wishlist"
                          : "Save to wishlist"
                      }
                    >
                      <Heart
                        size={18}
                        fill={property.is_saved ? "currentColor" : "none"}
                      />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === property.id ? null : property.id,
                          )
                        }
                        className="rounded-full px-2 py-1 text-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        ...
                      </button>
                      {openMenuId === property.id && (
                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                          <button
                            onClick={() =>
                              property.owner?.id &&
                              navigate(`/bachelor/profile/${property.owner.id}`)
                            }
                            className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <User size={16} /> View Owner Profile
                          </button>
                          <button
                            onClick={() =>
                              navigate("/bachelor/chats", {
                                state: { selectedUser: property.owner },
                              })
                            }
                            className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <MessageCircle size={16} /> Message Owner
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative">
            <button
              onClick={() => setModalImage(null)}
              className="absolute right-2 top-2 text-white hover:text-gray-300"
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
