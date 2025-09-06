'use client';

import React, { useState } from 'react';
import { BsSearch, BsArrowUp, BsArrowDown } from 'react-icons/bs';

interface Plan {
  id: number;
  dateTime: string;
  planName: string;
  status: 'Completed' | 'In Review' | 'Pending';
}

interface GeneratedPlanListProps {
  user: {
    id: number;
    userName: string;
    userEmail: string;
  };
  onBackToList: () => void;
}

export default function GeneratedPlanList({ user, onBackToList }: GeneratedPlanListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'dateTime' | 'planName' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Dynamic plan data based on user
  const getUserPlans = (userId: number): Plan[] => {
    const planTemplates: Record<number, Plan[]> = {
      1: [ // Jerome Bell
        { id: 1, dateTime: 'Jun 25, 2025', planName: 'TechStart Pro', status: 'Completed' as const },
        { id: 2, dateTime: 'Jun 24, 2025', planName: 'EcoSolutions', status: 'In Review' as const },
        { id: 3, dateTime: 'Jun 23, 2025', planName: 'HealthTech Plus', status: 'Pending' as const },
        { id: 4, dateTime: 'Jun 22, 2025', planName: 'FinTech Revolution', status: 'Completed' as const },
        { id: 5, dateTime: 'Jun 21, 2025', planName: 'EduTech Platform', status: 'In Review' as const },
        { id: 6, dateTime: 'Jun 20, 2025', planName: 'Green Energy Hub', status: 'Pending' as const },
        { id: 7, dateTime: 'Jun 19, 2025', planName: 'Smart City Solutions', status: 'Completed' as const },
        { id: 8, dateTime: 'Jun 18, 2025', planName: 'AI Healthcare', status: 'In Review' as const },
      ],
      2: [ // Brooklyn Simmons
        { id: 1, dateTime: 'Jun 25, 2025', planName: 'InnovateX', status: 'Completed' as const },
        { id: 2, dateTime: 'Jun 24, 2025', planName: 'InnovateX', status: 'In Review' as const },
        { id: 3, dateTime: 'Jun 23, 2025', planName: 'InnovateX', status: 'Pending' as const },
        { id: 4, dateTime: 'Jun 22, 2025', planName: 'InnovateX', status: 'Completed' as const },
        { id: 5, dateTime: 'Jun 21, 2025', planName: 'InnovateX', status: 'In Review' as const },
        { id: 6, dateTime: 'Jun 20, 2025', planName: 'InnovateX', status: 'Pending' as const },
        { id: 7, dateTime: 'Jun 19, 2025', planName: 'InnovateX', status: 'Completed' as const },
        { id: 8, dateTime: 'Jun 18, 2025', planName: 'InnovateX', status: 'In Review' as const },
        { id: 9, dateTime: 'Jun 17, 2025', planName: 'InnovateX', status: 'Pending' as const },
        { id: 10, dateTime: 'Jun 16, 2025', planName: 'InnovateX', status: 'Completed' as const },
        { id: 11, dateTime: 'Jun 15, 2025', planName: 'InnovateX', status: 'In Review' as const },
        { id: 12, dateTime: 'Jun 14, 2025', planName: 'InnovateX', status: 'Pending' as const },
      ],
      3: [ // Guy Hawkins
        { id: 1, dateTime: 'Jun 25, 2025', planName: 'London Ventures', status: 'Completed' as const },
        { id: 2, dateTime: 'Jun 24, 2025', planName: 'UK Tech Hub', status: 'In Review' as const },
        { id: 3, dateTime: 'Jun 23, 2025', planName: 'British Innovation', status: 'Pending' as const },
        { id: 4, dateTime: 'Jun 22, 2025', planName: 'London Startup', status: 'Completed' as const },
        { id: 5, dateTime: 'Jun 21, 2025', planName: 'UK Digital', status: 'In Review' as const },
      ],
      4: [ // Jenny Wilson
        { id: 1, dateTime: 'Jun 25, 2025', planName: 'Maple Leaf Tech', status: 'Completed' as const },
        { id: 2, dateTime: 'Jun 24, 2025', planName: 'Canadian Innovation', status: 'In Review' as const },
        { id: 3, dateTime: 'Jun 23, 2025', planName: 'Toronto Ventures', status: 'Pending' as const },
        { id: 4, dateTime: 'Jun 22, 2025', planName: 'Canada Tech Hub', status: 'Completed' as const },
        { id: 5, dateTime: 'Jun 21, 2025', planName: 'North Star Solutions', status: 'In Review' as const },
        { id: 6, dateTime: 'Jun 20, 2025', planName: 'Canadian Startup', status: 'Pending' as const },
        { id: 7, dateTime: 'Jun 19, 2025', planName: 'Maple Innovation', status: 'Completed' as const },
        { id: 8, dateTime: 'Jun 18, 2025', planName: 'Toronto Tech', status: 'In Review' as const },
        { id: 9, dateTime: 'Jun 17, 2025', planName: 'Canada Digital', status: 'Pending' as const },
        { id: 10, dateTime: 'Jun 16, 2025', planName: 'North Ventures', status: 'Completed' as const },
        { id: 11, dateTime: 'Jun 15, 2025', planName: 'Maple Solutions', status: 'In Review' as const },
        { id: 12, dateTime: 'Jun 14, 2025', planName: 'Canadian Hub', status: 'Pending' as const },
        { id: 13, dateTime: 'Jun 13, 2025', planName: 'Toronto Innovation', status: 'Completed' as const },
        { id: 14, dateTime: 'Jun 12, 2025', planName: 'Canada Ventures', status: 'In Review' as const },
        { id: 15, dateTime: 'Jun 11, 2025', planName: 'Maple Tech', status: 'Pending' as const },
      ]
    };

    return planTemplates[userId] || [];
  };

  const plans: Plan[] = getUserPlans(user.id);

  const handleSort = (field: 'dateTime' | 'planName' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: 'dateTime' | 'planName' | 'status') => {
    if (sortField !== field) {
      return <BsArrowUp className="text-gray-400 text-xs" />;
    }
    return sortDirection === 'asc' ? 
      <BsArrowUp className="text-gray-600 text-xs" /> : 
      <BsArrowDown className="text-gray-600 text-xs" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Review':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.userName}'s generated plan list
        </h1>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          {/* Back Button */}
          <button
            onClick={onBackToList}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to User List
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#475466] text-white">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('dateTime')}
                >
                  <div className="flex items-center gap-2">
                    Date & Time
                    {getSortIcon('dateTime')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('planName')}
                >
                  <div className="flex items-center gap-2">
                    Plan Name
                    {getSortIcon('planName')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Presentation
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.dateTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.planName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-primary/80 text-sm font-medium underline">
                      View plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredPlans.length} out of {plans.length}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              &lt; Previous
            </button>
            <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">2</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">3</button>
            <span className="px-2 text-gray-600">...</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">16</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
