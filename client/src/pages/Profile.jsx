import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Profile() {
  const { user, setUser } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/api/user/update`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data.user);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
    setError("");
  };

  const score = (user.votes || 0) * 10 + (user.posts || 0) * 5;
  const engagementRate = user.votes && user.feedbacks
    ? Math.round((user.votes / (user.votes + user.feedbacks)) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
        <p className="text-indigo-100">View and manage your profile information</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-semibold">⚠️ {error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 font-semibold">✅ {success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-300 gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 font-semibold transition border-b-2 ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          📋 Profile Info
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-3 font-semibold transition border-b-2 ${
            activeTab === "stats"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Statistics
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-6 py-3 font-semibold transition border-b-2 ${
            activeTab === "achievements"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          🏆 Achievements
        </button>
      </div>

      {/* Profile Info Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />

          {/* Content */}
          <div className="px-8 pt-6 pb-10">
            {/* Avatar and Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 -mt-16 mb-10">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full border-4 border-white flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 pl-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
                    {user.roll}
                  </span>
                  {user.isVerified && (
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                      ✅ Verified
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                {isEditing ? "❌ Cancel" : "✏️ Edit"}
              </button>
            </div>

            {/* Edit Form or Display Info */}
            {isEditing ? (
              <div className="bg-gray-50 rounded-xl p-8 space-y-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex-1"
                  >
                    ✅ Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 space-y-6 mt-8">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">EMAIL</p>
                  <p className="text-lg text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">ROLL NUMBER</p>
                  <p className="text-lg text-gray-800">{user.roll}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">BIO</p>
                  <p className="text-lg text-gray-800">{user.bio || "No bio added yet"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">MEMBER SINCE</p>
                  <p className="text-lg text-gray-800">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">📝 Posts</p>
            <p className="text-4xl font-bold text-blue-600 mb-2">{user.posts || 0}</p>
            <p className="text-xs text-gray-500">Total posts created</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">👍 Votes</p>
            <p className="text-4xl font-bold text-green-600 mb-2">{user.votes || 0}</p>
            <p className="text-xs text-gray-500">Total votes received</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">💬 Feedback</p>
            <p className="text-4xl font-bold text-purple-600 mb-2">{user.feedbacks || 0}</p>
            <p className="text-xs text-gray-500">Total feedback given</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">⭐ Score</p>
            <p className="text-4xl font-bold text-yellow-600 mb-2">{score}</p>
            <p className="text-xs text-gray-500">Overall platform score</p>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-4">Engagement Rate</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min(engagementRate, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{engagementRate}%</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold mb-4">Level</p>
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {score >= 1000 ? "🏆" : score >= 500 ? "⭐" : score >= 100 ? "✨" : "🌟"}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {score >= 1000 ? "Expert" : score >= 500 ? "Advanced" : score >= 100 ? "Intermediate" : "Beginner"}
                </p>
                <p className="text-sm text-gray-600">Keep contributing to level up!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">🎖️ Achievements Unlocked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎉", title: "Getting Started", desc: "Created your first post" },
              { icon: "👍", title: "First Vote", desc: "Received your first vote" },
              { icon: "🔥", title: "On Fire", desc: "10 votes in a week", unlocked: user.votes >= 10 },
              { icon: "💯", title: "Perfectionist", desc: "100 total votes", unlocked: user.votes >= 100 },
              { icon: "📚", title: "Prolific Writer", desc: "10 posts created", unlocked: user.posts >= 10 },
              { icon: "🌟", title: "Community Star", desc: "100 total engagement", unlocked: (user.votes + user.posts) >= 100 },
            ].map((achievement, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 text-center transition transform hover:scale-105 ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400"
                    : "bg-gray-100 border-2 border-gray-300 opacity-50"
                }`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <p className="font-bold text-gray-800 mb-1">{achievement.title}</p>
                <p className="text-sm text-gray-600">{achievement.desc}</p>
                {achievement.unlocked && (
                  <p className="text-xs font-semibold text-green-600 mt-2">✅ Unlocked</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
