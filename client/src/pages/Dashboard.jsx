import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Dashboard() {
  const { user } = useContext(AppContext);

  if (!user) return null;

  const stats = [
    { label: "Posts", value: user.posts || 0, icon: "📝", color: "from-blue-400 to-blue-600" },
    { label: "Votes", value: user.votes || 0, icon: "👍", color: "from-green-400 to-green-600" },
    { label: "Feedback", value: user.feedbacks || 0, icon: "💬", color: "from-yellow-400 to-yellow-600" },
    { label: "Rank", value: `#${user.rank || 0}`, icon: "🏅", color: "from-purple-400 to-purple-600" }
  ];

  const recentActivity = [
    { action: "Created a new post", time: "2 hours ago" },
    { action: "Received 5 votes", time: "1 day ago" },
    { action: "Completed a puzzle", time: "3 days ago" },
    { action: "Earned a badge", time: "1 week ago" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back, {user.name}! 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stat.icon}</span>
              <div className="text-right">
                <div className="text-sm font-medium opacity-80">{stat.label}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h3>
          <div className="h-48 flex items-end justify-around gap-2">
            {[40, 60, 45, 80, 70, 55, 90].map((val, i) => (
              <div
                key={i}
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition"
                style={{ height: `${val}%` }}
                title={`Day ${i + 1}: ${val}%`}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Mon • Tue • Wed • Thu • Fri • Sat • Sun
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">{Math.round((user.votes / (user.votes + user.feedbacks + 1)) * 100)}%</div>
            <p className="text-gray-600">Engagement Rate</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-green-600 mb-2">{user.posts}</div>
            <p className="text-gray-600">Total Contributions</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-purple-600 mb-2">⭐ 4.5</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}