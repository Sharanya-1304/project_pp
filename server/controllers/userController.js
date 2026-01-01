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
      rank: user.rank,
      posts: user.posts,
      votes: user.votes,
      feedbacks: user.feedbacks,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("name email rank posts votes feedbacks _id avatar")
      .sort({ votes: -1, posts: -1, feedbacks: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      data: users,
      pagination: {
        total: totalUsers,
        page,
        pages: Math.ceil(totalUsers / limit),
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const userId = req.userId || req.query.userId;

    if (!name && !bio && !avatar) {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

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
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll: user.roll,
        rank: user.rank,
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified
      }
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
    const totalVotes = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$votes" } } }
    ]);

    res.json({
      stats: {
        posts: user.posts,
        votes: user.votes,
        feedbacks: user.feedbacks,
        rank: userRank + 1,
        totalUsers: totalUsers,
        globalVotes: totalVotes[0]?.total || 0
      },
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roll: user.roll,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { roll: { $regex: query, $options: "i" } }
      ]
    })
      .select("name email rank posts votes feedbacks _id avatar roll")
      .limit(parseInt(limit));

    res.json({
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};