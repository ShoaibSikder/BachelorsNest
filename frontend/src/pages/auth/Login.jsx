import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!formData.username_or_email || !formData.password) {
      setError("Please enter both email/username and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("Login attempt with:", formData.username_or_email);
      const user = await login(formData);

      if (remember) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Route based on role
      if (user.role === "bachelor") {
        navigate("/bachelor");
      } else if (user.role === "owner") {
        navigate("/owner");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        // Fallback if role is missing
        console.warn("User role not found:", user);
        navigate("/bachelor");
      }
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });

      // Get detailed error message from API
      let errorMsg = "Login failed. Please try again.";

      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.response?.data?.non_field_errors?.[0]) {
        errorMsg = err.response.data.non_field_errors[0];
      } else if (err.response?.status === 400) {
        errorMsg = "Invalid email/username or password.";
      } else if (err.response?.status === 401) {
        errorMsg = "Authentication failed. Please check your credentials.";
      } else if (err.message === "Network Error") {
        errorMsg = "Network error. Please check your connection.";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900 transition">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white items-center justify-center">
        <div className="text-center px-10 space-y-4">
          <img
            src="/Logo.png"
            alt="BachelorsNest Logo"
            className="w-24 h-28 mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold">BachelorsNest</h1>
          <p className="text-lg opacity-90">
            Find your perfect stay with ease.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Login
            </h2>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm px-3 py-1 border rounded dark:text-white"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Username or Email */}
          <input
            type="text"
            name="username_or_email"
            placeholder="Email or Username"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.username_or_email}
            onChange={handleChange}
            required
            autoComplete="username"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500 dark:text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4"
              />
              Remember me
            </label>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/forget-password")}
            >
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              "Login"
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
