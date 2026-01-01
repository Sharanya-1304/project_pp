import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateExperience = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    challenges: "",
    tips: "",
    company: "",
    position: "",
    designation: "",
    ctc: "",
    batch: "",
    department: "",
    testimonial: "",
  });

  const [images, setImages] = useState([]);
  const [roadmapPDF, setRoadmapPDF] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handlePDFUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setRoadmapPDF(file);
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.description || !formData.company) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file uploads
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Add images
      images.forEach((img) => {
        submitData.append("images", img);
      });

      // Add PDF
      if (roadmapPDF) {
        submitData.append("roadmapPDF", roadmapPDF);
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/alumni/experience/create`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Experience shared successfully!");
      setTimeout(() => {
        navigate("/alumni-experiences");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Share Your Experience</h1>
          <p className="text-slate-400">
            Help junior students with your valuable experience and insights
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8"
        >
          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Experience Title (e.g., My Google Interview Journey)"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />

              <textarea
                name="description"
                placeholder="Describe your overall experience, how you prepared, what made you stand out..."
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />

              <textarea
                name="challenges"
                placeholder="What challenges did you face during your journey?"
                value={formData.challenges}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />

              <textarea
                name="tips"
                placeholder="Tips and tricks for students preparing for similar roles"
                value={formData.tips}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Company & Position Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Company & Position Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                name="position"
                placeholder="Position (e.g., Software Engineer)"
                value={formData.position}
                onChange={handleInputChange}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation (e.g., SDE-1)"
                value={formData.designation}
                onChange={handleInputChange}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                name="ctc"
                placeholder="CTC (in LPA)"
                value={formData.ctc}
                onChange={handleInputChange}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                name="batch"
                placeholder="Batch Year"
                value={formData.batch}
                onChange={handleInputChange}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleInputChange}
                className="px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Add Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-2">Upload Experience Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />
                {images.length > 0 && (
                  <p className="text-green-400 text-sm mt-2">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-400 mb-2">Upload Roadmap PDF (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                />
                {roadmapPDF && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ {roadmapPDF.name} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
            <textarea
              name="testimonial"
              placeholder="Testimonial or final thoughts (Optional)"
              value={formData.testimonial}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold rounded-lg transition"
            >
              {loading ? "Publishing..." : "Publish Experience"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExperience;
