import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppContext";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserWithToken } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("form"); // form, otp, success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isLogin && !formData.roll.trim()) {
      newErrors.roll = "Roll number is required";
    } else if (!isLogin && !/^\d{5}[A-Z]\d{4}$/.test(formData.roll)) {
      newErrors.roll = "Roll format: 5 digits, 1 letter, 4 digits (e.g., 23321A0584)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Login flow
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        setUserWithToken(response.data.user, response.data.token);
        navigate("/dashboard");
      } else {
        // Signup flow
        const response = await axios.post(`${API_URL}/api/auth/signup`, {
          name: formData.name,
          email: formData.email,
          roll: formData.roll,
          password: formData.password,
        });

        setEmail(formData.email);
        setStep("otp");
        setMessage("OTP sent to your email!");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.response?.data?.error || "An error occurred"
      );
    } finally {
      setLoading(false);
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
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: email,
        otp: otpValue,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUserWithToken(response.data.user, response.data.token);
      setStep("success");
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.response?.data?.error || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, {
        email: email,
      });
      setMessage("OTP resent successfully!");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setMessage("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-fadeIn backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-2">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h1>
            <p className="text-gray-600">
              {isLogin ? "Sign in to your account" : "Create your new account"}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm font-medium ${
                message.includes("successfully") || message.includes("sent")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {step === "form" && (
            <form onSubmit={handleSubmit}>
              {/* Signup Fields */}
              {!isLogin && (
                <>
                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white focus:shadow-md transition ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">❌ {errors.name}</p>}
                  </div>

                  {/* Roll Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="roll"
                        value={formData.roll}
                        onChange={handleInputChange}
                        placeholder="23321A0584"
                        className={`w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white focus:shadow-md transition ${
                          errors.roll ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.roll && <p className="text-red-500 text-sm mt-1">❌ {errors.roll}</p>}
                  </div>
                </>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white focus:shadow-md transition ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">❌ {errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-12 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition ${
                      errors.password ? "border-red-500" : ""
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
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading && <div className="spinner w-5 h-5"></div>}
                {isLogin ? "🔓 Sign In" : "✨ Create Account"}
              </button>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (isLogin) {
                        navigate("/choose-role");
                      } else {
                        setIsLogin(!isLogin);
                        setFormData({
                          name: "",
                          email: "",
                          roll: "",
                          password: "",
                          confirmPassword: "",
                        });
                        setErrors({});
                        setMessage("");
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>

              {/* Forgot Password */}
              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          )}

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
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white text-sm">
          <p>© 2025 Coding Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
