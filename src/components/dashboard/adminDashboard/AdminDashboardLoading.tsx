'use client';

import React from 'react';
import DashboardLoading from '../soloDashboard/DashboardLoading';

interface AdminDashboardLoadingProps {
  type?: 'summary' | 'table' | 'users' | 'plans' | 'analytics';
  title?: string;
  message?: string;
}

export default function AdminDashboardLoading({ 
  type = 'summary', 
  title, 
  message 
}: AdminDashboardLoadingProps) {
  
  const getAdminLoadingConfig = () => {
    switch (type) {
      case 'summary':
        return {
          title: title || 'Loading Admin Dashboard',
          message: message || 'Gathering analytics and user statistics...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          )
        };
      case 'table':
        return {
          title: title || 'Loading Data Table',
          message: message || 'Fetching records and user data...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'users':
        return {
          title: title || 'Loading Users',
          message: message || 'Retrieving user information and analytics...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'plans':
        return {
          title: title || 'Loading Plans',
          message: message || 'Fetching business plans and review data...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'analytics':
        return {
          title: title || 'Loading Analytics',
          message: message || 'Calculating metrics and generating reports...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          )
        };
      default:
        return {
          title: title || 'Loading Admin Panel',
          message: message || 'Please wait while we load the admin interface...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const config = getAdminLoadingConfig();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Admin-specific loading animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Admin icon in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            {config.icon}
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{config.title}</h3>
        <p className="text-gray-600 max-w-md">{config.message}</p>
      </div>

      {/* Admin-specific progress indicators */}
      <div className="flex space-x-2 mb-6">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Admin loading steps */}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Loading admin interface</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Fetching user data</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span>Preparing analytics</span>
        </div>
      </div>
    </div>
  );
}
