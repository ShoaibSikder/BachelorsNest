import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getSavedProperties, toggleWishlist } from "../../api/propertyApi";
import MessageBox from "../../components/MessageBox";
import PropertyCard from "../../components/PropertyCard";

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await getSavedProperties();
        setProperties(response.data);
      } catch {
        setMessage("Failed to load saved properties.");
        setMessageType("error");
      }
    };

    fetchSavedProperties();
  }, []);

  const handleRemove = async (propertyId) => {
    try {
      await toggleWishlist(propertyId);
      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
      setMessage("Property removed from wishlist.");
      setMessageType("success");
    } catch {
      setMessage("Failed to update wishlist.");
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

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Saved Properties
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Your shortlist of places worth revisiting.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200">
          {properties.length} saved
        </span>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow dark:bg-gray-900 dark:text-gray-300">
          No saved properties yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onImageClick={(imgUrl) => setModalImage(imgUrl)}
              onOwnerClick={(owner) =>
                owner?.id && navigate(`/bachelor/profile/${owner.id}`)
              }
              headerRight={
                <button
                  onClick={() => handleRemove(property.id)}
                  className="rounded-full bg-rose-100 p-2 text-rose-600 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              }
              footer={
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      navigate("/bachelor/chats", {
                        state: { selectedUser: property.owner },
                      })
                    }
                    className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                  >
                    Message Owner
                  </button>
                  <button
                    onClick={() => navigate("/bachelor")}
                    className="w-full rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Browse More
                  </button>
                </div>
              }
            />
          ))}
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

export default SavedProperties;
