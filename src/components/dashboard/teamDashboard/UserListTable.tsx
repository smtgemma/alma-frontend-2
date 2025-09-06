'use client';

import React, { useState } from 'react';
import UserList from './UserList';
import UserProfile from './UserProfile';
import RemoveUserModal from './RemoveUserModal';

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

export default function UserListTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [users, setUsers] = useState<User[]>([
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
  ]);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
  };

  const handleRemoveUser = () => {
    setShowRemoveModal(true);
  };

  const confirmRemoveUser = async () => {
    if (!selectedUser) return;
    
    setIsRemoving(true);
    try {
      // TODO: Implement API call to remove user
      console.log('Removing user:', selectedUser.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove user from the list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      
      setShowRemoveModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error removing user:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const closeModal = () => {
    setShowRemoveModal(false);
  };

  const goBackToList = () => {
    setSelectedUser(null);
  };

  // User Profile View
  if (selectedUser) {
    return (
      <>
        <UserProfile
          user={selectedUser}
          onRemoveUser={handleRemoveUser}
          onBackToList={goBackToList}
        />
        <RemoveUserModal
          isOpen={showRemoveModal}
          isRemoving={isRemoving}
          onConfirm={confirmRemoveUser}
          onCancel={closeModal}
        />
      </>
    );
  }

  // User List View
  // return <UserList user={users}  />;
}
