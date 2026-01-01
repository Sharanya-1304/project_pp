import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    website: {
      type: String,
      default: null,
    },
    headquarters: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      default: null,
    },
    founded: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: true, // Pre-verified list of known companies
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null,
    },
    experience: [
      {
        alumniId: mongoose.Schema.Types.ObjectId,
        position: String,
      },
    ],
    avgCTC: {
      type: String,
      default: null,
    },
    placementRate: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
