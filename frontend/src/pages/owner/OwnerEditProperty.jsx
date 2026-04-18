import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProperty } from "../../api/propertyApi";
import api from "../../api/axios";

const OwnerEditProperty = () => {
  const { id } = useParams(); // property id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent: "",
    property_type: "flat",
    description: "",
    available_from: "",
    is_available: true,
    total_seats: 1,
    occupied_seats: 0,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch property details on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/update-delete/${id}/`);
        const data = response.data;

        setFormData({
          title: data.title,
          location: data.location,
          rent: data.rent,
          property_type: data.property_type,
          description: data.description,
          available_from: data.available_from || "",
          is_available: data.is_available,
          total_seats: data.total_seats ?? 1,
          occupied_seats: data.occupied_seats ?? 0,
        });

        // If property has existing images
        if (data.images) setExistingImages(data.images);
      } catch (err) {
        console.error("Failed to load property:", err);
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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
    setImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (imageId) => {
    setImagesToRemove([...imagesToRemove, imageId]);
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const handleReplaceImagesChange = (e) => {
    setReplaceImages(e.target.checked);
    if (e.target.checked) {
      // If replacing, clear any images to remove
      setImagesToRemove([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("rent", formData.rent);
    data.append("property_type", formData.property_type);
    data.append("description", formData.description);
    data.append("available_from", formData.available_from);
    data.append("is_available", formData.is_available);
    if (formData.property_type === "seat") {
      data.append("total_seats", formData.total_seats);
      data.append("occupied_seats", formData.occupied_seats);
    }

    // Handle images
    if (replaceImages) {
      images.forEach((img) => data.append("images", img));
    } else if (images.length > 0) {
      images.forEach((img) => data.append("images", img));
    }

    if (imagesToRemove.length > 0) {
      imagesToRemove.forEach((imageId) =>
        data.append("remove_images", imageId),
      );
    }

    try {
      await updateProperty(id, data);
      navigate("/owner/properties");
    } catch (err) {
      console.error("Failed to save property:", err);
      setError("Failed to save property. Please try again.");
    }
  };

  if (loading) return <p className="text-gray-600">Loading property...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Property</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Rent</label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Property Type</label>
          <select
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          >
            <option value="flat">Flat</option>
            <option value="seat">Seat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Available From</label>
          <input
            type="date"
            name="available_from"
            value={formData.available_from}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>

        {formData.property_type === "seat" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Total Seats</label>
              <input
                type="number"
                min="1"
                name="total_seats"
                value={formData.total_seats}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Occupied Seats</label>
              <input
                type="number"
                min="0"
                name="occupied_seats"
                value={formData.occupied_seats}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
          />
          Property is currently available
        </label>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 rounded border border-gray-300"
          />

          {existingImages.length > 0 && (
            <div className="flex gap-2 mt-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.image}
                    alt="Property"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Property
          </button>
          <button
            type="button"
            onClick={() => navigate("/owner/properties")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerEditProperty;
