import { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

export default function Leaderboard() {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("votes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const usersPerPage = 10;

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/api/user/leaderboard?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let allUsers = response.data.data || response.data.users || [];

      // Sort users based on selected criteria
      allUsers.sort((a, b) => {
        if (sortBy === "votes") return b.votes - a.votes;
        if (sortBy === "posts") return b.posts - a.posts;
        if (sortBy === "feedbacks") return b.feedbacks - a.feedbacks;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });

      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.roll?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const endIdx = startIdx + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, endIdx);

  const getMedalEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getSortButtonClass = (sortOption) =>
    `px-4 py-2 rounded-lg font-semibold transition ${
      sortBy === sortOption
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  if (!user) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-indigo-100">Compete and climb the rankings!</p>
      </div>

      {/* Search and Sort Section */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name, email, or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📊 Sort By
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy("votes")}
              className={getSortButtonClass("votes")}
            >
              Votes ({users.reduce((sum, u) => sum + (u.votes || 0), 0)})
            </button>
            <button
              onClick={() => setSortBy("posts")}
              className={getSortButtonClass("posts")}
            >
              Posts ({users.reduce((sum, u) => sum + (u.posts || 0), 0)})
            </button>
            <button
              onClick={() => setSortBy("feedbacks")}
              className={getSortButtonClass("feedbacks")}
            >
              Feedbacks ({users.reduce((sum, u) => sum + (u.feedbacks || 0), 0)})
            </button>
            <button
              onClick={() => setSortBy("name")}
              className={getSortButtonClass("name")}
            >
              Name (A-Z)
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing {startIdx + 1}-{Math.min(endIdx, filteredUsers.length)} of{" "}
        {filteredUsers.length} users
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 mt-4">Loading leaderboard...</p>
          </div>
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-xl text-gray-600">No users found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Player</th>
                  <th className="px-6 py-4 text-left font-semibold">Roll</th>
                  <th className="px-6 py-4 text-center font-semibold">Posts</th>
                  <th className="px-6 py-4 text-center font-semibold">Votes</th>
                  <th className="px-6 py-4 text-center font-semibold">Feedback</th>
                  <th className="px-6 py-4 text-center font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((player, index) => {
                  const globalIndex = startIdx + index;
                  const score = (player.votes || 0) * 10 + (player.posts || 0) * 5;
                  const isCurrentUser = user._id === player._id;

                  return (
                    <tr
                      key={player._id}
                      className={`border-b border-gray-100 transition ${
                        isCurrentUser
                          ? "bg-indigo-50 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl">{getMedalEmoji(globalIndex)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {player.roll}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                        📝 {player.posts}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                        👍 {player.votes}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                        💬 {player.feedbacks}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold text-lg">
                          {score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm font-semibold">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{filteredUsers.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm font-semibold">Total Posts</p>
          <p className="text-3xl font-bold text-green-600">
            {filteredUsers.reduce((sum, u) => sum + (u.posts || 0), 0)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm font-semibold">Total Votes</p>
          <p className="text-3xl font-bold text-purple-600">
            {filteredUsers.reduce((sum, u) => sum + (u.votes || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
