import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    verifyEmail();
  }, []);

  async function verifyEmail() {
    try {
      if (!token || !email) {
        setError("Invalid verification link. Please check your email again.");
        setVerifying(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/auth/verify-email`, {
        params: { token, email },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed. Please try again.");
      setVerifying(false);
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
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
            {success ? (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Email Verified!</h1>
                <p className="text-gray-600">Your email has been successfully verified.</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">❌</div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Verification Failed</h1>
                <p className="text-gray-600">{error}</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            {success && (
              <p className="text-center text-gray-600">
                Redirecting to dashboard in a moment...
              </p>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Go to Dashboard
            </button>
            {!success && (
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                Back to Login
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-white mt-8 text-sm">
          © 2025 Coding Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
