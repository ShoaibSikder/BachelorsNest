import AuthLayout from "../../layouts/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: params.get("role") === "owner" ? "owner" : "bachelor",
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
      navigate("/login");
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
    <AuthLayout title="Create an account">
      <form onSubmit={handleSubmit} className="bn-form">
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

          <label className="bn-field">Username<input type="text" name="username"
            placeholder="Username"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          /></label>

          <label className="bn-field">Email address<input type="email" name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          /></label>

          <label className="bn-field">Password</label>
          <div className="bn-pass">
            <input
              type={showPassword ? "text" : "password"}
              name="password" aria-label="Password" autoComplete="new-password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="button" className="bn-eye" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
          </div>

          <label className="bn-field">Account type<select
            name="role"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="bachelor">Bachelor</option>
            <option value="owner">Owner</option>
          </select></label>

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
            <Link to="/login">Login
            </Link>
          </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
