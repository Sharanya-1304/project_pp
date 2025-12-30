import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Profile() {
  const { user, setUser } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) return null;

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");
      const res = await axios.post(`${API_URL}/api/user/update`, { name: editName });
      setUser(res.data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white flex items-center justify-center text-white text-5xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-4 mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {user.role || "Member"}
                </span>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Roll: {user.roll}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-5xl font-bold mb-2">#{user.rank || 0}</div>
          <p className="text-blue-100">Current Rank</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-5xl font-bold mb-2">{user.posts || 0}</div>
          <p className="text-green-100">Posts Created</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-5xl font-bold mb-2">{user.votes || 0}</div>
          <p className="text-yellow-100">Votes Received</p>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(user.name);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">About</h3>
        <p className="text-gray-600 leading-relaxed">
          Welcome to Code Platform! This is your personal space to showcase your skills, earn badges, and compete on the leaderboard.
          Keep participating, solving puzzles, and helping others to climb the ranks!
        </p>
      </div>
    </div>
  );
}
