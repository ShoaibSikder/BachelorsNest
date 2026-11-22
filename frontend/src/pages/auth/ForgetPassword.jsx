import AuthLayout from "../../layouts/AuthLayout";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { resetPasswordRequest } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPasswordRequest(email);

      setSuccess(
        response.data?.detail ||
          "Password reset link has been sent to your email.",
      );
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Failed to verify email. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <AuthLayout title="Forgot your password?">
      <form onSubmit={handleSubmit} className="bn-form">
          {/* Success Message */}
          {success && (
            <div className="rounded-lg border border-green-300 bg-green-100 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                <span>Sending...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{" "}
            <span
              className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
              onClick={handleBackToLogin}
            >
              Back to Login
            </span>
          </p>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
