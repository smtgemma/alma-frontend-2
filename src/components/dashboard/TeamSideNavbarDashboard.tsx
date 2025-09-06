'use client';

import Image from 'next/image';
import { BsCalendar2Check, BsBell, BsCreditCard } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { GrPower } from 'react-icons/gr';
import { HiUsers } from 'react-icons/hi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { LogoutPopup } from './LogoutPopup';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserProfileQuery } from '@/redux/api/auth/authApi';
import { store } from '@/redux/store';
import { logout } from '@/redux/features/user/userSlice';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export default function TeamSideNavbarDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: ReturnType<typeof store.getState>) => state.user);

  // Get updated profile data
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token, // Only fetch if user is logged in
  });

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLogoutSelected, setIsLogoutSelected] = useState(false);
  const [currentSelectedPath, setCurrentSelectedPath] = useState(pathname);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Also try clearing with different path options to ensure complete removal
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });

    // Clear Redux state
    dispatch(logout());

    // Show success message
    toast.success('Logged out successfully');

    // Redirect to home page
    router.push('/');

    // Close modal
    setIsLogoutOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutSelected(true);
    setCurrentSelectedPath(''); // Clear the current path selection
    setIsLogoutOpen(true);
  };

  // Reset logout selection when other menu items are clicked
  const handleMenuClick = (path: string) => {
    setIsLogoutSelected(false);
    setCurrentSelectedPath(path);
  };

  // Get current profile image
  const getProfileImage = () => {
    if (profileData?.data?.image) {
      return profileData.data.image;
    }
    if (user?.image) {
      return user.image;
    }
    return "/images/profile.jpg";
  };

  // Get user display name
  const getDisplayName = () => {
    if (profileData?.data) {
      return `${profileData.data.firstName} ${profileData.data.lastName}`;
    }
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'User';
  };

  // Get user email
  const getDisplayEmail = () => {
    if (profileData?.data?.email) {
      return profileData.data.email;
    }
    if (user?.email) {
      return user.email;
    }
    return 'user@example.com';
  };

  return (
    <>
    
      <aside className="w-64 bg-white border-r border-r-[#99A6B8] h-full flex flex-col">
        {/* Profile Section */}
        <div className="flex flex-col px-8 pt-14 pb-4">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
            <Image
              src={getProfileImage()}
              alt="User"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className='flex gap-1 text-start items-center mt-2'>
            <h2 className="text-xl font-medium">{getDisplayName()}</h2>
            {profileData?.data?.isVerified && (
              <img src="/images/p.png" alt="Verified" />
            )}
          </div>
          <div>
            <p className="text-[1rem] text-info font-normal text-start">{getDisplayEmail()}</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 border-t border-t-[#99A6B8] pt-4 px-4">
          <div className='space-y-3'>
            <Link href="/dashboard" className="block">
              <button
                onClick={() => handleMenuClick('/dashboard')}
                className={clsx(
                  'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium cursor-pointer',
                  currentSelectedPath === '/dashboard' ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
                )}
              >
                <BsCalendar2Check className={currentSelectedPath === '/dashboard' ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl'} /> Generated Plans
              </button>
            </Link>

            <Link href="/dashboard/profile" className="block">
              <button
                onClick={() => handleMenuClick('/dashboard/profile')}
                className={clsx(
                  'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium text-accent cursor-pointer',
                  currentSelectedPath === '/dashboard/profile' ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
                )}
              >
                <CgProfile className={currentSelectedPath === '/dashboard/profile' ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl'} /> Profile
              </button>
            </Link>

            <Link href="/dashboard/manage-users" className="block">
              <button
                onClick={() => handleMenuClick('/dashboard/manage-users')}
                className={clsx(
                  'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium text-accent cursor-pointer',
                  currentSelectedPath === '/dashboard/manage-users' ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
                )}
              >
                <HiUsers className={currentSelectedPath === '/dashboard/manage-users' ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl'} /> Manage Users
              </button>
            </Link>

            <Link href="/dashboard/subscription-plan" className="block">
              <button
                onClick={() => handleMenuClick('/dashboard/subscription-plan')}
                className={clsx(
                  'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium text-accent cursor-pointer',
                  currentSelectedPath === '/dashboard/subscription-plan' ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
                )}
              >
                <BsCreditCard className={currentSelectedPath === '/dashboard/subscription-plan' ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl'} /> Subscription plan
              </button>
            </Link>

            <Link href="/dashboard/notifications" className="block">
              <button
                onClick={() => handleMenuClick('/dashboard/notifications')}
                className={clsx(
                  'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium text-accent cursor-pointer',
                  currentSelectedPath === '/dashboard/notifications' ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
                )}
              >
                <BsBell className={currentSelectedPath === '/dashboard/notifications' ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl'} /> Notification
              </button>
            </Link>
          </div>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogoutClick}
            className={clsx(
              'w-full flex items-center gap-3 text-left px-4 py-2 rounded-md text-[1rem] font-medium text-accent cursor-pointer',
              isLogoutSelected ? 'bg-primary text-white' : ' bg-[#E9E9E9] hover:bg-primary hover:text-white'
            )}
          >
            <GrPower className={isLogoutSelected ? 'text-white text-2xl' : 'text-[#99A6B8] text-2xl hover:text-white '} /> Log Out
          </button>
        </div>
      </aside>

      {/* 🔒 Logout Confirmation Modal */}
      <LogoutPopup
        isOpen={isLogoutOpen}
        onClose={() => {
          setIsLogoutOpen(false);
          setIsLogoutSelected(false);
        }}
        onConfirm={handleLogout}
      />
    </>
  );
}
