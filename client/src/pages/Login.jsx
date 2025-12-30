import { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login() {
  const { setUserWithToken } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      if (isSignUp && (!name || !roll)) {
        setError("All fields are required for sign up");
        setLoading(false);
        return;
      }

      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignUp 
        ? { name, email, roll, password }
        : { email, password };

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      if (res.data.token && res.data.user) {
        setUserWithToken(res.data.user, res.data.token);
      } else if (res.data.user) {
        setUserWithToken(res.data.user, "");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Code Platform</h1>
            <p className="text-gray-600">{isSignUp ? "Create an account" : "Welcome back"}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value.toUpperCase())}
                    placeholder="Enter your roll number"
                    pattern="[0-9]{5}[A-Z]{1}[0-9]{4}"
                    title="Roll number must be in format: xxxxxAxxxx (e.g., 23321A0584)"
                    required={isSignUp}
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 5 digits, 1 letter, 4 digits (e.g., 23321A0584)</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              {loading ? (isSignUp ? "Creating Account..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        <p className="text-center text-white mt-8 text-sm">
          © 2025 Coding Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}