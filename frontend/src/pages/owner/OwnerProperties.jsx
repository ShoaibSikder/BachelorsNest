import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X } from "lucide-react";
import { getOwnerProperties, deleteProperty } from "../../api/propertyApi";

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalImage, setModalImage] = useState(null); // for lightbox
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getOwnerProperties();
        setProperties(response.data);
      } catch (err) {
        console.error("Failed to load properties:", err);
        setError("Error getting properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/owner/properties/edit/${id}`);
  };

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

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading)
    return (
      <p className="text-gray-600 dark:text-gray-300">Loading properties...</p>
    );
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;
  if (properties.length === 0)
    return (
      <p className="text-gray-600 dark:text-gray-300">
        You have no properties yet.
      </p>
    );

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        My Properties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >
            {/* 🔹 HEADER */}
            <div className="flex items-center justify-between p-4 relative">
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
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {property.owner?.username || "Unknown Owner"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {property.location} • {formatTime(property.created_at)}
                  </p>
                </div>
              </div>

              {/* 🔹 THREE DOT MENU */}
              <div ref={menuRef} className="relative">
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
                        onClick={() => setModalImage(img.image)}
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
                      onClick={() => setModalImage(property.images[0].image)}
                    />
                    <img
                      src={
                        property.images[1].image.startsWith("http")
                          ? property.images[1].image
                          : `http://127.0.0.1:8000${property.images[1].image}`
                      }
                      alt={`${property.title} 2`}
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() => setModalImage(property.images[1].image)}
                    />
                    <img
                      src={
                        property.images[2].image.startsWith("http")
                          ? property.images[2].image
                          : `http://127.0.0.1:8000${property.images[2].image}`
                      }
                      alt={`${property.title} 3`}
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() => setModalImage(property.images[2].image)}
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
                        onClick={() => setModalImage(img.image)}
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

            {!property.images?.length && (
              <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                No image
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
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    property.is_approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {property.is_approved ? "Approved ✅" : "Pending ⏳"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default OwnerProperties;
