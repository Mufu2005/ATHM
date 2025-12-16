import { createContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("athm_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("athm_token", data.token);
      localStorage.setItem("athm_user", JSON.stringify(data));
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("athm_token", data.token);
      localStorage.setItem("athm_user", JSON.stringify(data));
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("athm_token");
    localStorage.removeItem("athm_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
