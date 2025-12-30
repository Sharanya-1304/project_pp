import { useState } from "react";

export default function Puzzles() {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");

  const puzzles = [
    { id: 1, q: "What is MERN stack?", a: "MongoDB Express React Node - A full-stack JavaScript framework", difficulty: "easy", solved: true },
    { id: 2, q: "What is REST API?", a: "Representational State Transfer - A stateless architectural style for web services", difficulty: "easy", solved: true },
    { id: 3, q: "What is MongoDB?", a: "A NoSQL document-oriented database that stores data in flexible JSON-like documents", difficulty: "medium", solved: false },
    { id: 4, q: "Explain closure in JavaScript", a: "A function that has access to variables from another function's scope - this is created every time a function is created", difficulty: "hard", solved: false },
    { id: 5, q: "What are promises?", a: "Objects representing the eventual completion of an asynchronous operation and its resulting value", difficulty: "medium", solved: false }
  ];

  function toggle(id) {
    setOpen(open === id ? null : id);
  }

  const filtered = puzzles.filter((p) => {
    if (filter === "solved") return p.solved;
    if (filter === "unsolved") return !p.solved;
    if (filter === "easy") return p.difficulty === "easy";
    if (filter === "medium") return p.difficulty === "medium";
    if (filter === "hard") return p.difficulty === "hard";
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "bg-green-100 text-green-800";
    if (difficulty === "medium") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Puzzles & FAQs ❓</h2>
        <p className="text-gray-600">Test your knowledge and learn new concepts</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {["all", "easy", "medium", "hard", "solved", "unsolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 capitalize ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Puzzles List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
            <p>No puzzles match your filter</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-l-4 transition duration-200 ${
                item.solved ? "border-green-500" : "border-blue-500"
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left flex items-start justify-between hover:text-blue-600 transition duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{item.q}</h3>
                    {item.solved && <span className="text-green-600 font-bold">✓</span>}
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                <span className="text-2xl ml-4">{open === item.id ? "▼" : "▶"}</span>
              </button>

              {open === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 mb-4">{item.a}</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                    Mark as {item.solved ? "Unsolved" : "Solved"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Your Puzzle Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{filtered.length}</div>
            <p className="text-blue-100">Matching Puzzles</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{puzzles.filter((p) => p.solved).length}</div>
            <p className="text-blue-100">Solved</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round((puzzles.filter((p) => p.solved).length / puzzles.length) * 100)}%</div>
            <p className="text-blue-100">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
