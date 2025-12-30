import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signupUser = async (req, res) => {
  try {
    const { name, email, roll, password, role } = req.body;

    // Validation
    if (!name || !email || !roll || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      name,
      email,
      roll,
      password: hashedPassword,
      role: role || "junior",
      rank: 0,
      posts: 0,
      votes: 0,
      feedbacks: 0
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll: user.roll,
        role: user.role,
        rank: user.rank,
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll: user.roll,
        role: user.role,
        rank: user.rank,
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};