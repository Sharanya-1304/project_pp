import { useState } from "react";

export default function Puzzles() {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");
  const [solved, setSolved] = useState({});

  const puzzles = [
    { id: 1, q: "What is MERN stack?", a: "MongoDB Express React Node - A full-stack JavaScript framework combining a document-based database, a flexible backend, a reactive frontend, and a server runtime.", difficulty: "easy", category: "Web Dev" },
    { id: 2, q: "What is REST API?", a: "Representational State Transfer - An architectural style for web services that uses standard HTTP methods to perform operations on resources identified by URLs.", difficulty: "easy", category: "Backend" },
    { id: 3, q: "What is MongoDB?", a: "A NoSQL document-oriented database that stores data in flexible JSON-like documents. It's schema-less and horizontally scalable.", difficulty: "medium", category: "Database" },
    { id: 4, q: "Explain closure in JavaScript", a: "A function that has access to variables from another function's scope - this is created every time a function is created. Inner functions can access outer function variables.", difficulty: "hard", category: "JavaScript" },
    { id: 5, q: "What are promises?", a: "Objects representing the eventual completion of an asynchronous operation and its resulting value. They help manage async code more gracefully than callbacks.", difficulty: "medium", category: "JavaScript" },
    { id: 6, q: "How does React Virtual DOM work?", a: "React maintains a lightweight in-memory representation of the real DOM called Virtual DOM. It compares changes and updates only the necessary parts of the real DOM.", difficulty: "hard", category: "React" },
    { id: 7, q: "What is JWT authentication?", a: "JSON Web Token - A token-based authentication method where the server issues a signed token containing user information that the client sends with each request.", difficulty: "medium", category: "Security" },
    { id: 8, q: "What is normalization in databases?", a: "The process of organizing database schema to reduce redundancy and improve data integrity by breaking down tables into smaller, related tables.", difficulty: "hard", category: "Database" },
    { id: 9, q: "Explain async/await", a: "Syntactic sugar over promises that allows you to write asynchronous code in a synchronous-looking manner, making it easier to read and understand.", difficulty: "medium", category: "JavaScript" },
    { id: 10, q: "What is a React Hook?", a: "Functions that let you use state and other React features in functional components. Examples include useState, useEffect, useContext, etc.", difficulty: "easy", category: "React" },
  ];

  function toggle(id) {
    setOpen(open === id ? null : id);
  }

  function toggleSolved(id) {
    setSolved((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const filtered = puzzles.filter((p) => {
    if (filter === "solved") return solved[p.id];
    if (filter === "unsolved") return !solved[p.id];
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

  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">❓ Coding Puzzles & FAQs</h1>
        <p className="text-indigo-100">Test your knowledge and learn new concepts</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">Total Puzzles</p>
          <p className="text-3xl font-bold text-blue-600">{puzzles.length}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">Solved</p>
          <p className="text-3xl font-bold text-green-600">{solvedCount}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">Remaining</p>
          <p className="text-3xl font-bold text-orange-600">{puzzles.length - solvedCount}</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-purple-600">
            {puzzles.length > 0 ? Math.round((solvedCount / puzzles.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">🔍 Filter Puzzles</label>
        <div className="flex flex-wrap gap-2">
          {["all", "easy", "medium", "hard", "solved", "unsolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f === "all" ? "All Puzzles" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Puzzles List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No puzzles match your filter</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition transform hover:shadow-lg ${
                solved[item.id]
                  ? "border-green-500 hover:scale-105"
                  : "border-indigo-500"
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 transition flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {solved[item.id] ? "✅" : "📝"}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{item.q}</h3>
                      <p className="text-xs text-gray-500 mt-1">Category: {item.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                <span className="text-2xl ml-4 text-gray-400">
                  {open === item.id ? "▼" : "▶"}
                </span>
              </button>

              {open === item.id && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-6">{item.a}</p>
                  <button
                    onClick={() => toggleSolved(item.id)}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      solved[item.id]
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {solved[item.id] ? "✅ Mark as Unsolved" : "📌 Mark as Solved"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-900 mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-green-800">
          <li>✓ Start with easy puzzles to build confidence</li>
          <li>✓ Understand the concepts, don't just memorize answers</li>
          <li>✓ Try to explain answers in your own words</li>
          <li>✓ Hard puzzles will enhance your deep knowledge</li>
          <li>✓ Mark solved puzzles to track your progress</li>
        </ul>
      </div>
    </div>
  );
}
