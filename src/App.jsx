import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Layouts
import WebsiteLayout from "./layouts/WebsiteLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Route guards
import { ProtectedRoute, GuestRoute, RoleGuard } from "./components/auth";
import { ROLES } from "./utils/permissions";

// Website Pages
import Home from "./components/website/Hero";
import About from "./pages/website/About";
import Services from "./pages/website/Services";
import ServiceDetails from "./pages/website/ServiceDetails";
import Features from "./pages/website/Features";
import Technologies from "./pages/website/Technologies";
import Pricing from "./pages/website/Pricing";
import Portfolio from "./pages/website/Portfolio";
import ProjectDetails from "./pages/website/ProjectDetails";
import Sarthi from "./pages/website/Sarthi";
import Contact from "./pages/website/Contact";
import NotFound from "./pages/website/NotFound";
import Forbidden from "./pages/website/Forbidden";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Account
import Account from "./pages/account/Account";

// Dashboard Pages
import Overview from "./pages/dashboard/Overview";
import ServicesManagement from "./pages/dashboard/ServicesManagement";
import PricingManagement from "./pages/dashboard/PricingManagement";
import FeaturesManagement from "./pages/dashboard/FeaturesManagement";
import ProfileManagement from "./pages/dashboard/ProfileManagement";
import ContactsManagement from "./pages/dashboard/ContactsManagement";
import OrdersManagement from "./pages/dashboard/OrdersManagement";
import CustomersManagement from "./pages/dashboard/CustomersManagement";
import PortfolioManagement from "./pages/dashboard/PortfolioManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import Settings from "./pages/dashboard/Settings";

function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetails />} />
        <Route path="features" element={<Features />} />
        <Route path="technologies" element={<Technologies />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetails />} />
        <Route path="sarthi" element={<Sarthi />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<NotFound />} />
        <Route path="terms" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Guest-only authentication pages */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Token-based pages: must remain reachable while signed in */}
      <Route element={<AuthLayout />}>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Authenticated customer / staff account */}
      <Route element={<ProtectedRoute />}>
        <Route element={<WebsiteLayout />}>
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      {/* Staff dashboard */}
      <Route
        element={
          <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STAFF]} />
        }
      >
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="pricing" element={<PricingManagement />} />
          <Route path="features" element={<FeaturesManagement />} />
          <Route path="portfolio" element={<PortfolioManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route element={<RoleGuard roles={[ROLES.SUPER_ADMIN]} />}>
            <Route path="users" element={<UsersManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
