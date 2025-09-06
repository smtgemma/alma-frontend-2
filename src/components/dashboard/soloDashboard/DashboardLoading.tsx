'use client';

import React from 'react';

interface DashboardLoadingProps {
  type?: 'summary' | 'table' | 'profile' | 'plans';
  title?: string;
  message?: string;
}

export default function DashboardLoading({ 
  type = 'summary', 
  title, 
  message 
}: DashboardLoadingProps) {
  
  const getLoadingConfig = () => {
    switch (type) {
      case 'summary':
        return {
          title: title || 'Loading Analytics',
          message: message || 'Calculating your business metrics...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          )
        };
      case 'table':
        return {
          title: title || 'Loading Plans',
          message: message || 'Fetching your business plans...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'profile':
        return {
          title: title || 'Loading Profile',
          message: message || 'Retrieving your account information...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'plans':
        return {
          title: title || 'Loading Plans',
          message: message || 'Preparing your business plans...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          title: title || 'Loading',
          message: message || 'Please wait...',
          icon: (
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const config = getLoadingConfig();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-white rounded-lg border border-gray-100">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center animate-pulse">
          <div className="animate-spin">
            {config.icon}
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{config.title}</h3>
        <p className="text-gray-600 text-sm">{config.message}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>

      {/* Loading Steps */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
}
