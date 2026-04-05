import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X } from "lucide-react";
import { getOwnerProperties, deleteProperty } from "../../api/propertyApi";
import MessageBox from "../../components/MessageBox";
import ConfirmModal from "../../components/ConfirmModal";
import PropertyCard from "../../components/PropertyCard";
const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("info");
  const [confirmDeletePropertyId, setConfirmDeletePropertyId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getOwnerProperties();
        setProperties(response.data);
      } catch (err) {
        console.error("Failed to load properties:", err);
        setError("Error getting properties.");
        setNotification("Error loading your properties. Please refresh.");
        setNotificationType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Handle delete
  const handleDelete = (id) => {
    setConfirmDeletePropertyId(id);
  };

  const confirmDeleteProperty = async () => {
    if (!confirmDeletePropertyId) return;

    try {
      await deleteProperty(confirmDeletePropertyId);
      setProperties((prev) =>
        prev.filter((p) => p.id !== confirmDeletePropertyId),
      );
      setNotification("Property deleted successfully.");
      setNotificationType("success");
    } catch (err) {
      console.error("Failed to delete property:", err);
      setNotification("Failed to delete property. Please try again.");
      setNotificationType("error");
    } finally {
      setConfirmDeletePropertyId(null);
    }
  };

  // Handle edit
  const handleEdit = (id) => navigate(`/owner/properties/edit/${id}`);

  // Format date
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInsideAnyMenu = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(e.target),
      );
      if (!isInsideAnyMenu) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading)
    return (
      <p className="text-gray-600 dark:text-gray-300">Loading properties...</p>
    );
  if (error)
    return (
      <>
        <MessageBox
          type={notificationType}
          message={notification || error}
          onClose={() => setNotification(null)}
          className="mb-6"
        />
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </>
    );
  if (!properties.length)
    return (
      <>
        <MessageBox
          type={notificationType}
          message={notification}
          onClose={() => setNotification(null)}
          className="mb-6"
        />
        <p className="text-gray-600 dark:text-gray-300">
          You have no properties yet.
        </p>
      </>
    );

  return (
    <div>
      <MessageBox
        type={notificationType}
        message={notification}
        onClose={() => setNotification(null)}
        className="mb-6"
      />
      <ConfirmModal
        open={Boolean(confirmDeletePropertyId)}
        title="Confirm delete"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteProperty}
        onCancel={() => setConfirmDeletePropertyId(null)}
      />
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          My Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const badge = (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  property.is_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {property.is_approved ? "Approved ✅" : "Pending ⏳"}
              </span>
            );

            return (
              <PropertyCard
                key={property.id}
                property={property}
                onImageClick={(imgUrl) => setModalImage(imgUrl)}
                badge={badge}
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
                      className="text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 font-bold text-xl px-2 py-1 rounded-full transition"
                    >
                      ⋯
                    </button>
                    {openMenuId === property.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(property.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      </div>

      {/* IMAGE MODAL */}
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

export default OwnerProperties;
