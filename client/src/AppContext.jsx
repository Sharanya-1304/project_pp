import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      // Try both token keys for compatibility
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } else if (token) {
        const res = await axios.get(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Load user error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setUser(null);
  }

  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  function setUserWithToken(userData, token) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", token);
  }

  return (
    <AppContext.Provider value={{ user, setUser: updateUser, logout, loading, setUserWithToken, loadUser }}>
      {children}
    </AppContext.Provider>
  );
}