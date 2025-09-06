'use client';

import React, { useState } from 'react';
import { BsBell } from 'react-icons/bs';

export default function NotificationsList() {
  const [currentPage, setCurrentPage] = useState(1);

  const notifications = [
    {
      id: 1,
      title: 'Plan Generated',
      description: 'A new plan has been generated successfully',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 2,
      title: 'System Updates',
      description: 'System maintenance completed successfully',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 3,
      title: 'Expert Reviews',
      description: 'Expert review completed for your plan',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 4,
      title: 'Alerts & Warning',
      description: 'Important system alert notification',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 5,
      title: 'New Sub-Admin Added',
      description: 'A new sub-admin has been added to your team',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 6,
      title: 'Sub-Admin Limit Reached',
      description: 'You have reached the maximum number of sub-admins',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 7,
      title: 'Sub-Admin Invitation Sent',
      description: 'Invitation sent successfully to new sub-admin',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 8,
      title: 'Sub-Admin Removed',
      description: 'A sub-admin has been removed from your team',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 9,
      title: 'Pending Sub-Admin Invitation',
      description: 'You have pending sub-admin invitations',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
    {
      id: 10,
      title: 'Jerome Bell Generated a Plan',
      description: 'Jerome Bell has generated a new plan',
      timestamp: 'Jun 25, 2025 08:20 AM',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
      </div>

      {/* Notifications List */}
      <div className="p-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BsBell className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {notification.description}
                </p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">
                {notification.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing 11 - out of 1,450
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">2</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">3</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">5</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">10</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
