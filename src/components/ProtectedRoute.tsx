"use client";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/signIn' 
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { token, user, isInitialized } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Wait for auth to be initialized
    if (!isInitialized) return;

    // No token means not authenticated
    if (!token) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0 && user) {
      const userRole = user.role || '';
      if (!allowedRoles.includes(userRole)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [token, user, isInitialized, allowedRoles, redirectTo, router]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!token) {
    return null;
  }

  // If role restrictions exist and user doesn't have required role
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || '';
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
