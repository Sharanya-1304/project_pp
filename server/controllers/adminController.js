import Question from "../models/Question.js";
import User from "../models/User.js";

export const addQuestion = async (req, res) => {
  try {
    const { title, description, difficulty, category, content, answer, hint, tags } = req.body;
    const userId = req.user?.id;

    // Check if user is admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Only admins can add questions" });
    }

    const newQuestion = new Question({
      title,
      description,
      difficulty,
      category,
      content,
      answer,
      hint: hint || "",
      tags: tags || [],
      createdBy: userId,
    });

    await newQuestion.save();

    res.status(201).json({
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error: error.message });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Questions fetched successfully",
      questions,
      totalQuestions: questions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

export const getQuestionsByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;

    const questions = await Question.find({ difficulty })
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: `${difficulty} questions fetched successfully`,
      questions,
      totalQuestions: questions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, difficulty, category, content, answer, hint, tags } = req.body;
    const userId = req.user?.id;

    // Check if user is admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Only admins can update questions" });
    }

    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        title,
        description,
        difficulty,
        category,
        content,
        answer,
        hint: hint || "",
        tags: tags || [],
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user?.id;

    // Check if user is admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Only admins can delete questions" });
    }

    await Question.findByIdAndDelete(questionId);

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Check if user is admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Only admins can access stats" });
    }

    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const easyQuestions = await Question.countDocuments({ difficulty: "Easy" });
    const mediumQuestions = await Question.countDocuments({ difficulty: "Medium" });
    const hardQuestions = await Question.countDocuments({ difficulty: "Hard" });
    const totalAdmins = await User.countDocuments({ isAdmin: true });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);
    const recentQuestions = await Question.find()
      .populate("createdBy", "userName email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Admin stats fetched successfully",
      stats: {
        totalUsers,
        totalQuestions,
        easyQuestions,
        mediumQuestions,
        hardQuestions,
        totalAdmins,
      },
      recentUsers,
      recentQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error: error.message });
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Check if user is admin
    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Only admins can access user list" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      message: "All users fetched successfully",
      users,
      totalUsers: users.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;
    const adminId = req.user?.id;

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Only admins can update user roles" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
};
