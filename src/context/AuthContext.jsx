import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("growthverse-demo-user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem("growthverse-demo-user", JSON.stringify(user));
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("growthverse-demo-user");
    }
  }, [user]);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const signup = useCallback((userData) => {
    setUser(userData);
  }, []);

  // IMPORTANT: This is frontend-only demonstration authentication.
  // No real authentication, no backend, no secure token.
  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    isDemo: true,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
