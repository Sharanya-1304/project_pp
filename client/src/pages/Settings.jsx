import { useContext, useState } from "react";
import { AppContext } from "../AppContext";

export default function Settings() {
  const { user, setUser } = useContext(AppContext);
  const [theme, setTheme] = useState("light");
  const [name, setName] = useState(user ? user.name : "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [success, setSuccess] = useState("");

  if (!user) return null;

  function handleSave() {
    setUser({ ...user, name });
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
    setSuccess(`Theme changed to ${theme === "light" ? "dark" : "light"} mode!`);
    setTimeout(() => setSuccess(""), 3000);
  }

  function handleReset() {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setTheme("light");
      setNotificationsEnabled(true);
      setEmailUpdates(true);
      setSuccess("Settings reset to default!");
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              value={user.email}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Theme</p>
              <p className="text-sm text-gray-600">
                Current: {theme === "light" ? "Light Mode" : "Dark Mode"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-6 py-2 rounded-lg transition duration-200 font-medium ${
                theme === "light"
                  ? "bg-gray-800 text-white hover:bg-gray-900"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Enable Notifications</p>
              <p className="text-sm text-gray-600">Get notified about updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationsEnabled}
                onChange={() =>
                  setNotificationsEnabled(!notificationsEnabled)
                }
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Email Updates</p>
              <p className="text-sm text-gray-600">Receive weekly digest emails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailUpdates}
                onChange={() => setEmailUpdates(!emailUpdates)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <button
            onClick={handleReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
          >
            Reset All Settings
          </button>
          <p className="text-sm text-red-700">
            This action will reset all settings to their default values.
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Account Information</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Member Since:</span> January 2025
          </p>
          <p>
            <span className="font-semibold">Account Status:</span>
            <span className="text-green-600 font-bold ml-2">Active</span>
          </p>
          <p>
            <span className="font-semibold">Current Role:</span> {user.role}
          </p>
          <p>
            <span className="font-semibold">Rank:</span> #{user.rank || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
