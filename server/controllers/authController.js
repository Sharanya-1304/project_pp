import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ==================== SIGNUP WITH OTP ====================
export const signupUser = async (req, res) => {
  try {
    const { name, email, roll, password, userType, company, position, designation, ctc, batch, department } = req.body;

    // Validation
    if (!name || !email || !roll || !password || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate user type
    if (!["student", "alumni"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type. Must be 'student' or 'alumni'" });
    }

    // If alumni, validate required fields
    if (userType === "alumni") {
      if (!company || !position || !designation) {
        return res.status(400).json({ message: "Company, position, and designation required for alumni" });
      }
    }

    // Roll number format validation
    const rollRegex = /^[0-9]{5}[A-Z]{1}[0-9]{4}$/;
    if (!rollRegex.test(roll)) {
      return res.status(400).json({ 
        message: "Roll number must be in format: 5 digits, 1 letter, 4 digits (e.g., 23321A0584)" 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with type-specific fields
    user = await User.create({
      name,
      email,
      roll,
      password: hashedPassword,
      userType,
      ...(userType === "alumni" && {
        company,
        position,
        designation,
        ctc: ctc || null,
        batch: batch || null,
        department: department || null,
        joinDate: new Date(),
      }),
      rank: 0,
      posts: 0,
      votes: 0,
      feedbacks: 0,
      isVerified: false,
    });

    // Generate and send OTP
    const otp = user.generateOTP("signup");
    await user.save();

    try {
      await sendOTPEmail(user.email, otp, "signup");
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({
        message: "User created but OTP email failed to send.",
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== VERIFY OTP ====================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is valid
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.clearOTP();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        roll: user.roll,
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks,
        rank: user.rank,
        bio: user.bio,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== RESEND OTP ====================
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = user.generateOTP(user.otpPurpose || "signup");
    await user.save();

    try {
      await sendOTPEmail(email, otp, user.otpPurpose || "signup");
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== LOGIN ====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        userId: user._id,
        email: user.email,
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll: user.roll,
        rank: user.rank,
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        userType: user.userType,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== LOGOUT ====================
export const logoutUser = async (req, res) => {
  try {
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== FORGOT PASSWORD WITH OTP ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ 
        message: "If an account exists with this email, a password reset OTP will be sent" 
      });
    }

    // Generate OTP for password reset
    const otp = user.generateOTP("reset-password");
    await user.save();

    try {
      await sendOTPEmail(user.email, otp, "reset-password");
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({ message: "Failed to send reset OTP email." });
    }

    res.json({ 
      success: true,
      message: "Password reset OTP has been sent to your email.",
      email: user.email
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== RESET PASSWORD WITH OTP ====================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.clearOTP();
    await user.save();

    res.json({ 
      success: true,
      message: "Password reset successfully. You can now login with your new password." 
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== VERIFY EMAIL (for legacy token-based verification) ====================
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ message: "Token and email are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // Verify token
    if (!user.verifyVerificationToken(token)) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({ 
      message: "Email verified successfully. You can now use all features." 
    });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};