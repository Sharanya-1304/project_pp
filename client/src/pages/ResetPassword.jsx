import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    verifyToken();
  }, []);

  async function verifyToken() {
    try {
      if (!token || !email) {
        setError("Invalid reset link. Please request a new one.");
        setVerifying(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/auth/verify-reset-token`, {
        params: { token, email },
      });
      setVerifying(false);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset link.");
      setVerifying(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setError("Both password fields are required");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        email,
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Verifying your reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Link Invalid</h1>
              <p className="text-gray-600">{error}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                Request New Link
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Create New Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="font-medium">Password reset successfully!</p>
              <p className="text-sm">Redirecting to login...</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>

        <p className="text-center text-white mt-8 text-sm">
          © 2025 Coding Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
