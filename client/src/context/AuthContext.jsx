import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // ✅ SAFE USER PARSE (FIXED)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');

      // handle empty / invalid values
      if (!stored || stored === "undefined") return null;

      return JSON.parse(stored);
    } catch (err) {
      console.error("Invalid user in localStorage:", err);
      localStorage.removeItem('user'); // clean bad data
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ✅ LOGIN
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', data.token || '');

    // ✅ SAFE STORE
    localStorage.setItem('user', JSON.stringify(data.user || null));

    setUser(data.user || null);
    return data.user;
  };

  // ✅ SIGNUP
  const signup = async (name, email, password, role) => {
    const { data } = await api.post('/auth/signup', { name, email, password, role });

    localStorage.setItem('token', data.token || '');

    // ✅ SAFE STORE
    localStorage.setItem('user', JSON.stringify(data.user || null));

    setUser(data.user || null);
    return data.user;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ CUSTOM HOOK
export const useAuth = () => useContext(AuthContext);