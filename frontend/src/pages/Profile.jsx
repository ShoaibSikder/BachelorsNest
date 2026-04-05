import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile } from "../api/authApi";

const getImageUrl = (img) =>
  img?.startsWith("http") ? img : `http://127.0.0.1:8000${img}`;

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { userId } = useParams();
  const [displayUser, setDisplayUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || (user && String(user.id) === String(userId));

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      if (isOwnProfile) {
        setDisplayUser(user);
        setFormData({
          username: user.username || "",
          email: user.email || "",
        });
        setPreview(user.profile_image ? getImageUrl(user.profile_image) : "");
        setProfileImage(null);
        setError("");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserProfile(userId);
        setDisplayUser(response.data);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
        });
        setPreview(
          response.data.profile_image
            ? getImageUrl(response.data.profile_image)
            : "",
        );
        setError("");
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, userId, isOwnProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (profileImage) {
        data.append("profile_image", profileImage);
      }

      await updateProfile(data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !displayUser) {
    return (
      <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="h-28 w-28 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-4xl font-semibold text-slate-700 dark:text-slate-200">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {formData.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {displayUser.username}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {displayUser.role}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {displayUser.email}
            </p>
          </div>
        </div>
      </div>

      {isOwnProfile ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your account details and profile photo.
              </p>
            </div>
          </div>

          {message && (
            <div className="rounded-2xl bg-green-100 text-green-800 p-3 mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-2xl bg-red-100 text-red-800 p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-200"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Username
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                User Profile
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View profile details for this user.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-100 text-red-800 p-3 mb-4">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Username
              </label>
              <div className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {displayUser.username}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <div className="mt-2 rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {displayUser.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
