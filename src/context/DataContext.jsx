/**
 * Dashboard data provider backed by the authenticated GrowthVerse API.
 *
 * This provider only loads data for staff roles. Customer-facing account data is
 * fetched directly by the account page. No demonstration or localStorage data is
 * used for business records.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { ApiError } from "../api/client";
import {
  contactsApi,
  customersApi,
  dashboardApi,
  featuresApi,
  ordersApi,
  portfolioApi,
  pricingApi,
  servicesApi,
  settingsApi,
  usersApi,
} from "../api/resources.api";

const EMPTY_COLLECTIONS = Object.freeze({
  services: [],
  pricing: [],
  features: [],
  portfolio: [],
  contacts: [],
  customers: [],
  orders: [],
  users: [],
  settings: {},
  dashboard: null,
});

const loaders = {
  services: async () => (await servicesApi.list()).data.services,
  pricing: async () => (await pricingApi.list()).data.plans,
  features: async () => (await featuresApi.list()).data.features,
  portfolio: async () => (await portfolioApi.list()).data.projects,
  contacts: async () => (await contactsApi.list()).data.enquiries,
  customers: async () => (await customersApi.list()).data.customers,
  orders: async () => (await ordersApi.list()).data.orders,
  users: async () => (await usersApi.list()).data.users,
  settings: async () => (await settingsApi.get()).data || {},
  dashboard: async () => (await dashboardApi.overview()).data,
};

const writers = {
  services: {
    create: servicesApi.create,
    update: servicesApi.update,
    remove: servicesApi.remove,
  },
  pricing: {
    create: pricingApi.create,
    update: pricingApi.update,
    remove: pricingApi.remove,
  },
  features: {
    create: featuresApi.create,
    update: featuresApi.update,
    remove: featuresApi.remove,
  },
  portfolio: {
    create: portfolioApi.create,
    update: portfolioApi.update,
    remove: portfolioApi.remove,
  },
  contacts: {
    create: null,
    update: contactsApi.update,
    remove: contactsApi.remove,
  },
  customers: {
    create: customersApi.create,
    update: customersApi.update,
    remove: customersApi.remove,
  },
  orders: {
    create: ordersApi.create,
    update: ordersApi.update,
    remove: ordersApi.remove,
  },
};

const singular = {
  services: "service",
  pricing: "plan",
  features: "feature",
  portfolio: "project",
  contacts: "enquiry",
  customers: "customer",
  orders: "order",
  users: "user",
};

const DataContext = createContext(null);

function messageFor(error) {
  if (error instanceof ApiError) return error.message;
  return "Unable to load data. Please try again.";
}

export const DataProvider = ({ children }) => {
  const { isAuthenticated, isStaff, isSuperAdmin } = useAuth();
  const [collections, setCollections] = useState(EMPTY_COLLECTIONS);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const setResource = useCallback((name, value) => {
    setCollections((previous) => ({ ...previous, [name]: value }));
  }, []);

  const refreshResource = useCallback(
    async (name) => {
      const loader = loaders[name];
      if (!loader) return null;
      setLoading((previous) => ({ ...previous, [name]: true }));
      setErrors((previous) => ({ ...previous, [name]: null }));
      try {
        const value = await loader();
        setResource(name, value);
        return value;
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 403)) {
          setErrors((previous) => ({ ...previous, [name]: messageFor(error) }));
        }
        throw error;
      } finally {
        setLoading((previous) => ({ ...previous, [name]: false }));
      }
    },
    [setResource]
  );

  const refreshAll = useCallback(async () => {
    const names = [
      "services",
      "pricing",
      "features",
      "portfolio",
      "contacts",
      "customers",
      "orders",
      "settings",
      "dashboard",
      ...(isSuperAdmin ? ["users"] : []),
    ];
    const results = await Promise.allSettled(names.map((name) => refreshResource(name)));
    return results;
  }, [isSuperAdmin, refreshResource]);

  useEffect(() => {
    let cancelled = false;
    if (isAuthenticated && isStaff) {
      refreshAll().catch(() => {});
    } else if (!isAuthenticated) {
      if (!cancelled) {
        setCollections(EMPTY_COLLECTIONS);
        setLoading({});
        setErrors({});
      }
    }
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isStaff, refreshAll]);

  const createEntity = useCallback(
    async (resource, payload) => {
      const writer = writers[resource];
      if (!writer || !writer.create) {
        throw new Error(`Creating ${resource} is not supported`);
      }
      const response = await writer.create(payload);
      const created = response?.data?.[singular[resource]] || response?.data || null;
      await refreshResource(resource).catch(() => {});
      if (resource === "orders") await refreshResource("dashboard").catch(() => {});
      return created;
    },
    [refreshResource]
  );

  const updateEntity = useCallback(
    async (resource, id, payload) => {
      const writer = writers[resource];
      if (!writer || !writer.update) {
        throw new Error(`Updating ${resource} is not supported`);
      }
      const response = await writer.update(id, payload);
      const updated = response?.data?.[singular[resource]] || response?.data || null;
      await refreshResource(resource).catch(() => {});
      if (resource === "orders") await refreshResource("dashboard").catch(() => {});
      return updated;
    },
    [refreshResource]
  );

  const deleteEntity = useCallback(
    async (resource, id) => {
      const writer = writers[resource];
      if (!writer || !writer.remove) {
        throw new Error(`Deleting ${resource} is not supported`);
      }
      await writer.remove(id);
      await refreshResource(resource).catch(() => {});
      if (resource === "orders") await refreshResource("dashboard").catch(() => {});
    },
    [refreshResource]
  );

  const updateSettings = useCallback(async (settings) => {
    const response = await settingsApi.update(settings);
    await refreshResource("settings").catch(() => {});
    return response;
  }, [refreshResource]);

  const updateUser = useCallback(
    async (id, payload) => {
      const response = await usersApi.update(id, payload);
      await refreshResource("users").catch(() => {});
      return response?.data?.user || null;
    },
    [refreshResource]
  );

  const value = useMemo(
    () => ({
      services: collections.services,
      pricing: collections.pricing,
      features: collections.features,
      portfolio: collections.portfolio,
      contacts: collections.contacts,
      customers: collections.customers,
      orders: collections.orders,
      users: collections.users,
      settings: collections.settings,
      dashboard: collections.dashboard,
      loading,
      errors,
      isLoading: Object.values(loading).some(Boolean),
      refreshResource,
      refreshAll,
      createEntity,
      updateEntity,
      deleteEntity,
      updateSettings,
      updateUser,
    }),
    [
      collections,
      loading,
      errors,
      refreshResource,
      refreshAll,
      createEntity,
      updateEntity,
      deleteEntity,
      updateSettings,
      updateUser,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};

export default DataContext;
