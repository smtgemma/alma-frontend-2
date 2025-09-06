"use client";
import React from "react";
import AdminSideNavbarDashboard from "./AdminSideNavbarDashboard";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex h-screen bg-card overflow-hidden admin-dashboard">
      {/* Sidebar */}
      <AdminSideNavbarDashboard />

      {/* Main Content */}
      <div className="flex-1 overflow-auto overflow-x-hidden">
        <main className="w-full max-w-full">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
