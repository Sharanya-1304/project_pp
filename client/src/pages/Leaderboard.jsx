import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Leaderboard() {
  const { user } = useContext(AppContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/user/leaderboard`)
      .then((res) => setList(res.data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard 🏆</h2>
        <p className="text-gray-600">Top performers in the community</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No users found yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Rank</th>
                <th className="px-6 py-4 text-left font-bold">Name</th>
                <th className="px-6 py-4 text-left font-bold">Role</th>
                <th className="px-6 py-4 text-right font-bold">Votes</th>
                <th className="px-6 py-4 text-right font-bold">Posts</th>
                <th className="px-6 py-4 text-right font-bold">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map((u, i) => (
                <tr
                  key={u._id}
                  className={`hover:bg-blue-50 transition duration-200 ${
                    u._id === user._id ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-center text-xl font-bold w-16">
                    {getMedalIcon(i + 1)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm capitalize">
                      {u.role || "Member"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">{u.votes || 0}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{u.posts || 0}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">
                    {(u.votes || 0) * 2 + (u.posts || 0) * 5}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Your Rank Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Your Position</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">#{user.rank || "N/A"}</div>
            <p className="text-blue-100">Current Rank</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{user.votes || 0}</div>
            <p className="text-blue-100">Total Votes</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">⭐ 4.5</div>
            <p className="text-blue-100">Your Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
