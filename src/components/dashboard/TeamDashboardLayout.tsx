'use client';

import React from 'react';
import TeamSideNavbarDashboard from './TeamSideNavbarDashboard';

interface TeamDashboardLayoutProps {
  children: React.ReactNode;
}

export default function TeamDashboardLayout({ children }: TeamDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <TeamSideNavbarDashboard />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
