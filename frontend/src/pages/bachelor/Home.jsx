import { useEffect, useState } from "react";
import { getApprovedProperties } from "../../api/propertyApi";
import { sendRentRequest } from "../../api/rentalApi";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);

  // ✅ Send Rent Request
  const handleRentRequest = async (propertyId) => {
    try {
      await sendRentRequest(propertyId);
      alert("Rent request sent successfully!");
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to send request.");
    }
  };

  // ✅ Fetch Approved Properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getApprovedProperties();
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties");
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white shadow-md rounded p-4">
              {/* ✅ Property Image */}
              {property.images && property.images.length > 0 && (
                <img
                  src={
                    property.images[0].image.startsWith("http")
                      ? property.images[0].image
                      : `http://127.0.0.1:8000${property.images[0].image}`
                  }
                  alt={property.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>

              <p className="text-gray-600 mb-2">{property.description}</p>

              <p className="text-gray-700 mb-1">📍 {property.location}</p>

              <p className="font-bold mb-4">৳ {property.rent}</p>

              <button
                onClick={() => handleRentRequest(property.id)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Send Rent Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BachelorHome;
