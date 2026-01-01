import { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppContext";
import "../styles/Auth.css";

const RegisterNew = () => {
  const navigate = useNavigate();
  const { setUserWithToken } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  
  // Get role from URL parameter, if available
  const roleFromUrl = searchParams.get("role");
  
  const [step, setStep] = useState("form"); // form, otp, success
  const [userType, setUserType] = useState(roleFromUrl || null); // student or alumni
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll: "",
    password: "",
    confirmPassword: "",
    bio: "",
    company: "",
    position: "",
    designation: "",
    ctc: "",
    batch: "",
    department: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // =============== VALIDATION ===============
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.roll.trim()) {
      newErrors.roll = "Roll number is required";
    } else if (!/^\d{5}[A-Z]\d{4}$/.test(formData.roll)) {
      newErrors.roll = "Format: 5 digits, 1 letter, 4 digits (e.g., 23321A0584)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (userType === "alumni") {
      if (!formData.company.trim()) newErrors.company = "Company name is required";
      if (!formData.position.trim()) newErrors.position = "Position is required";
      if (!formData.designation.trim()) newErrors.designation = "Designation is required";
      if (formData.batch && isNaN(formData.batch)) newErrors.batch = "Batch must be a number";
    }

    return newErrors;
  };

  // =============== HANDLE INPUT ===============
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

  // =============== HANDLE OTP INPUT ===============
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // =============== HANDLE SIGNUP ===============
  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        roll: formData.roll,
        password: formData.password,
        userType,
        bio: formData.bio || "",
      };

      if (userType === "alumni") {
        signupData.company = formData.company;
        signupData.position = formData.position;
        signupData.designation = formData.designation;
        signupData.ctc = formData.ctc || null;
        signupData.batch = formData.batch ? parseInt(formData.batch) : null;
        signupData.department = formData.department || null;
      }

      const response = await axios.post(`${API_URL}/api/auth/signup`, signupData);

      if (response.data.success) {
        setStep("otp");
        setSuccessMessage("✅ OTP sent to your email!");
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============== HANDLE OTP VERIFICATION ===============
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: "Please enter a 6-digit OTP" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp: otpCode,
      });

      if (response.data.success) {
        setUserWithToken(response.data.user, response.data.token);
        navigate(response.data.user.userType === "alumni" ? "/alumni-profile" : "/dashboard");
      }
    } catch (error) {
      setErrors({
        otp: error.response?.data?.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============== HANDLE RESEND OTP ===============
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, {
        email: formData.email,
      });
      setSuccessMessage("✅ OTP resent to your email!");
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setErrors({
        otp: error.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============== STEP 1: REGISTRATION FORM ===============
  if (step === "form") {
    return (
      <div className="auth-container">
        <div style={{ width: "100%", maxWidth: "600px", position: "relative", zIndex: 1 }}>
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">
                {userType === "student" ? "🎓" : "👨‍💼"} Create Your Account
              </h1>
              <p className="auth-subtitle">
                {userType === "student" ? "Student Registration" : "Alumni Registration"}
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSignup} className="auth-form">
              {/* COMMON FIELDS */}
              <div className="fields-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`form-input ${errors.name ? "input-error" : ""}`}
                    />
                  </div>
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                  />
                  <span className="input-icon">📧</span>
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Roll Number */}
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="roll"
                    value={formData.roll}
                    onChange={handleInputChange}
                    placeholder="23321A0584"
                    className={`form-input ${errors.roll ? "input-error" : ""}`}
                  />
                </div>
                {errors.roll && <p className="form-error">{errors.roll}</p>}
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  className="form-input"
                  style={{ paddingRight: "var(--spacing-lg)" }}
                />
              </div>

              {/* ALUMNI SPECIFIC FIELDS */}
              {userType === "alumni" && (
                <>
                  <div className="section-header">
                    <span className="section-icon">💼</span>
                    Professional Information
                  </div>

                  <div className="fields-grid">
                    {/* Company */}
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Google, Microsoft"
                        className={`form-input ${errors.company ? "input-error" : ""}`}
                      />
                      {errors.company && <p className="form-error">{errors.company}</p>}
                    </div>

                    {/* Position */}
                    <div className="form-group">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Software Engineer"
                        className={`form-input ${errors.position ? "input-error" : ""}`}
                      />
                      {errors.position && <p className="form-error">{errors.position}</p>}
                    </div>

                    {/* Designation */}
                    <div className="form-group">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="Senior Engineer"
                        className={`form-input ${errors.designation ? "input-error" : ""}`}
                      />
                      {errors.designation && <p className="form-error">{errors.designation}</p>}
                    </div>

                    {/* CTC */}
                    <div className="form-group">
                      <label className="form-label">CTC (LPA) - Optional</label>
                      <input
                        type="text"
                        name="ctc"
                        value={formData.ctc}
                        onChange={handleInputChange}
                        placeholder="20 LPA"
                        className="form-input"
                      />
                    </div>

                    {/* Batch */}
                    <div className="form-group">
                      <label className="form-label">Batch - Optional</label>
                      <input
                        type="number"
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        placeholder="2023"
                        className={`form-input ${errors.batch ? "input-error" : ""}`}
                      />
                      {errors.batch && <p className="form-error">{errors.batch}</p>}
                    </div>

                    {/* Department */}
                    <div className="form-group">
                      <label className="form-label">Department - Optional</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="CSE, ECE"
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PASSWORD FIELDS */}
              <div className="section-header" style={{ marginTop: "var(--spacing-2xl)" }}>
                <span className="section-icon">🔐</span>
                Security
              </div>

              <div className="fields-grid">
                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="form-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`form-input ${errors.password ? "input-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-toggle"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="form-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="input-toggle"
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Change Role Button */}
              <button
                type="button"
                onClick={() => navigate("/choose-role")}
                className="link-secondary"
                style={{ marginTop: "var(--spacing-lg)" }}
              >
                ← Change role
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary btn-block ${loading ? "btn-loading" : ""}`}
                style={{ marginTop: "var(--spacing-xl)" }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: "1rem", height: "1rem" }}></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="footer-text">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="link-primary"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============== STEP 3: OTP VERIFICATION ===============
  if (step === "otp") {
    return (
      <div className="auth-container">
        <div style={{ width: "100%", maxWidth: "500px", position: "relative", zIndex: 1 }}>
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Verify Email</h1>
              <p className="auth-subtitle">We sent an OTP to {formData.email}</p>
            </div>

            {successMessage && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                {successMessage}
              </div>
            )}

            {errors.otp && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {errors.otp}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <label className="form-label" style={{ display: "block", marginBottom: "var(--spacing-lg)", textAlign: "center" }}>
                  Enter 6-Digit OTP
                </label>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={`otp-input ${digit ? "filled" : ""}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary btn-block ${loading ? "btn-loading" : ""}`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div style={{ marginTop: "var(--spacing-lg)", textAlign: "center" }}>
              <p className="footer-text">Didn't receive OTP?</p>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="link-primary"
                style={{ marginTop: "var(--spacing-sm)" }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============== STEP 4: SUCCESS ===============
  if (step === "success") {
    return (
      <div className="auth-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Success!</h1>
          <p className="success-text">{successMessage}</p>
          <p className="success-subtext">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }
};

export default RegisterNew;
