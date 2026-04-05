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
    property_type: "flat", // default value
    description: "",
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    // Handle images
    if (replaceImages) {
      images.forEach((img) => data.append("images", img));
    } else if (images.length > 0) {
      images.forEach((img) => data.append("images", img));
    }

    if (imagesToRemove.length > 0) {
      imagesToRemove.forEach((imageId) => data.append("remove_images", imageId));
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
