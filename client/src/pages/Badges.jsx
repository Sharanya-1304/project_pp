import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function Badges() {
  const { user } = useContext(AppContext);

  if (!user) return null;

  const earnedBadges = [
    { id: 1, title: "First Post", description: "Created your first post", icon: "📝", earned: user.posts > 0 },
    { id: 2, title: "Top Contributor", description: "50+ posts created", icon: "🌟", earned: user.posts >= 50 },
    { id: 3, title: "Most Helpful", description: "100+ votes received", icon: "❤️", earned: user.votes >= 100 }
  ];

  const allBadges = [
    ...earnedBadges,
    { id: 4, title: "Rising Star", description: "Reached top 10 in leaderboard", icon: "🚀", earned: false },
    { id: 5, title: "Problem Solver", description: "Solved 10 puzzles", icon: "🧩", earned: false },
    { id: 6, title: "Mentor", description: "Helped 20+ users", icon: "👨‍🏫", earned: false }
  ];

  const earnedCount = earnedBadges.filter((b) => b.earned).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Badges & Achievements ⭐</h2>
        <p className="text-gray-600">
          You have earned {earnedCount} badge{earnedCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Earned Badges */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Earned Badges 🏆</h3>
        {earnedCount === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
            <p>Start creating posts and helping others to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBadges
              .filter((b) => b.earned)
              .map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6 flex flex-col items-center text-center border-2 border-yellow-300"
                >
                  <div className="text-6xl mb-4">{badge.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{badge.title}</h3>
                  <p className="text-gray-600 text-sm">{badge.description}</p>
                  <div className="mt-4 text-xs font-semibold text-green-600">✓ EARNED</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* All Badges */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">All Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition duration-200 ${
                badge.earned
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300"
                  : "bg-gray-100 border-2 border-gray-300 opacity-70"
              }`}
            >
              <div className={`text-6xl mb-4 ${badge.earned ? "" : "grayscale"}`}>
                {badge.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{badge.title}</h3>
              <p className="text-gray-600 text-sm">{badge.description}</p>
              {badge.earned && (
                <div className="mt-4 text-xs font-semibold text-green-600">✓ EARNED</div>
              )}
              {!badge.earned && (
                <div className="mt-4 text-xs font-semibold text-gray-500">🔒 LOCKED</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Posts Progress</span>
              <span className="font-semibold">{user.posts}/50</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition duration-300"
                style={{ width: `${Math.min((user.posts / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Votes Progress</span>
              <span className="font-semibold">{user.votes}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition duration-300"
                style={{ width: `${Math.min((user.votes / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
