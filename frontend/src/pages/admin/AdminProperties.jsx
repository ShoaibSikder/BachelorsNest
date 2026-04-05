import { CornerUpLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, CheckCircle, XCircle, X } from "lucide-react";
import {
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  updateProperty,
  revertPropertyPending,
} from "../../api/adminPropertyApi";
import ConfirmModal from "../../components/ConfirmModal";
import PropertyCard from "../../components/PropertyCard";

const BASE_URL = "http://127.0.0.1:8000";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await getAllProperties();
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const handleApprove = async (id) => {
    await approveProperty(id);
    fetchProperties();
  };

  const handleReject = (id) => {
    setConfirmAction({
      title: "Reject property",
      message: "Are you sure you want to reject this property?",
      onConfirm: async () => {
        await rejectProperty(id);
        fetchProperties();
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmAction({
      title: "Delete property",
      message: "Delete permanently? This cannot be undone.",
      onConfirm: async () => {
        await deleteProperty(id);
        fetchProperties();
      },
    });
  };

  const handleRevertPending = (id) => {
    setConfirmAction({
      title: "Revert property",
      message: "Revert property to pending status?",
      onConfirm: async () => {
        await revertPropertyPending(id);
        fetchProperties();
      },
    });
  };

  const filteredProperties = properties.filter((p) => {
    if (filter === "approved") return p.is_approved;
    if (filter === "pending") return !p.is_approved && !p.is_rejected;
    if (filter === "rejected") return p.is_rejected;
    return true;
  });

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inside = Object.values(menuRefs.current).some(
        (ref) => ref && ref.contains(e.target),
      );
      if (!inside) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = async () => {
    if (!confirmAction?.onConfirm) return;
    try {
      await confirmAction.onConfirm();
    } catch (err) {
      console.error("Failed to execute confirmed action", err);
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="p-4 md:p-6 text-gray-800 dark:text-white">
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
      <h2 className="text-2xl font-bold mb-6">Property Management</h2>

      {/* Filters */}
      <div className="mb-6 space-x-2">
        <button
          onClick={() => setFilter("all")}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          All
        </button>
        <button
          onClick={() => setFilter("approved")}
          className="bg-green-400 px-3 py-1 rounded"
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("pending")}
          className="bg-yellow-400 px-3 py-1 rounded"
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className="bg-red-400 px-3 py-1 rounded"
        >
          Rejected
        </button>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const badge = (
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                property.is_approved
                  ? "bg-green-100 text-green-700"
                  : property.is_rejected
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {property.is_approved
                ? "Approved"
                : property.is_rejected
                  ? "Rejected"
                  : "Pending"}
            </span>
          );

          return (
            <PropertyCard
              key={property.id}
              property={property}
              onImageClick={(imgUrl) => setModalImage(imgUrl)}
              onOwnerClick={(owner) =>
                owner?.id && navigate(`/admin/profile/${owner.id}`)
              }
              badge={badge}
              headerLeft={
                <button
                  type="button"
                  onClick={() =>
                    property.owner?.id &&
                    navigate(`/admin/profile/${property.owner.id}`)
                  }
                  className="w-full text-left rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label={`View profile of ${property.owner?.username || "owner"}`}
                >
                  <div className="flex items-center gap-3">
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
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {property.owner?.username}
                      </p>
                    </div>
                  </div>
                </button>
              }
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
                      {!property.is_approved && !property.is_rejected && (
                        <>
                          <button
                            onClick={() => handleApprove(property.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(property.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      )}

                      {(property.is_approved || property.is_rejected) && (
                        <button
                          onClick={() => handleRevertPending(property.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-600"
                        >
                          <CornerUpLeft size={16} /> Revert
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
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

      {/* EDIT MODAL */}
      {selectedProperty && (
        <EditModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSuccess={fetchProperties}
        />
      )}
    </div>
  );
};

// ======================
// EDIT MODAL
// ======================
const EditModal = ({ property, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: property.title,
    location: property.location,
    rent: property.rent,
    property_type: property.property_type,
    description: property.description,
    images: [],
  });

  const [existingImages, setExistingImages] = useState(property.images || []);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setForm({ ...form, images: e.target.files });

  const handleRemoveExistingImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const handleReplaceImagesChange = (e) => {
    setReplaceImages(e.target.checked);
    if (e.target.checked) {
      setImagesToRemove([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("rent", form.rent);
      formData.append("property_type", form.property_type);
      formData.append("description", form.description);

      // Handle images
      if (replaceImages) {
        // Replace all images - send images field even if empty to trigger clearing
        for (let img of form.images) formData.append("images", img);
      } else if (form.images.length > 0) {
        // Add new images to existing ones
        for (let img of form.images) formData.append("images", img);
      }

      // Send images to remove if any
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach((imageId) =>
          formData.append("remove_images", imageId),
        );
      }

      await updateProperty(property.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-95 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Property Title"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="rent"
            value={form.rent}
            onChange={handleChange}
            placeholder="Rent"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="property_type"
            value={form.property_type}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="flat">Flat</option>
            <option value="seat">Seat</option>
          </select>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Images
            </label>

            {/* Replace images option */}
            <div className="mb-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={replaceImages}
                  onChange={handleReplaceImagesChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Replace all existing images with new ones
                  {replaceImages &&
                    form.images.length === 0 &&
                    " (will clear all images)"}
                </span>
              </label>
            </div>

            {/* New images input */}
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 mb-3"
            />

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Current Images:
                </p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.image}
                        alt="Property"
                        className="w-20 h-20 object-cover rounded"
                      />
                      {!replaceImages && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {replaceImages && (
                  <p className="text-xs text-orange-600 mt-2">
                    Warning: Checking "replace all" will remove all current
                    images and replace them with the new ones.
                  </p>
                )}
              </div>
            )}

            {/* Preview new images */}
            {form.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  New Images to {replaceImages ? "Replace" : "Add"}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(form.images).map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt={`New ${i + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-3 rounded-lg shadow-md"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 ml-2 bg-gray-400 hover:bg-gray-500 transition text-white font-semibold px-4 py-3 rounded-lg shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProperties;
