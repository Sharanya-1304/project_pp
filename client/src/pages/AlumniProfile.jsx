import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AlumniProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchProfile(userData._id);
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/alumni/alumni/${userId}`);
      setProfile(response.data.alumni);
      setIsOwnProfile(response.data.alumni._id === user?._id);

      // Fetch alumni's experiences
      const expResponse = await axios.get(
        `${API_URL}/api/alumni/experiences?alumniId=${userId}`
      );
      setExperiences(expResponse.data.experiences);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        {!isOwnProfile && (
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        )}

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-blue-600 border-4 border-slate-800">
              {profile.name?.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
              <p className="text-blue-100 text-lg mb-4">{profile.email}</p>

              {profile.userType === "alumni" && (
                <div className="space-y-2">
                  {profile.companyVerified && (
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                      ✅ Verified Alumni
                    </span>
                  )}
                  <p className="text-blue-100 text-lg">
                    <span className="font-semibold">{profile.position}</span> at{" "}
                    <span className="font-bold">{profile.company}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Edit Button */}
            {isOwnProfile && (
              <button
                onClick={() => navigate("/settings")}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Experiences */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Experiences Shared</p>
            <p className="text-4xl font-bold text-cyan-400">{experiences.length}</p>
          </div>

          {/* Total Likes */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Total Likes Received</p>
            <p className="text-4xl font-bold text-pink-400">
              {experiences.reduce((sum, exp) => sum + (exp.likes?.length || 0), 0)}
            </p>
          </div>

          {/* Total Views */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Total Views</p>
            <p className="text-4xl font-bold text-purple-400">
              {experiences.reduce((sum, exp) => sum + (exp.views || 0), 0)}
            </p>
          </div>

          {/* Join Date */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm">Joined</p>
            <p className="text-xl font-bold text-green-400">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Detailed Info */}
        {profile.userType === "alumni" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Professional Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Company</p>
                <p className="text-white font-semibold">{profile.company || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Position</p>
                <p className="text-white font-semibold">{profile.position || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Designation</p>
                <p className="text-white font-semibold">{profile.designation || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">CTC</p>
                <p className="text-cyan-400 font-semibold">{profile.ctc || "N/A"} LPA</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Batch</p>
                <p className="text-white font-semibold">{profile.batch || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Department</p>
                <p className="text-white font-semibold">{profile.department || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Experiences Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">
            Shared Experiences ({experiences.length})
          </h3>

          {experiences.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  onClick={() => navigate(`/experience/${exp._id}`)}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-400 transition cursor-pointer"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                    <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                    <p className="text-purple-100">{exp.company}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-slate-300 line-clamp-3 mb-4">
                      {exp.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm py-4 border-t border-slate-700">
                      <span className="text-slate-400">
                        👁️ {exp.views} views
                      </span>
                      <span className="text-pink-400">
                        ❤️ {exp.likes?.length || 0} likes
                      </span>
                      <span className="text-cyan-400">
                        💬 {exp.comments?.length || 0} comments
                      </span>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-400">Position</p>
                        <p className="text-cyan-400 font-semibold">
                          {exp.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">CTC</p>
                        <p className="text-green-400 font-semibold">
                          {exp.ctc} LPA
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <button className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-slate-400 text-lg">
                {isOwnProfile
                  ? "You haven't shared any experiences yet. Click 'Share Experience' to get started!"
                  : "No experiences shared yet."}
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/create-experience")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Share Your First Experience
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
