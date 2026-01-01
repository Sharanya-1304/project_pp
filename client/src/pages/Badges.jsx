import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Badges() {
  const { user } = useContext(AppContext);

  if (!user) return null;

  const badges = [
    {
      id: 1,
      icon: "🌟",
      title: "Getting Started",
      description: "Create your first post",
      color: "from-blue-400 to-blue-500",
      progress: 100,
      unlocked: true,
    },
    {
      id: 2,
      icon: "🔥",
      title: "On Fire",
      description: "Get 50 votes on a single post",
      color: "from-red-400 to-orange-500",
      progress: Math.min((user.votes / 50) * 100, 100),
      unlocked: user.votes >= 50,
    },
    {
      id: 3,
      icon: "💯",
      title: "Perfectionist",
      description: "Maintain 100% accuracy rating",
      color: "from-yellow-400 to-yellow-500",
      progress: 75,
      unlocked: false,
    },
    {
      id: 4,
      icon: "📚",
      title: "Author",
      description: "Write 10 posts",
      color: "from-purple-400 to-purple-500",
      progress: Math.min((user.posts / 10) * 100, 100),
      unlocked: user.posts >= 10,
    },
    {
      id: 5,
      icon: "🏆",
      title: "Champion",
      description: "Reach top 10 in leaderboard",
      color: "from-green-400 to-green-500",
      progress: 45,
      unlocked: false,
    },
    {
      id: 6,
      icon: "⭐",
      title: "Rising Star",
      description: "Get 500 total engagement",
      color: "from-pink-400 to-pink-500",
      progress: Math.min(((user.votes + user.posts + user.feedbacks) / 500) * 100, 100),
      unlocked: (user.votes + user.posts + user.feedbacks) >= 500,
    },
    {
      id: 7,
      icon: "🎯",
      title: "Precise",
      description: "Answer 20 questions correctly",
      color: "from-cyan-400 to-cyan-500",
      progress: 60,
      unlocked: false,
    },
    {
      id: 8,
      icon: "🚀",
      title: "Rocket",
      description: "Reach 1000 engagement points",
      color: "from-indigo-400 to-purple-500",
      progress: Math.min(((user.votes * 10 + user.posts * 5) / 1000) * 100, 100),
      unlocked: (user.votes * 10 + user.posts * 5) >= 1000,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalProgress = Math.round(
    badges.reduce((sum, b) => sum + (b.unlocked ? 100 : b.progress), 0) / badges.length
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">🎖️ Badges & Achievements</h1>
        <p className="text-indigo-100">Unlock badges by completing challenges!</p>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Badges Unlocked</p>
            <p className="text-4xl font-bold text-indigo-600">
              {unlockedCount}/{badges.length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Overall Progress</p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-600 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{totalProgress}%</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Next Achievement</p>
            <p className="text-lg font-bold text-purple-600">
              {badges.find((b) => !b.unlocked)?.title || "All Badges Unlocked! 🎉"}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl shadow-md overflow-hidden transition transform hover:scale-105 ${
              badge.unlocked
                ? `bg-gradient-to-br ${badge.color} text-white`
                : "bg-gray-100"
            }`}
          >
            <div className="p-6">
              {/* Icon */}
              <div className="text-5xl mb-4">{badge.icon}</div>

              {/* Title and Description */}
              <h3 className={`text-xl font-bold mb-2 ${
                badge.unlocked ? "text-white" : "text-gray-800"
              }`}>
                {badge.title}
              </h3>
              <p className={`text-sm mb-4 ${
                badge.unlocked ? "text-white text-opacity-90" : "text-gray-600"
              }`}>
                {badge.description}
              </p>

              {/* Progress Bar */}
              <div className={`rounded-full h-2 overflow-hidden ${
                badge.unlocked ? "bg-white bg-opacity-30" : "bg-gray-300"
              }`}>
                <div
                  className={`h-full transition-all ${
                    badge.unlocked
                      ? "bg-white"
                      : "bg-indigo-600"
                  }`}
                  style={{ width: `${badge.progress}%` }}
                />
              </div>

              {/* Status */}
              <div className="mt-4 text-sm font-semibold">
                {badge.unlocked ? (
                  <p className={badge.unlocked ? "text-white text-opacity-90" : "text-green-600"}>
                    ✅ Unlocked
                  </p>
                ) : (
                  <p className="text-gray-600">
                    {Math.round(badge.progress)}% Complete
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Tips to Unlock More Badges</h3>
        <ul className="space-y-2 text-blue-800">
          <li>✓ Create more posts to unlock the "Author" badge</li>
          <li>✓ Get more votes by creating high-quality content</li>
          <li>✓ Engage with the community to increase your overall score</li>
          <li>✓ Maintain a good engagement rate for badges</li>
          <li>✓ Participate actively to reach top rankings</li>
        </ul>
      </div>
    </div>
  );
}
