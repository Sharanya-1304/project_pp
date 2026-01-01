import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/alumni/experience/${id}`);
      setExperience(response.data.experience);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/alumni/experience/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchExperience();
    } catch (error) {
      console.error("Error liking experience:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/alumni/experience/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      fetchExperience();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isLiked = experience?.likes?.includes(user?._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading experience...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Experience not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          ← Back
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-white mb-4">{experience.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
              {experience.alumniName?.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{experience.alumniName}</p>
              <p className="text-purple-100">{experience.alumniEmail}</p>
            </div>
            {experience.companyVerified && (
              <span className="ml-auto px-4 py-2 bg-green-500/20 text-green-300 rounded-full font-semibold">
                ✅ Verified
              </span>
            )}
          </div>
        </div>

        {/* Company & Position Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Company</p>
              <p className="text-white font-bold text-lg">{experience.company}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Position</p>
              <p className="text-cyan-400 font-bold text-lg">{experience.position}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Designation</p>
              <p className="text-cyan-400 font-bold text-lg">{experience.designation}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">CTC</p>
              <p className="text-green-400 font-bold text-lg">{experience.ctc} LPA</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Batch</p>
              <p className="text-cyan-400 font-bold text-lg">{experience.batch}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Department</p>
              <p className="text-cyan-400 font-bold text-lg">{experience.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Views</p>
              <p className="text-purple-400 font-bold text-lg">{experience.views}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Join Date</p>
              <p className="text-purple-400 font-bold text-lg">
                {new Date(experience.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Experience Story</h3>
          <p className="text-slate-300 leading-relaxed mb-6">{experience.description}</p>

          {experience.challenges && (
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-2">🚧 Challenges</h4>
              <p className="text-slate-300 leading-relaxed">{experience.challenges}</p>
            </div>
          )}

          {experience.tips && (
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-2">💡 Tips & Advice</h4>
              <p className="text-slate-300 leading-relaxed">{experience.tips}</p>
            </div>
          )}

          {experience.testimonial && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-xl font-bold text-purple-300 mb-2">🎯 Testimonial</h4>
              <p className="text-slate-300 italic">{experience.testimonial}</p>
            </div>
          )}
        </div>

        {/* Images Gallery */}
        {experience.images && experience.images.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">📸 Experience Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experience.images.map((img, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-64 object-cover hover:scale-105 transition"
                  />
                  {img.caption && (
                    <p className="text-slate-300 text-sm p-2 bg-slate-700">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Roadmap */}
        {experience.roadmapPDF && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">📄 Roadmap</h3>
            <a
              href={experience.roadmapPDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              📥 Download Roadmap - {experience.roadmapPDF.fileName}
            </a>
          </div>
        )}

        {/* Engagement Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                isLiked
                  ? "bg-pink-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-white"
              }`}
            >
              ❤️ {experience.likes?.length || 0}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
              💬 {experience.comments?.length || 0}
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Comments</h3>

            {user && (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !comment.trim()}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition"
                  >
                    Post
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {experience.comments && experience.comments.length > 0 ? (
                experience.comments.map((cmt, idx) => (
                  <div key={idx} className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {cmt.userName?.charAt(0)}
                      </div>
                      <p className="text-white font-semibold">{cmt.userName}</p>
                      <p className="text-slate-400 text-sm ml-auto">
                        {new Date(cmt.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-slate-300">{cmt.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">No comments yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
