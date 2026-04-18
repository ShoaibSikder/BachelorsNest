import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../../api/propertyApi"; // we’ll create this in api

const OwnerAddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    property_type: "",
    description: "",
    available_from: "",
    is_available: true,
    total_seats: 1,
    occupied_seats: 0,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    if (name === "property_type" && value === "flat") {
      nextFormData.total_seats = 1;
      nextFormData.occupied_seats = 0;
    }

    setFormData(nextFormData);
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData.property_type === "flat" &&
        ["total_seats", "occupied_seats"].includes(key)
      ) {
        return;
      }
      data.append(key, formData[key]);
    });
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await addProperty(data);
      navigate("/owner/properties");
    } catch (err) {
      console.error("Failed to add property:", err);
      setError("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="number"
          name="rent"
          placeholder="Rent"
          value={formData.rent}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />

        <select
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Type</option>
          <option value="flat">Flat</option>
          <option value="seat">Seat</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          type="date"
          name="available_from"
          value={formData.available_from}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        {formData.property_type === "seat" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="number"
              name="total_seats"
              min="1"
              placeholder="Total seats"
              value={formData.total_seats}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="number"
              name="occupied_seats"
              min="0"
              placeholder="Occupied seats"
              value={formData.occupied_seats}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
          Property is currently available
        </label>

        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full"
          accept="image/*"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default OwnerAddProperty;
