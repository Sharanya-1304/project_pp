import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import RoleSelection from "./pages/RoleSelection";
import RegisterNew from "./pages/RegisterNew";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Badges from "./pages/Badges";
import Puzzles from "./pages/Puzzles";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AlumniExperiences from "./pages/AlumniExperiences";
import CreateExperience from "./pages/CreateExperience";
import AlumniDirectory from "./pages/AlumniDirectory";
import ExperienceDetail from "./pages/ExperienceDetail";
import AlumniProfile from "./pages/AlumniProfile";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AppContext } from "./AppContext";

const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-6 w-full">
        {children}
      </div>
    </div>
  </div>
);

export default function App() {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/choose-role" element={user ? <Navigate to="/dashboard" /> : <RoleSelection />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterNew />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={user ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/choose-role" />} />
      <Route path="/dashboard" element={user ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <ProtectedLayout><Profile /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/leaderboard" element={user ? <ProtectedLayout><Leaderboard /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/badges" element={user ? <ProtectedLayout><Badges /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/puzzles" element={user ? <ProtectedLayout><Puzzles /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <ProtectedLayout><Settings /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/admin" element={user ? <ProtectedLayout><Admin /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/admin-dashboard" element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
      
      {/* Alumni Routes */}
      <Route path="/alumni-profile" element={user ? <ProtectedLayout><AlumniProfile /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/alumni-experiences" element={user ? <ProtectedLayout><AlumniExperiences /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/experience/:id" element={user ? <ProtectedLayout><ExperienceDetail /></ProtectedLayout> : <Navigate to="/login" />} />
      <Route path="/create-experience" element={user && user.userType === "alumni" ? <ProtectedLayout><CreateExperience /></ProtectedLayout> : <Navigate to="/dashboard" />} />
      <Route path="/alumni-directory" element={user ? <ProtectedLayout><AlumniDirectory /></ProtectedLayout> : <Navigate to="/login" />} />
    </Routes>
  );
}