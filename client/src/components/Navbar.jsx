import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Navbar() {
  const location = useLocation();
  const { user } = useContext(AppContext);

  const baseNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { path: "/badges", label: "Badges", icon: "⭐" },
    { path: "/puzzles", label: "Puzzles", icon: "❓" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  // Add Alumni-specific items if user is alumni
  const navItems = [...baseNavItems];
  if (user?.userType === "alumni") {
    navItems.splice(5, 0, { path: "/alumni-directory", label: "Alumni Network", icon: "🌐" });
    navItems.splice(5, 0, { path: "/create-experience", label: "Share Experience", icon: "✍️" });
  }

  // Add Alumni experiences for all users
  navItems.splice(
    navItems.findIndex((item) => item.path === "/puzzles") + 1,
    0,
    { path: "/alumni-experiences", label: "Alumni Stories", icon: "📚" }
  );

  // Add Admin link if user is admin
  if (user?.email === "admin@example.com" || user?.role === "admin" || user?.isAdmin) {
    navItems.push({ path: "/admin", label: "Admin Panel", icon: "🔧" });
  }

  return (
    <div className="w-64 fixed h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 shadow-lg border-r border-gray-700 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">💻</div>
          <h2 className="text-lg font-bold">CodeHub</h2>
          <p className="text-xs text-gray-400">Community Platform</p>
          {user?.userType === "alumni" && (
            <p className="text-xs text-green-400 mt-1">🎓 Alumni</p>
          )}
        </div>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="mb-6 p-4 bg-indigo-900 bg-opacity-30 rounded-lg border border-indigo-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold mb-2">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-300">{user.roll}</p>
          {user.userType === "alumni" && user.company && (
            <p className="text-xs text-green-300 mt-1">{user.company}</p>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <ul className="space-y-2 mb-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Stats Card */}
      {user && (
        <div className="border-t border-gray-700 pt-4">
          <p className="text-xs font-semibold text-gray-400 mb-3 px-2">QUICK STATS</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between px-2 py-1">
              <span className="text-gray-300">Posts</span>
              <span className="font-bold text-indigo-400">{user.posts || 0}</span>
            </div>
            <div className="flex justify-between px-2 py-1">
              <span className="text-gray-300">Votes</span>
              <span className="font-bold text-green-400">{user.votes || 0}</span>
            </div>
            <div className="flex justify-between px-2 py-1">
              <span className="text-gray-300">Rank</span>
              <span className="font-bold text-yellow-400">#{user.rank || "—"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}