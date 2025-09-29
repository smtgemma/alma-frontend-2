"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { navigateToProtectedRoute } from "@/utils/authUtils";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  fallbackPath?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * A wrapper component that ensures authentication state is properly synchronized
 * before navigating to protected routes. Prevents middleware redirect issues.
 */
const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  href,
  children,
  fallbackPath = "/signIn",
  className,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Use our secure navigation utility
    navigateToProtectedRoute(router, href, fallbackPath);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      role="link"
      tabIndex={0}
    >
      {children}
    </a>
  );
};

export default ProtectedLink;