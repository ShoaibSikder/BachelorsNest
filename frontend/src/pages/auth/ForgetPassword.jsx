import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSent, setEmailSent] = useState(false);

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
      console.log("Sending password reset request for email:", email);
      const response = await resetPasswordRequest(email);
      console.log("Password reset response:", response);

      setSuccess("✅ Password reset email sent successfully!");
      setEmailSent(true);
      setEmail(""); // Clear the form

      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        fullError: err,
      });

      // Show the actual error from server if available
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Failed to send reset email. Please try again.";
      setError(errorMsg);
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900 transition">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white items-center justify-center">
        <div className="text-center px-10 space-y-4">
          <h1 className="text-5xl font-extrabold">BachelorsNest</h1>
          <p className="text-lg opacity-90">Reset your password securely.</p>
          <p className="text-sm opacity-75 mt-6">
            Enter your email address and we'll send you a link to reset your
            password.
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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              No worries! We'll help you reset it.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm border border-green-300">
              {success}
              <p className="text-xs mt-1 text-green-600">
                Redirecting to login in 3 seconds...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-300">
              <p className="font-semibold">❌ Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Email Input */}
          {!emailSent && (
            <>
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

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p className="flex items-start gap-2">
                  <span className="text-lg">ℹ️</span>
                  <span>
                    Make sure you have access to this email address. We'll send
                    you a link to reset your password.
                  </span>
                </p>
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
            </>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Remember your password?{" "}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
