import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email, otp, reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setStep("otp");
      setMessage("OTP sent to your email!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      setStep("reset");
      setMessage("OTP verified! Now reset your password.");
    } catch (error) {
      setMessage("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword,
        confirmPassword,
      });

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
      setMessage("OTP resent successfully!");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setMessage("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">Secure your account</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm font-medium ${
                message.includes("successfully") || message.includes("sent") || message.includes("verified")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className={`h-2 flex-1 rounded-full transition ${step === "email" || step === "otp" || step === "reset" ? "bg-indigo-600" : "bg-gray-300"}`}></div>
              <div className={`h-2 flex-1 mx-1 rounded-full transition ${step === "otp" || step === "reset" ? "bg-indigo-600" : "bg-gray-300"}`}></div>
              <div className={`h-2 flex-1 rounded-full transition ${step === "reset" ? "bg-indigo-600" : "bg-gray-300"}`}></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {step === "email" && "Step 1: Enter Email"}
              {step === "otp" && "Step 2: Verify OTP"}
              {step === "reset" && "Step 3: Set New Password"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <div className="spinner w-5 h-5"></div>}
                Send Reset OTP
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <p className="text-center text-gray-600 mb-6">
                  Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="otp-input w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="spinner w-5 h-5"></div>}
                  Verify OTP
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading && <div className="spinner w-5 h-5"></div>}
                Reset Password
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-white text-sm">
          <p>© 2025 Coding Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
