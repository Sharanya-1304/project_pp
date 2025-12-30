import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Header() {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">💻</div>
          <h1 className="text-2xl font-bold">Code Platform</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-blue-100 capitalize">{user.role}</div>
            </div>
            <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}