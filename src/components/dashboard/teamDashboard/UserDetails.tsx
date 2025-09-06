'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BsArrowLeft, BsCalendar2Check, BsEnvelope, BsPerson } from 'react-icons/bs';

interface UserDetailsProps {
  userId: string;
}

export default function UserDetails({ userId }: UserDetailsProps) {
  const router = useRouter();

  // Mock user data - in real app, fetch based on userId
  const user = {
    id: userId,
    name: 'Jerome Bell',
    email: 'jeromebel007@gmail.com',
    plansGenerated: '08',
    joinDate: 'January 15, 2024',
    status: 'Active',
    role: 'Team Member',
  };

  const userPlans = [
    {
      id: 1,
      planName: 'InnovateX',
      date: 'Jun 25, 2025',
      status: 'Completed',
    },
    {
      id: 2,
      planName: 'TechStart',
      date: 'Jun 20, 2025',
      status: 'In Review',
    },
    {
      id: 3,
      planName: 'BusinessPro',
      date: 'Jun 15, 2025',
      status: 'Pending',
    },
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BsArrowLeft />
            Back to User List
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BsPerson className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              {user.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <BsEnvelope className="text-gray-400 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BsCalendar2Check className="text-gray-400 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Plans Generated</p>
              <p className="font-medium">{user.plansGenerated}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BsCalendar2Check className="text-gray-400 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Join Date</p>
              <p className="font-medium">{user.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Plans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Plans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.planName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-primary/80 text-sm font-medium">
                      View plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
