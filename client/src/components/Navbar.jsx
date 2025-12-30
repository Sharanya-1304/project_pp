import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "👤 Profile", icon: "👤" },
    { path: "/dashboard", label: "📊 Dashboard", icon: "📊" },
    { path: "/leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
    { path: "/badges", label: "⭐ Badges", icon: "⭐" },
    { path: "/puzzles", label: "❓ Puzzles", icon: "❓" },
    { path: "/settings", label: "⚙️ Settings", icon: "⚙️" }
  ];

  return (
    <div className="w-64 fixed h-full bg-gray-900 text-white p-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-center py-4">Navigation</h2>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label.split(" ")[1] || item.label.split(" ")[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}