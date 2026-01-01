import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    roll: {
      type: String,
      required: true,
      match: [/^[0-9]{5}[A-Z]{1}[0-9]{4}$/, "Roll number must be in format: 5 digits, 1 letter, 4 digits (e.g., 23321A0584)"],
    },
    userType: {
      type: String,
      enum: ["student", "alumni"],
      default: "student",
    },
    // Alumni-specific fields
    company: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
    companyVerified: {
      type: Boolean,
      default: false,
    },
    ctc: {
      type: String,
      default: null,
    },
    joinDate: {
      type: Date,
      default: null,
    },
    batch: {
      type: Number,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    rank: {
      type: Number,
      default: 0,
    },
    posts: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Number,
      default: 0,
    },
    feedbacks: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    bio: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    otpPurpose: {
      type: String,
      enum: ["signup", "reset-password"],
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.incrementVotes = function () {
  this.votes += 1;
  return this.save();
};

userSchema.methods.incrementPosts = function () {
  this.posts += 1;
  return this.save();
};

userSchema.methods.incrementFeedback = function () {
  this.feedbacks += 1;
  return this.save();
};

userSchema.methods.updateRank = function (newRank) {
  this.rank = newRank;
  return this.save();
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return resetToken;
};

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return verificationToken;
};

userSchema.methods.verifyResetToken = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return (
    this.resetToken === hashedToken &&
    this.resetTokenExpiry > new Date()
  );
};

userSchema.methods.verifyVerificationToken = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return (
    this.verificationToken === hashedToken &&
    this.verificationTokenExpiry > new Date()
  );
};

userSchema.methods.generateOTP = function (purpose = "signup") {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.otpPurpose = purpose;
  return otp;
};

userSchema.methods.verifyOTP = function (otp) {
  return this.otp === otp && this.otpExpiry > new Date();
};

userSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpiry = null;
  this.otpPurpose = null;
};

export default mongoose.model("User", userSchema);
