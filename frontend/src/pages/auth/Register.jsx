import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { useTheme } from "../../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "bachelor",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const normalizeErrors = (data) => {
    if (!data) {
      return ["Registration failed."];
    }

    if (typeof data === "string") {
      return [data];
    }

    if (Array.isArray(data)) {
      return data.filter(Boolean);
    }

    const messages = [];

    ["username", "email", "password", "role", "detail", "error"].forEach(
      (field) => {
        const value = data[field];
        if (!value) {
          return;
        }

        if (Array.isArray(value)) {
          messages.push(...value.filter(Boolean));
        } else if (typeof value === "string") {
          messages.push(value);
        }
      },
    );

    return messages.length ? [...new Set(messages)] : ["Registration failed."];
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrorList([]);
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/");
    } catch (err) {
      const messages = normalizeErrors(err.response?.data);
      setError(messages[0] || "Registration failed.");
      setErrorList(messages);
      console.error("Registration error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900 transition">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white items-center justify-center">
        <div className="text-center px-10 space-y-4">
          <img
            src="/Logo.png"
            alt="BachelorsNest Logo"
            className="w-24 h-28 mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold">BachelorsNest</h1>
          <p className="text-lg opacity-90">
            Create your account and start your journey
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Register
            </h2>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs">
                  {darkMode ? "L" : "D"}
                </span>
              </div>
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              {errorList.length > 1 ? (
                <ul className="list-disc space-y-1 pl-5">
                  {errorList.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              ) : (
                error
              )}
            </div>
          )}

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

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
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <select
            name="role"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="bachelor">Bachelor</option>
            <option value="owner">Owner</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition"
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
