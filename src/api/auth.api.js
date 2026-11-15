import { api } from "./client";

/** Auth endpoint wrappers. All calls rely on HttpOnly cookies, never tokens. */
export const authApi = {
  me: () => api.get("/auth/me"),
  login: (credentials) => api.post("/auth/login", credentials),
  register: (payload) => api.post("/auth/register", payload),
  refresh: () => api.post("/auth/refresh", undefined, { skipAuthRefresh: true }),
  logout: () => api.post("/auth/logout", undefined, { skipAuthRefresh: true }),
  logoutAll: () => api.post("/auth/logout-all"),
  updateProfile: (payload) => api.patch("/auth/me", payload),
  changePassword: (payload) => api.post("/auth/change-password", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (payload) => api.post("/auth/resend-verification", payload),
  sessions: () => api.get("/auth/sessions"),
  revokeSession: (id) => api.delete(`/auth/sessions/${encodeURIComponent(id)}`),
};

export default authApi;
