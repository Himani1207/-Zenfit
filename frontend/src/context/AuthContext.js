import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure Axios Defaults
export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zenfitToken') || null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('zenfitTheme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zenfitTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Toast Notification Helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Remove Toast manually
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('zenfitToken');
    sessionStorage.removeItem('zenfitToken');
    addToast('Logged out successfully.', 'info');
  }, [addToast]);

  // Configure Axios Request Interceptor
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Persistent Login Verify on Mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/verify');
          setUser(res.data.user);
        } catch (error) {
          console.error('Session verification failed:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token, logout]);

  const login = async (email, password, rememberMe) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data;

      setToken(userToken);
      setUser(userData);

      if (rememberMe) {
        localStorage.setItem('zenfitToken', userToken);
      } else {
        sessionStorage.setItem('zenfitToken', userToken);
      }

      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      await api.post('/auth/signup', { name, email, password });
      addToast('Registration successful! You can now log in.', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };



  const updateProfileMetrics = async (metrics) => {
    try {
      const res = await api.put('/users/profile', metrics);
      setUser(res.data.user);
      addToast('Profile parameters updated!', 'success');
      return { success: true };
    } catch (error) {
      addToast('Failed to update metrics.', 'error');
      return { success: false };
    }
  };

  const toggleChecklist = async (item) => {
    try {
      const res = await api.post('/users/checklist/toggle', { item });
      const { checklist, weeklyCalendar, streak, level, xp, xpToNextLevel, xpGained, leveledUp, unlockedBadges } = res.data;
      
      setUser((prev) => ({
        ...prev,
        checklist,
        weeklyCalendar,
        streak,
        level,
        xp,
        xpToNextLevel
      }));

      if (xpGained > 0) {
        addToast(`Checklist updated! +${xpGained} XP`, 'success');
      }
      if (leveledUp) {
        addToast(`🎉 LEVEL UP! You reached Level ${level}!`, 'success');
      }
      if (unlockedBadges && unlockedBadges.length > 0) {
        unlockedBadges.forEach(badge => {
          addToast(`🏆 Achievement Unlocked: ${badge}!`, 'success');
        });
      }
    } catch (error) {
      addToast('Failed to update checklist.', 'error');
    }
  };

  const logWater = async (amount) => {
    try {
      const res = await api.post('/users/water/log', { amount });
      const { waterIntake, checklist, streak, level, xp, xpGained, leveledUp, unlockedBadges } = res.data;
      
      setUser((prev) => ({
        ...prev,
        waterIntake,
        checklist,
        streak,
        level,
        xp
      }));

      addToast(`Logged ${amount}ml water! +${xpGained} XP`, 'success');
      if (leveledUp) {
        addToast(`🎉 LEVEL UP! You reached Level ${level}!`, 'success');
      }
      if (unlockedBadges && unlockedBadges.length > 0) {
        unlockedBadges.forEach(badge => {
          addToast(`🏆 Achievement Unlocked: ${badge}!`, 'success');
        });
      }
    } catch (error) {
      addToast('Failed to log water.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        toasts,
        addToast,
        removeToast,
        login,
        signup,
        logout,
        updateProfileMetrics,
        toggleChecklist,
        logWater,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
