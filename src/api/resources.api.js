import { api } from "./client";

/**
 * Business API wrappers. They mirror the backend response envelopes
 * (`{ success, data }`) so callers can stay explicit about projections.
 */

const withQuery = (path, params = {}) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

export const servicesApi = {
  list: (params) => api.get(withQuery("/services", { limit: 100, all: true, ...params })),
  create: (payload) => api.post("/services", payload),
  update: (id, payload) => api.put(`/services/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/services/${encodeURIComponent(id)}`),
};

export const pricingApi = {
  list: (params) => api.get(withQuery("/pricing", { limit: 100, all: true, ...params })),
  create: (payload) => api.post("/pricing", payload),
  update: (id, payload) => api.put(`/pricing/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/pricing/${encodeURIComponent(id)}`),
};

export const featuresApi = {
  list: (params) => api.get(withQuery("/features", { limit: 100, all: true, ...params })),
  create: (payload) => api.post("/features", payload),
  update: (id, payload) => api.put(`/features/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/features/${encodeURIComponent(id)}`),
};

export const portfolioApi = {
  list: (params) => api.get(withQuery("/portfolio", { limit: 100, all: true, ...params })),
  create: (payload) => api.post("/portfolio", payload),
  update: (id, payload) => api.put(`/portfolio/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/portfolio/${encodeURIComponent(id)}`),
};

export const contactsApi = {
  list: (params) => api.get(withQuery("/contacts", { limit: 100, ...params })),
  update: (id, payload) => api.put(`/contacts/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/contacts/${encodeURIComponent(id)}`),
  submit: (payload) => api.post("/contacts", payload),
};

export const customersApi = {
  list: (params) => api.get(withQuery("/customers", { limit: 100, ...params })),
  me: () => api.get("/customers/me"),
  create: (payload) => api.post("/customers", payload),
  update: (id, payload) => api.put(`/customers/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/customers/${encodeURIComponent(id)}`),
};

export const ordersApi = {
  list: (params) => api.get(withQuery("/orders", { limit: 100, ...params })),
  create: (payload) => api.post("/orders", payload),
  update: (id, payload) => api.put(`/orders/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/orders/${encodeURIComponent(id)}`),
};

export const settingsApi = {
  get: () => api.get("/settings"),
  update: (settings) => api.put("/settings", { settings }),
};

export const dashboardApi = {
  overview: () => api.get("/dashboard/overview"),
};

export const usersApi = {
  list: (params) => api.get(withQuery("/admin/users", { limit: 100, ...params })),
  update: (id, payload) => api.patch(`/admin/users/${encodeURIComponent(id)}`, payload),
  roles: () => api.get("/admin/roles"),
};

export const publicApi = {
  services: (params) => api.get(withQuery("/services", { limit: 100, ...params })),
  pricing: (params) => api.get(withQuery("/pricing", { limit: 100, ...params })),
  features: (params) => api.get(withQuery("/features", { limit: 100, ...params })),
  portfolio: (params) => api.get(withQuery("/portfolio", { limit: 100, ...params })),
  settings: () => api.get("/settings"),
};
