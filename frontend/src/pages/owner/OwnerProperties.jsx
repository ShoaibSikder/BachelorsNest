import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { getOwnerProperties, deleteProperty } from "../../api/propertyApi";

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div>
      <h2 className="text-2xl font-bold mb-6">My Properties</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg"
          >
            {/* Property image */}
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0].image} // first image
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}

            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-gray-500 dark:text-gray-300">
              Location: {property.location}
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              Rent: ${property.rent}
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              Status: {property.is_approved ? "Approved ✅" : "Pending ⏳"}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleEdit(property.id)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerProperties;
