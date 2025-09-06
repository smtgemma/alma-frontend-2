'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TeamDashboardHeader from '@/components/dashboard/teamDashboard/TeamDashboardHeader';
import GeneratedPlanList from '@/components/dashboard/teamDashboard/GeneratedPlanList';

interface User {
  id: number;
  userName: string;
  userEmail: string;
  plansGenerated: string;
  userNo: string;
  location: string;
  joinDate: string;
  profileImage: string;
}

export default function UserPlansPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in a real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: 1,
      userName: 'Jerome Bell',
      userEmail: 'jeromebel007@gmail.com',
      plansGenerated: '08',
      userNo: '01',
      location: 'Roma, Italia',
      joinDate: '25 January, 2025',
      profileImage: '/images/profile.jpg'
    },
    {
      id: 2,
      userName: 'Brooklyn Simmons',
      userEmail: 'brooklyn.simmons@gmail.com',
      plansGenerated: '12',
      userNo: '02',
      location: 'New York, USA',
      joinDate: '15 March, 2025',
      profileImage: '/images/profile.jpg'
    },
    {
      id: 3,
      userName: 'Guy Hawkins',
      userEmail: 'guy.hawkins@gmail.com',
      plansGenerated: '05',
      userNo: '03',
      location: 'London, UK',
      joinDate: '10 February, 2025',
      profileImage: '/images/profile.jpg'
    },
    {
      id: 4,
      userName: 'Jenny Wilson',
      userEmail: 'jenny.wilson@gmail.com',
      plansGenerated: '15',
      userNo: '04',
      location: 'Toronto, Canada',
      joinDate: '5 April, 2025',
      profileImage: '/images/profile.jpg'
    },
  ];

  useEffect(() => {
    const userId = parseInt(params.userId as string);
    const foundUser = mockUsers.find(u => u.id === userId);
    
    if (foundUser) {
      setUser(foundUser);
    } else {
      // User not found, redirect to user list
      router.push('/dashboard/manage-users');
    }
    setLoading(false);
  }, [params.userId, router]);

  const goBackToList = () => {
    router.push('/dashboard/manage-users');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <TeamDashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading user plans...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <TeamDashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamDashboardHeader />
      <GeneratedPlanList
        user={user}
        onBackToList={goBackToList}
      />
    </div>
  );
}
