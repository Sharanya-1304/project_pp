import mongoose from "mongoose";

const alumniExperienceSchema = new mongoose.Schema(
  {
    alumniId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alumniName: {
      type: String,
      required: true,
    },
    alumniEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: null,
    },
    ctc: {
      type: String,
      default: null,
    },
    batch: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      default: null,
    },
    joinDate: {
      type: Date,
      default: null,
    },
    // Experience content
    description: {
      type: String,
      required: true,
    },
    challenges: {
      type: String,
      default: "",
    },
    tips: {
      type: String,
      default: "",
    },
    testimonial: {
      type: String,
      default: "",
    },
    // File uploads
    images: [
      {
        url: String,
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    roadmapPDF: {
      url: String,
      fileName: String,
      uploadedAt: {
        type: Date,
        default: null,
      },
    },
    // Metadata
    companyVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

const AlumniExperience = mongoose.model("AlumniExperience", alumniExperienceSchema);

export default AlumniExperience;
