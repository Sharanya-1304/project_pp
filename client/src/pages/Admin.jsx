import { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

export default function Admin() {
  const { user } = useContext(AppContext);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    posts: 0,
    votes: 0,
    feedbacks: 0,
    rank: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalVotes: 0,
    totalFeedbacks: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchAllUsers();
    if (user) {
      setStats({
        totalUsers: 15, // This would be fetched from DB
        totalPosts: 500,
        totalVotes: 4500,
        totalFeedbacks: 300,
      });
    }
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/user/leaderboard?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const users = response.data.data || response.data.users || [];
      setAllUsers(users);

      // Calculate statistics
      const totalPosts = users.reduce((sum, u) => sum + (u.posts || 0), 0);
      const totalVotes = users.reduce((sum, u) => sum + (u.votes || 0), 0);
      const totalFeedbacks = users.reduce((sum, u) => sum + (u.feedbacks || 0), 0);

      setStats({
        totalUsers: users.length,
        totalPosts,
        totalVotes,
        totalFeedbacks,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      posts: user.posts || 0,
      votes: user.votes || 0,
      feedbacks: user.feedbacks || 0,
      rank: user.rank || 0,
    });
  };

  const handleSaveUser = async () => {
    try {
      // This would typically make an API call to update the user
      const updatedUsers = allUsers.map((u) =>
        u._id === editingUser
          ? {
              ...u,
              ...formData,
            }
          : u
      );

      setAllUsers(updatedUsers);
      setEditingUser(null);
      setFormData({ name: "", posts: 0, votes: 0, feedbacks: 0, rank: 0 });

      // Show success message (would use toast in production)
      alert("User updated successfully!");
    } catch (error) {
      alert("Error updating user: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: "", posts: 0, votes: 0, feedbacks: 0, rank: 0 });
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.roll?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is admin (in production, this would be based on user role)
  const isAdmin = user?.email === "admin@example.com" || user?.role === "admin";

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-red-600">
          You do not have permission to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">⚙️ Admin Panel</h1>
        <p className="text-orange-100">Manage users and monitor platform statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalUsers}</div>
          <p className="text-gray-600 font-semibold">Total Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalPosts}</div>
          <p className="text-gray-600 font-semibold">Total Posts</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalVotes}</div>
          <p className="text-gray-600 font-semibold">Total Votes</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-4xl font-bold text-pink-600 mb-2">{stats.totalFeedbacks}</div>
          <p className="text-gray-600 font-semibold">Total Feedback</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👥 User Management</h2>
          <button
            onClick={fetchAllUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name, email, or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600 mt-2">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Roll</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Posts</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Votes</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Feedback</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.roll}</td>
                    <td className="px-6 py-4 text-center font-semibold">{user.posts}</td>
                    <td className="px-6 py-4 text-center font-semibold">{user.votes}</td>
                    <td className="px-6 py-4 text-center font-semibold">{user.feedbacks}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posts
                </label>
                <input
                  type="number"
                  value={formData.posts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      posts: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Votes
                </label>
                <input
                  type="number"
                  value={formData.votes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      votes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Feedbacks
                </label>
                <input
                  type="number"
                  value={formData.feedbacks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feedbacks: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rank
                </label>
                <input
                  type="number"
                  value={formData.rank}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rank: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveUser}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                ✅ Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
