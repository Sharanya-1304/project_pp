import { useContext } from "react";
import { AppContext } from "../AppContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 hover-grow">
          <div className="text-3xl font-bold animate-bounce">💻</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">Code Hub</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-lg">{user.name}</div>
              <div className="text-xs text-indigo-100 capitalize font-semibold">{user.email.substring(0, 20)}...</div>
            </div>
            {user.isAdmin && (
              <Link
                to="/admin-dashboard"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 duration-200 font-bold shadow-lg text-sm"
              >
                👑 Admin Panel
              </Link>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 text-indigo-900 rounded-full flex items-center justify-center font-bold shadow-lg hover-lift">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2 rounded-lg transition transform hover:scale-105 duration-200 font-bold shadow-lg"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}