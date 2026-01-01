import AlumniExperience from "../models/AlumniExperience.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

// ==================== CREATE ALUMNI EXPERIENCE ====================
export const createExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { title, company, position, designation, ctc, batch, department, description, challenges, tips, testimonial } = req.body;

    // Verify user is alumni
    const user = await User.findById(userId);
    if (!user || user.userType !== "alumni") {
      return res.status(403).json({ message: "Only alumni can create experiences" });
    }

    // Verify company exists
    let companyDoc = await Company.findOne({ companyName: company.toLowerCase() });
    if (!companyDoc) {
      companyDoc = await Company.create({
        companyName: company.toLowerCase(),
        isVerified: false,
      });
    }

    const experience = new AlumniExperience({
      alumniId: userId,
      alumniName: user.name,
      alumniEmail: user.email,
      title,
      company,
      position,
      designation: designation || user.designation,
      ctc: ctc || user.ctc,
      batch: batch || user.batch,
      department: department || user.department,
      joinDate: user.joinDate,
      description,
      challenges: challenges || "",
      tips: tips || "",
      testimonial: testimonial || "",
      companyVerified: companyDoc.isVerified,
    });

    await experience.save();

    res.status(201).json({
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating experience", error: error.message });
  }
};

// ==================== GET ALL EXPERIENCES ====================
export const getAllExperiences = async (req, res) => {
  try {
    const { company, batch, department, position } = req.query;

    let filter = {};
    if (company) filter.company = new RegExp(company, "i");
    if (batch) filter.batch = parseInt(batch);
    if (department) filter.department = new RegExp(department, "i");
    if (position) filter.position = new RegExp(position, "i");

    const experiences = await AlumniExperience.find(filter)
      .populate("alumniId", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Experiences fetched successfully",
      experiences,
      totalExperiences: experiences.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences", error: error.message });
  }
};

// ==================== GET SINGLE EXPERIENCE ====================
export const getExperienceById = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const experience = await AlumniExperience.findByIdAndUpdate(
      experienceId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("alumniId", "name email avatar");

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json({
      message: "Experience fetched successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience", error: error.message });
  }
};

// ==================== UPDATE EXPERIENCE ====================
export const updateExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const userId = req.user?.id;
    const { title, description, challenges, tips, testimonial } = req.body;

    const experience = await AlumniExperience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Verify ownership
    if (experience.alumniId.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own experiences" });
    }

    const updatedExperience = await AlumniExperience.findByIdAndUpdate(
      experienceId,
      { title, description, challenges, tips, testimonial, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      message: "Experience updated successfully",
      experience: updatedExperience,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating experience", error: error.message });
  }
};

// ==================== DELETE EXPERIENCE ====================
export const deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const userId = req.user?.id;

    const experience = await AlumniExperience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Verify ownership
    if (experience.alumniId.toString() !== userId) {
      return res.status(403).json({ message: "You can only delete your own experiences" });
    }

    await AlumniExperience.findByIdAndDelete(experienceId);

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience", error: error.message });
  }
};

// ==================== LIKE/UNLIKE EXPERIENCE ====================
export const toggleLike = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const userId = req.user?.id;

    const experience = await AlumniExperience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const likeIndex = experience.likes.findIndex(like => like.userId.toString() === userId);

    if (likeIndex > -1) {
      // Unlike
      experience.likes.splice(likeIndex, 1);
    } else {
      // Like
      experience.likes.push({ userId });
    }

    await experience.save();

    res.status(200).json({
      message: likeIndex > -1 ? "Unliked successfully" : "Liked successfully",
      likes: experience.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// ==================== ADD COMMENT ====================
export const addComment = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const user = await User.findById(userId);
    const experience = await AlumniExperience.findById(experienceId);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.comments.push({
      userId,
      userName: user.name,
      text,
    });

    await experience.save();

    res.status(200).json({
      message: "Comment added successfully",
      comments: experience.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// ==================== GET ALUMNI PROFILE ====================
export const getAlumniProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || user.userType !== "alumni") {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const experiences = await AlumniExperience.find({ alumniId: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Alumni profile fetched successfully",
      profile: {
        ...user.toObject(),
        experiences,
        totalExperiences: experiences.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching alumni profile", error: error.message });
  }
};

// ==================== GET ALL ALUMNI ====================
export const getAllAlumni = async (req, res) => {
  try {
    const { company, batch, department } = req.query;

    let filter = { userType: "alumni" };
    if (company) filter.company = new RegExp(company, "i");
    if (batch) filter.batch = parseInt(batch);
    if (department) filter.department = new RegExp(department, "i");

    const alumni = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Alumni fetched successfully",
      alumni,
      totalAlumni: alumni.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching alumni", error: error.message });
  }
};

// ==================== VERIFY COMPANY ====================
export const verifyCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    const company = await Company.findOne({ companyName: companyName.toLowerCase() });
    if (!company) {
      return res.status(404).json({ message: "Company not found in database" });
    }

    res.status(200).json({
      message: "Company verification status",
      company: {
        name: company.companyName,
        verified: company.isVerified,
        website: company.website,
        headquarters: company.headquarters,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying company", error: error.message });
  }
};

// ==================== GET COMPANIES LIST ====================
export const getCompaniesList = async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyName: 1 });

    res.status(200).json({
      message: "Companies fetched successfully",
      companies,
      totalCompanies: companies.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error: error.message });
  }
};
