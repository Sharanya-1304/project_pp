import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AlumniExperiences = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    company: "",
    batch: "",
    department: "",
  });
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchExperiences();
    fetchAlumni();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(
        Object.entries(filter).filter(([_, v]) => v)
      );
      const response = await axios.get(`${API_URL}/api/alumni/experiences?${params}`);
      setExperiences(response.data.experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/alumni/alumni`);
      setAlumni(response.data.alumni);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);

    // Auto-fetch when filter changes
    if (value) {
      const params = new URLSearchParams(
        Object.entries(newFilter).filter(([_, v]) => v)
      );
      axios.get(`${API_URL}/api/alumni/experiences?${params}`).then((res) => {
        setExperiences(res.data.experiences);
      });
    }
  };

  const handleLike = async (experienceId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/alumni/experience/${experienceId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExperiences();
    } catch (error) {
      console.error("Error liking experience:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Alumni Experiences</h1>
          <p className="text-slate-400">Learn from the success stories of our alumni</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Filter Experiences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="company"
              placeholder="Search by company"
              value={filter.company}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
            />
            <input
              type="number"
              name="batch"
              placeholder="Filter by batch"
              value={filter.batch}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              name="department"
              placeholder="Filter by department"
              value={filter.department}
              onChange={handleFilterChange}
              className="px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Experiences Grid */}
        {loading ? (
          <div className="text-center text-white">Loading experiences...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp._id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-400 transition"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-purple-100">{exp.company}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Alumni Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {exp.alumniName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{exp.alumniName}</p>
                      <p className="text-slate-400 text-sm">
                        {exp.position} • {exp.designation}
                      </p>
                    </div>
                    {exp.companyVerified && (
                      <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        ✅ Verified
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-700">
                    <div>
                      <p className="text-slate-400 text-sm">CTC</p>
                      <p className="text-cyan-400 font-semibold">{exp.ctc || "N/A"} LPA</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Batch</p>
                      <p className="text-cyan-400 font-semibold">{exp.batch}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Department</p>
                      <p className="text-cyan-400 font-semibold">{exp.department || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Views</p>
                      <p className="text-cyan-400 font-semibold">{exp.views}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-300 mb-3">{exp.description}</p>
                    
                    {exp.challenges && (
                      <div className="mb-3">
                        <p className="text-slate-400 text-sm font-semibold mb-1">Challenges:</p>
                        <p className="text-slate-400 text-sm">{exp.challenges}</p>
                      </div>
                    )}

                    {exp.tips && (
                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-1">Tips:</p>
                        <p className="text-slate-400 text-sm">{exp.tips}</p>
                      </div>
                    )}
                  </div>

                  {/* Images Preview */}
                  {exp.images && exp.images.length > 0 && (
                    <div className="py-4 border-t border-slate-700">
                      <p className="text-slate-400 text-sm font-semibold mb-2">
                        📸 {exp.images.length} Image(s)
                      </p>
                      <div className="flex gap-2 overflow-x-auto">
                        {exp.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={img.caption}
                            className="w-20 h-20 rounded object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF Roadmap */}
                  {exp.roadmapPDF && (
                    <div className="py-4 border-t border-slate-700">
                      <a
                        href={exp.roadmapPDF.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                      >
                        📄 View Roadmap PDF
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleLike(exp._id)}
                      className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      ❤️ ({exp.likes?.length || 0})
                    </button>
                    <button 
                      onClick={() => navigate(`/experience/${exp._id}`)}
                      className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      💬 View Details
                    </button>
                    <button 
                      onClick={() => navigate(`/alumni-profile/${exp.alumniId}`)}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      👤 Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {experiences.length === 0 && !loading && (
          <div className="text-center text-slate-400 py-12">
            <p className="text-lg">No experiences found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniExperiences;
