import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      default: "",
    },
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    solvedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        solvedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
