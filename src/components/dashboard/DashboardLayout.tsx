"use client";

import React from "react";
import { usePathname } from "next/navigation";

import SideNavbarDashboard from "./SideNavbarDashboard";
import TeamSideNavbarDashboard from "./TeamSideNavbarDashboard";
import MobileMenu from "./soloDashboard/MobileMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route is team dashboard
  const isTeamDashboard = pathname.startsWith("/team");

  // Check if current route is admin dashboard
  const isAdminDashboard = pathname.startsWith("/admin");

  return (
    <div className={`min-h-screen flex ${isAdminDashboard ? 'admin-dashboard' : ''}`}>
      {/* Fixed Sidebar - Hide for admin routes */}
      {!isAdminDashboard && (
        <div className="hidden lg:block fixed left-0 top-0 h-screen z-30">
          {isTeamDashboard ? (
            <TeamSideNavbarDashboard />
          ) : (
            <SideNavbarDashboard />
          )}
        </div>
      )}

      {/* Mobile Menu - Hide for admin routes */}
      {!isAdminDashboard && (
        <div className="lg:hidden fixed top-20 left-4 z-40">
          <MobileMenu />
        </div>
      )}

      {/* Scrollable Main Content */}
      <main
        className={`flex-1 bg-card min-h-screen overflow-y-auto overflow-x-hidden ${
          !isAdminDashboard ? "lg:ml-64" : ""
        }`}
      >
        <div className={`w-full max-w-full ${
          !isAdminDashboard ? "" : ""
        }`}>{children}</div>
      </main>
    </div>
  );
}
