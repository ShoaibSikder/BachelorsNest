import { CornerUpLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, CheckCircle, XCircle, X } from "lucide-react";
import {
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  updateProperty,
  revertPropertyPending,
} from "../../api/adminPropertyApi";

const BASE_URL = "http://127.0.0.1:8000";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const menuRefs = useRef({});

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

  const handleReject = async (id) => {
    if (window.confirm("Reject this property?")) {
      await rejectProperty(id);
      fetchProperties();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete permanently?")) {
      await deleteProperty(id);
      fetchProperties();
    }
  };

  const handleRevertPending = async (id) => {
    if (window.confirm("Revert property to pending?")) {
      await revertPropertyPending(id);
      fetchProperties();
    }
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

  return (
    <div className="p-4 md:p-6 text-gray-800 dark:text-white">
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
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 relative">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {property.owner?.username}
                </p>
              </div>

              {/* 3 DOT MENU */}
              <div
                ref={(el) => (menuRefs.current[property.id] = el)}
                className="relative"
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
            </div>

            {/* IMAGES COLLAGE */}
            {property.images?.length > 0 ? (
              <div className="grid gap-1 w-full">
                {property.images.length === 1 && (
                  <img
                    src={getImageUrl(property.images[0].image)}
                    alt={`${property.title} 1`}
                    className="w-full h-60 object-cover rounded cursor-pointer"
                    onClick={() =>
                      setModalImage(getImageUrl(property.images[0].image))
                    }
                  />
                )}
                {property.images.length === 2 && (
                  <div className="grid grid-cols-2 gap-1">
                    {property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(img.image)}
                        alt={`${property.title} ${idx + 1}`}
                        className="w-full h-40 object-cover rounded cursor-pointer"
                        onClick={() => setModalImage(getImageUrl(img.image))}
                      />
                    ))}
                  </div>
                )}
                {property.images.length === 3 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60">
                    <img
                      src={getImageUrl(property.images[0].image)}
                      alt={`${property.title} 1`}
                      className="row-span-2 w-full h-full object-cover rounded cursor-pointer"
                      onClick={() =>
                        setModalImage(getImageUrl(property.images[0].image))
                      }
                    />
                    <img
                      src={getImageUrl(property.images[1].image)}
                      alt={`${property.title} 2`}
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() =>
                        setModalImage(getImageUrl(property.images[1].image))
                      }
                    />
                    <img
                      src={getImageUrl(property.images[2].image)}
                      alt={`${property.title} 3`}
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() =>
                        setModalImage(getImageUrl(property.images[2].image))
                      }
                    />
                  </div>
                )}
                {property.images.length >= 4 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 h-60 relative">
                    {property.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(img.image)}
                        alt={`${property.title} ${idx + 1}`}
                        className="w-full h-full object-cover rounded cursor-pointer"
                        onClick={() => setModalImage(getImageUrl(img.image))}
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
            ) : (
              <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📍 {property.location}
              </p>
              <p className="mt-2 font-bold text-indigo-600">
                ৳ {property.rent}
              </p>
              <span
                className={`mt-2 text-xs px-3 py-1 rounded-full w-fit ${
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
            </div>
          </div>
        ))}
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setForm({ ...form, images: e.target.files });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) {
        if (key === "images") {
          for (let img of form.images) formData.append("images", img);
        } else {
          formData.append(key, form[key]);
        }
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
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="text-gray-700 dark:text-gray-200"
          />

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
