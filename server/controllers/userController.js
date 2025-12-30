import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roll: user.roll,
      role: user.role,
      rank: user.rank,
      posts: user.posts,
      votes: user.votes,
      feedbacks: user.feedbacks,
      avatar: user.avatar,
      bio: user.bio
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find()
      .select("name email role rank posts votes feedbacks _id")
      .sort({ votes: -1, posts: -1 })
      .limit(limit);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.userId || req.query.userId;

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    user.updatedAt = new Date();

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roll: user.roll,
      role: user.role,
      rank: user.rank,
      posts: user.posts,
      votes: user.votes,
      feedbacks: user.feedbacks,
      avatar: user.avatar,
      bio: user.bio
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const dashboardData = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalUsers = await User.countDocuments();
    const userRank = await User.countDocuments({ votes: { $gt: user.votes } });

    res.json({
      posts: user.posts,
      votes: user.votes,
      feedbacks: user.feedbacks,
      rank: userRank + 1,
      totalUsers: totalUsers,
      engagementRate: user.votes > 0 ? ((user.votes / (user.posts + user.votes + user.feedbacks)) * 100).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { roll: { $regex: query, $options: "i" } }
      ]
    })
      .select("name email role rank posts votes feedbacks _id")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};