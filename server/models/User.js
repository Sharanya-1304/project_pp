import mongoose from "mongoose";

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

export default mongoose.model("User", userSchema);
