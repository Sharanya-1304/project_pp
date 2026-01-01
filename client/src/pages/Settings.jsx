import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [privacy, setPrivacy] = useState("public");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  function handleSave() {
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
    setSuccess(`Theme changed to ${theme === "light" ? "dark" : "light"} mode!`);
    setTimeout(() => setSuccess(""), 3000);
  }

  function handlePasswordChange() {
    // In a real app, this would trigger a password reset flow
    navigate("/forgot-password");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setSuccess("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1500);
  }

  function handleReset() {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setTheme("light");
      setNotificationsEnabled(true);
      setEmailUpdates(true);
      setPrivacy("public");
      setSuccess("Settings reset to default!");
      setTimeout(() => setSuccess(""), 3000);
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
        <p className="text-indigo-100">Manage your account and preferences</p>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 font-semibold">✅ {success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-300 gap-4">
        {[
          { id: "profile", label: "👤 Profile", icon: "👤" },
          { id: "security", label: "🔒 Security", icon: "🔒" },
          { id: "notifications", label: "🔔 Notifications", icon: "🔔" },
          { id: "privacy", label: "👁️ Privacy", icon: "👁️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Roll Number
              </label>
              <input
                type="text"
                defaultValue={user.roll}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Roll number cannot be changed</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                defaultValue={user.bio || ""}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition resize-none h-24"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            💾 Save Profile
          </button>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>

          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Password</h3>
                <p className="text-sm text-gray-600">Change your password regularly to keep your account secure</p>
              </div>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
              >
                🔄 Change Password
              </button>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold"
              >
                Coming Soon
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-blue-900 font-semibold">🔐 Account Status</p>
            <p className="text-blue-800 mt-2">
              ✅ Your account is secure and verified
            </p>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>

          <div className="space-y-4">
            {[
              {
                title: "Email Notifications",
                desc: "Receive email when someone interacts with your posts",
                icon: "📧",
              },
              {
                title: "Weekly Digest",
                desc: "Get a weekly summary of your activity and top posts",
                icon: "📰",
              },
              {
                title: "Leaderboard Updates",
                desc: "Notify me when I rank up or down in leaderboard",
                icon: "📊",
              },
              {
                title: "Community Activity",
                desc: "Updates about new posts and discussions in my interests",
                icon: "👥",
              },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">{notif.icon} {notif.title}</p>
                  <p className="text-sm text-gray-600">{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={notificationsEnabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold w-full"
          >
            💾 Save Preferences
          </button>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Privacy Settings</h2>

          <div className="space-y-4">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Profile Visibility</h3>
              {["Public", "Friends Only", "Private"].map((option) => (
                <label key={option} className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value={option.toLowerCase()}
                    defaultChecked={option === "Public"}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Data Sharing</h3>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">Allow others to see my posts</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold w-full"
          >
            💾 Save Privacy Settings
          </button>
        </div>
      )}

      {/* Account Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-3">🔐 Advanced</h3>
          <button
            onClick={() => alert("Data export coming soon!")}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            📥 Download My Data
          </button>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-900 mb-3">⚠️ Danger Zone</h3>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">📋 Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-700 mb-1">MEMBER SINCE</p>
            <p className="text-gray-800 font-semibold">January 2025</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-700 mb-1">ACCOUNT STATUS</p>
            <p className="text-green-600 font-semibold">✅ Active</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-700 mb-1">CURRENT RANK</p>
            <p className="text-gray-800 font-semibold">#{user.rank || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
