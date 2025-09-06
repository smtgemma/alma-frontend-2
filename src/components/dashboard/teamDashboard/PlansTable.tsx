'use client';

import React, { useState } from 'react';
import { BsSearch, BsPlus, BsChevronUp, BsChevronDown } from 'react-icons/bs';

export default function PlansTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const plans = [
    {
      id: 1,
      date: 'Jun 25, 2025',
      planName: 'InnovateX',
      user: 'Brooklyn Simmons',
      status: 'Completed',
    },
    {
      id: 2,
      date: 'Jun 25, 2025',
      planName: 'InnovateX',
      user: 'Guy Hawkins',
      status: 'Pending',
    },
    {
      id: 3,
      date: 'Jun 25, 2025',
      planName: 'InnovateX',
      user: 'Jerome Bell',
      status: 'In Review',
    },
    {
      id: 4,
      date: 'Jun 25, 2025',
      planName: 'InnovateX',
      user: 'Jenny Wilson',
      status: 'Completed',
    },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'In Review':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Generated Plans</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <BsPlus className="text-xl" />
              Generate new Plan
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#475466]">
            <tr>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Date & Time
              </th>
              <th 
                className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('planName')}
              >
                <div className="flex items-center gap-1">
                  Plan Name
                  {sortField === 'planName' ? (
                    sortDirection === 'asc' ? <BsChevronUp /> : <BsChevronDown />
                  ) : (
                    <BsChevronUp className="text-gray-300" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                User
              </th>
              <th 
                className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('presentation')}
              >
                <div className="flex items-center gap-1">
                  Presentation
                  {sortField === 'presentation' ? (
                    sortDirection === 'asc' ? <BsChevronUp /> : <BsChevronDown />
                  ) : (
                    <BsChevronUp className="text-gray-300" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === 'status' ? (
                    sortDirection === 'asc' ? <BsChevronUp /> : <BsChevronDown />
                  ) : (
                    <BsChevronUp className="text-gray-300" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm md:text-base lg:text-[20px] font-medium text-white uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.planName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {plan.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="bg-gray-100 text-info px-6 py-1 rounded-[76px] text-sm hover:bg-gray-200 transition-colors border border-[#99A6B8]">
                    View
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-primary/80 underline hover:text-primary text-sm font-medium">
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
          Showing 11 out of 1,450
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
  );
}
