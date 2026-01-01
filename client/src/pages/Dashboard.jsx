import { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      // Fetch top players
      try {
        const leaderResponse = await axios.get(`${API_URL}/api/user/leaderboard?limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // API returns 'data' field with users array
        const players = leaderResponse.data.data || leaderResponse.data.users || [];
        setTopPlayers(players);
      } catch (err) {
        console.log("Leaderboard data not available:", err.message);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const statCards = [
    {
      label: "Posts",
      value: user.posts || 0,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Votes",
      value: user.votes || 0,
      icon: "👍",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Feedback",
      value: user.feedbacks || 0,
      icon: "💬",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Rank",
      value: `#${user.rank || 0}`,
      icon: "🏆",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-indigo-100">Here's your performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 shadow-md hover:shadow-lg transition transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm">{stat.label}</h3>
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <div className="mb-2">
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Activity</h2>
          <div className="h-48 flex items-end justify-around gap-2">
            {[40, 60, 45, 80, 70, 55, 90].map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg hover:from-indigo-600 hover:to-indigo-400 transition cursor-pointer"
                style={{ height: `${val}%` }}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Mon • Tue • Wed • Thu • Fri • Sat • Sun
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Info</h2>

          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold">NAME</p>
              <p className="text-lg font-bold text-gray-800">{user.name}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold">ROLL</p>
              <p className="text-sm font-semibold text-gray-800">{user.roll}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold">STATUS</p>
              <p className="text-sm font-bold">
                <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
                  {user.isVerified ? "✅ Verified" : "❌ Unverified"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Players Section */}
      {topPlayers.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Players</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Rank</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Player</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Posts</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Votes</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <tr key={player._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <span className="text-xl font-bold">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.roll}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700 font-semibold">
                      {player.posts}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700 font-semibold">
                      {player.votes}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold">
                        {(player.votes * 10 + player.posts * 5) || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}