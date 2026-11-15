import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navigation/Navbar";
import AnnouncementBar from "../components/navigation/AnnouncementBar";
import Footer from "../components/navigation/Footer";

export default function WebsiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-espresso text-light-text selection:bg-champagne selection:text-espresso">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{<Outlet />}</main>
      <Footer />
    </div>
  );
}
