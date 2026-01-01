import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "",
    content: "",
    answer: "",
    hint: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:4000/api";

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, questionsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/questions`),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setQuestions(questionsRes.data.questions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const questionData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      if (editingQuestion) {
        await axios.put(`${API_URL}/admin/questions/${editingQuestion._id}`, questionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Question updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/questions/add`, questionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Question added successfully!");
      }

      setFormData({
        title: "",
        description: "",
        difficulty: "Easy",
        category: "",
        content: "",
        answer: "",
        hint: "",
        tags: "",
      });
      setEditingQuestion(null);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/admin/questions/${questionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Question deleted successfully!");
        fetchAdminData();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete question");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      category: question.category,
      content: question.content,
      answer: question.answer,
      hint: question.hint || "",
      tags: question.tags.join(", "),
    });
    setActiveTab("questions");
  };

  const handleUpdateUserRole = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}/role`,
        { isAdmin: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("User role updated successfully!");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user role");
    }
  };

  const difficultyData = stats ? [
    { name: "Easy", value: stats.easyQuestions },
    { name: "Medium", value: stats.mediumQuestions },
    { name: "Hard", value: stats.hardQuestions },
  ] : [];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, questions, and monitor platform activity</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          {["overview", "users", "questions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-blue-100">Total Users</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <div className="text-purple-100">Total Questions</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.totalAdmins}</div>
                <div className="text-green-100">Admin Users</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="text-3xl font-bold">{stats.totalQuestions > 0 ? Math.round((stats.easyQuestions / stats.totalQuestions) * 100) : 0}%</div>
                <div className="text-orange-100">Easy Questions</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Difficulty Distribution */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-lg">
                <h3 className="text-white font-semibold mb-4">Question Difficulty Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-lg">
                <h3 className="text-white font-semibold mb-4">Question Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                    <span className="text-slate-300">Easy</span>
                    <span className="text-green-400 font-bold">{stats.easyQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                    <span className="text-slate-300">Medium</span>
                    <span className="text-yellow-400 font-bold">{stats.mediumQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
                    <span className="text-slate-300">Hard</span>
                    <span className="text-red-400 font-bold">{stats.hardQuestions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Roll</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Verified</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Admin</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Posts</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Votes</th>
                    <th className="px-6 py-3 text-left text-slate-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-3 text-slate-200">{user.name}</td>
                      <td className="px-6 py-3 text-slate-400 text-sm">{user.email}</td>
                      <td className="px-6 py-3 text-slate-400 text-sm">{user.roll}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isVerified ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {user.isVerified ? "✅ Yes" : "❌ No"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isAdmin ? "bg-purple-500/20 text-purple-400" : "bg-slate-500/20 text-slate-400"}`}>
                          {user.isAdmin ? "👑 Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-300">{user.posts}</td>
                      <td className="px-6 py-3 text-slate-300">{user.votes}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleUpdateUserRole(user._id, user.isAdmin)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            user.isAdmin
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          }`}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Add Question Form */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-lg">
              <h2 className="text-white text-xl font-bold mb-6">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h2>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="2"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Question Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />

                <textarea
                  placeholder="Hint (optional)"
                  value={formData.hint}
                  onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50"
                  >
                    {loading ? "Processing..." : editingQuestion ? "Update Question" : "Add Question"}
                  </button>
                  {editingQuestion && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(null);
                        setFormData({
                          title: "",
                          description: "",
                          difficulty: "Easy",
                          category: "",
                          content: "",
                          answer: "",
                          hint: "",
                          tags: "",
                        });
                      }}
                      className="px-6 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Questions List */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-white font-semibold text-lg">All Questions ({questions.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Title</th>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Category</th>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Difficulty</th>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Created By</th>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Created At</th>
                      <th className="px-6 py-3 text-left text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question._id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                        <td className="px-6 py-3 text-slate-200">{question.title}</td>
                        <td className="px-6 py-3 text-slate-400">{question.category}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              question.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400"
                                : question.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-400 text-sm">{question.createdBy?.userName || "Unknown"}</td>
                        <td className="px-6 py-3 text-slate-400 text-sm">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold hover:bg-red-500/30 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
