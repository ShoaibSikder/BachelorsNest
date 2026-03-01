import { useEffect, useState } from "react";
import { getApprovedProperties } from "../../api/propertyApi";

const BachelorHome = () => {
  const [properties, setProperties] = useState([]);

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
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-md rounded p-4"
            >
              <h2 className="text-xl font-semibold mb-2">
                {property.title}
              </h2>

              <p className="text-gray-600 mb-2">
                {property.description}
              </p>

              <p className="font-bold mb-4">
                ৳ {property.price}
              </p>

              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
