import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Layouts
import WebsiteLayout from "./layouts/WebsiteLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

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

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
import Settings from "./pages/dashboard/Settings";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website */}
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
      </Route>

      {/* Authentication */}
      <Route path="login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="signup" element={<AuthLayout />}>
        <Route index element={<Signup />} />
      </Route>
      <Route path="forgot-password" element={<AuthLayout />}>
        <Route index element={<ForgotPassword />} />
      </Route>

      {/* Dashboard */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="pricing" element={<PricingManagement />} />
        <Route path="features" element={<FeaturesManagement />} />
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="contacts" element={<ContactsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="portfolio" element={<PortfolioManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all 404 */}
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
