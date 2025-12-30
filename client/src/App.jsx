import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Badges from "./pages/Badges";
import Puzzles from "./pages/Puzzles";
import Settings from "./pages/Settings";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AppContext } from "./AppContext";

export default function App() {
  const { user } = useContext(AppContext);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Navbar />
        <div className="ml-64 p-6 w-full">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/puzzles" element={<Puzzles />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}