import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import authApi from "../api/auth.api";
import { ApiError } from "../api/client";
import {
  hasPermission as roleHasPermission,
  isAdminRole,
  isStaffRole,
  isSuperAdminRole,
  roleHome,
} from "../utils/permissions";

const AuthContext = createContext(null);

const STATUS = Object.freeze({
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  ANONYMOUS: "anonymous",
});

/**
 * Authentication provider.
 *
 * The session is cookie-based. On mount we ask the backend who we are; if the
 * short-lived access cookie has expired the API client transparently rotates
 * the refresh token before we land on the anonymous state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [authError, setAuthError] = useState(null);
  const mounted = useRef(true);

  const clearSession = useCallback(() => {
    if (!mounted.current) return;
    setUser(null);
    setStatus(STATUS.ANONYMOUS);
  }, []);

  const applyUser = useCallback((nextUser) => {
    if (!mounted.current) return;
    if (nextUser) {
      setUser(nextUser);
      setStatus(STATUS.AUTHENTICATED);
    } else {
      setUser(null);
      setStatus(STATUS.ANONYMOUS);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      applyUser(response?.data?.user || null);
      setAuthError(null);
      return response?.data?.user || null;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearSession();
      }
      throw error;
    }
  }, [applyUser, clearSession]);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const response = await authApi.me();
        if (cancelled) return;
        applyUser(response?.data?.user || null);
        setAuthError(null);
      } catch (error) {
        if (cancelled) return;
        // A 401 after the client's refresh attempt means "not signed in".
        // A network failure also leaves the app usable as anonymous.
        applyUser(null);
        if (!(error instanceof ApiError) || (error.status !== 401 && error.status !== 403)) {
          setAuthError("Unable to reach the authentication service. You are browsing as a guest.");
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      mounted.current = false;
    };
  }, [applyUser]);

  useEffect(() => {
    const handleExpired = () => clearSession();
    window.addEventListener("growthverse:auth-expired", handleExpired);
    return () => window.removeEventListener("growthverse:auth-expired", handleExpired);
  }, [clearSession]);

  const login = useCallback(
    async (credentials) => {
      const response = await authApi.login(credentials);
      const nextUser = response?.data?.user || null;
      applyUser(nextUser);
      setAuthError(null);
      return nextUser;
    },
    [applyUser]
  );

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logging out locally must always succeed from the user's perspective.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateProfile = useCallback(
    async (payload) => {
      const response = await authApi.updateProfile(payload);
      applyUser(response?.data?.user || null);
      return response?.data?.user || null;
    },
    [applyUser]
  );

  const changePassword = useCallback(
    async (payload) => {
      const response = await authApi.changePassword(payload);
      await refreshUser().catch(() => {});
      return response;
    },
    [refreshUser]
  );

  const value = useMemo(
    () => ({
      user,
      status,
      isLoading: status === STATUS.LOADING,
      isAuthenticated: status === STATUS.AUTHENTICATED && Boolean(user),
      authError,
      role: user?.role || null,
      isStaff: isStaffRole(user?.role),
      isAdmin: isAdminRole(user?.role),
      isSuperAdmin: isSuperAdminRole(user?.role),
      homePath: roleHome(user?.role),
      hasRole: (...roles) => Boolean(user?.role && roles.flat().includes(user.role)),
      hasPermission: (permission) => roleHasPermission(user?.role, permission),
      login,
      register,
      logout,
      logoutAll,
      refreshUser,
      updateProfile,
      changePassword,
      forgotPassword: (payload) => authApi.forgotPassword(payload),
      resetPassword: (payload) => authApi.resetPassword(payload),
      verifyEmail: (token) => authApi.verifyEmail(token),
      resendVerification: (payload) => authApi.resendVerification(payload),
      listSessions: async () => {
        const response = await authApi.sessions();
        return response?.data?.sessions || [];
      },
      revokeSession: async (sessionId) => {
        const response = await authApi.revokeSession(sessionId);
        return response;
      },
    }),
    [
      user,
      status,
      authError,
      login,
      register,
      logout,
      logoutAll,
      refreshUser,
      updateProfile,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { STATUS as AUTH_STATUS };
export default AuthContext;
