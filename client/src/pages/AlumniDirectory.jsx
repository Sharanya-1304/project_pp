import React, { useState, useEffect } from "react";
import axios from "axios";

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/alumni/alumni`);
      setAlumni(response.data.alumni);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((alum) => {
    const name = alum.name?.toLowerCase() || "";
    const company = alum.company?.toLowerCase() || "";
    const batch = alum.batch?.toString() || "";
    const dept = alum.department?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase());
    const matchesBatch = !filterBatch || batch === filterBatch;
    const matchesDept = !filterDept || dept === filterDept;

    return matchesSearch && matchesBatch && matchesDept;
  });

  // Get unique batches and departments
  const uniqueBatches = [...new Set(alumni.map((a) => a.batch).filter(Boolean))].sort(
    (a, b) => b - a
  );
  const uniqueDepts = [
    ...new Set(alumni.map((a) => a.department).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Alumni Directory</h1>
          <p className="text-slate-400">
            Connect with successful alumni and learn from their experiences
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Search & Filter</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Batches</option>
                {uniqueBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>

              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Departments</option>
                {uniqueDepts.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-slate-400 mb-6">
          Found {filteredAlumni.length} alumni
        </p>

        {/* Alumni Grid */}
        {loading ? (
          <div className="text-center text-white">Loading alumni...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alum) => (
              <div
                key={alum._id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-400 transition"
              >
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-slate-800 mx-auto -mb-8">
                    {alum.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-12 space-y-4">
                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{alum.name}</h3>
                    <p className="text-cyan-400 text-sm">
                      {alum.userType === "alumni" ? "✓ Alumni" : "Student"}
                    </p>
                  </div>

                  {/* Company and Position */}
                  {alum.company && (
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">Current Position</p>
                      <p className="text-white font-semibold">{alum.position}</p>
                      <p className="text-cyan-400 text-sm">{alum.company}</p>
                      {alum.companyVerified && (
                        <div className="mt-2 inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                          ✅ Verified
                        </div>
                      )}
                    </div>
                  )}

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-700">
                    {alum.ctc && (
                      <div>
                        <p className="text-slate-400 text-xs">CTC</p>
                        <p className="text-cyan-400 font-semibold">{alum.ctc} LPA</p>
                      </div>
                    )}
                    {alum.batch && (
                      <div>
                        <p className="text-slate-400 text-xs">Batch</p>
                        <p className="text-cyan-400 font-semibold">{alum.batch}</p>
                      </div>
                    )}
                    {alum.department && (
                      <div>
                        <p className="text-slate-400 text-xs">Department</p>
                        <p className="text-cyan-400 font-semibold">{alum.department}</p>
                      </div>
                    )}
                    {alum.designation && (
                      <div>
                        <p className="text-slate-400 text-xs">Designation</p>
                        <p className="text-cyan-400 font-semibold">{alum.designation}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="text-center">
                    <p className="text-slate-400 text-xs mb-2">Email</p>
                    <p className="text-white text-sm break-all">{alum.email}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <button className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition">
                      View Profile
                    </button>
                    <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAlumni.length === 0 && !loading && (
          <div className="text-center text-slate-400 py-12">
            <p className="text-lg">No alumni found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;
