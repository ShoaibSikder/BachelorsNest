import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { resetPasswordVerifyToken, resetPasswordConfirm } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams();

  // Verify token on component mount
  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      try {
        if (!token) {
          setError("No token provided. Please use the link from your email.");
          setVerifying(false);
          return;
        }

        console.log("Verifying reset token:", token);
        const response = await resetPasswordVerifyToken(token);
        console.log("Token verification response:", response.data);

        if (response.data.valid) {
          setTokenValid(true);
          setUsername(response.data.username);
          setEmail(response.data.email);
          setError("");
        } else {
          setError(response.data.detail || "Token is invalid or expired.");
        }
      } catch (err) {
        console.error("Token verification error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });

        const errorMsg =
          err.response?.data?.detail ||
          err.response?.data?.token?.[0] ||
          err.message ||
          "Failed to verify token. The link may be expired.";
        setError(errorMsg);
      } finally {
        setVerifying(false);
      }
    };

    verifyTokenOnLoad();
  }, [token, resetPasswordVerifyToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting password reset with token:", token);
      const response = await resetPasswordConfirm(token, newPassword);
      console.log("Password reset response:", response.data);

      setSuccess("✅ Password reset successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Password reset error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.token?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.message ||
        "Failed to reset password. The link may be expired.";
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
          <h1 className="text-5xl font-extrabold">BachelorsNest</h1>
          <p className="text-lg opacity-90">Set your new password.</p>
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
              Reset Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Enter your new password.
            </p>
          </div>

          {/* Loading state */}
          {verifying && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin border-2 border-blue-500 border-t-transparent rounded-full w-6 h-6"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Verifying reset link...
              </span>
            </div>
          )}

          {/* Token Invalid Error */}
          {!verifying && !tokenValid && (
            <>
              <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
                {error || "This password reset link is invalid or has expired."}
              </div>
              <button
                type="button"
                onClick={() => navigate("/forget-password")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:scale-[1.02] transition"
              >
                Request New Reset Link
              </button>
            </>
          )}

          {/* Valid Token - Show Form */}
          {!verifying && tokenValid && (
            <>
              {/* Username Display */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 rounded text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Resetting password for:</span>
                </p>
                <p className="text-blue-600 dark:text-blue-300 font-bold text-lg mt-1">
                  {username}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {email}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-green-100 text-green-600 p-2 rounded text-sm">
                  {success}
                </div>
              )}

              {/* New Password */}
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />

              {/* Confirm Password */}
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Remember your password?{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
