import AuthLayout from "../../layouts/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API_BASE_URL from "../../config";

const Login = () => {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dark mode toggle is now handled by ThemeContext

  useEffect(() => {
    const controller = new AbortController();
    const warmupUrl = `${API_BASE_URL}/warmup/`;

    fetch(warmupUrl, {
      cache: "no-store",
      signal: controller.signal,
    }).catch(() => {
      // The login request will still handle any remaining wake-up delay.
    });

    return () => controller.abort();
  }, []);

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
        errorMsg = "The sign-in service is unreachable. Please try again in a moment.";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={handleSubmit} className="bn-form">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Username or Email */}
          <label className="bn-field">Username or email<input
            type="text"
            name="username_or_email"
            placeholder="Email or Username"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.username_or_email}
            onChange={handleChange}
            required
            autoComplete="username" /></label>

          {/* Password */}
          <label className="bn-field">Password</label>
          <div className="bn-pass">
            <input
              type={showPassword ? "text" : "password"}
              name="password" aria-label="Password" autoComplete="current-password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="button" className="bn-eye" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
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
            <Link to="/forget-password">Forgot Password?
            </Link>
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
              "Sign in"
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            New to BachelorsNest?{" "}
            <Link to="/register">Create an account</Link>
          </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
