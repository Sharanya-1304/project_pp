import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const makeAdminUser = async () => {
  try {
    await connectDB();

    const adminEmail = "sharanyagummadavelli@gmail.com";

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log(`User with email ${adminEmail} not found. Please ensure the user exists.`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`✅ User ${user.name} (${adminEmail}) has been made an admin successfully!`);
    console.log(`Admin Status: ${user.isAdmin}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting admin user:", error.message);
    process.exit(1);
  }
};

makeAdminUser();
