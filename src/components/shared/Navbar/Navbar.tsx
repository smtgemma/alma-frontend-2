"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/features/user/userSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery } from "@/redux/api/auth/authApi";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { LogoutPopup } from "@/components/dashboard/LogoutPopup";
import Cookies from "js-cookie";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state: any) => state.user);
  // console.log("user", user);
  // console.log("token", token);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get updated profile data
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token, // Only fetch if user is logged in
  });
  // console.log("role", user?.role || "No user");

  // Check for user data in localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const tokenData = localStorage.getItem("token");

    // console.log("🔍 Navbar localStorage Debug:");
    // console.log("userData from localStorage:", userData);
    // console.log("tokenData from localStorage:", tokenData);
    // console.log("Current Redux user:", user);
    // console.log("Current Redux token:", token);

    if (userData && !user) {
      // If user data exists in localStorage but not in Redux, restore it
      const parsedUser = JSON.parse(userData);
      // console.log("🔧 Parsed user from localStorage:", parsedUser);
      // console.log("🔧 Using token:", parsedUser?.accessToken || tokenData);

      // Always use accessToken from user object if available
      const tokenToUse = parsedUser?.accessToken || tokenData;

      if (tokenToUse) {
        // console.log("🔧 Restoring user and token to Redux store");
        dispatch({
          type: "user/setUser",
          payload: {
            user: parsedUser,
            token: tokenToUse,
          },
        });
      }
    }
  }, [dispatch, user]);

  // Additional check: if we have user but no token, try to restore token
  useEffect(() => {
    if (user && !token) {
      // console.log("🔄 User exists but no token, trying to restore...");

      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.accessToken) {
            // console.log("🔧 Restoring missing token from localStorage");
            dispatch({
              type: "user/setUser",
              payload: {
                user: user,
                token: parsedUser.accessToken,
              },
            });
          }
        } catch (error) {
          // console.error("Error restoring token:", error);
        }
      }
    }
  }, [user, token, dispatch]);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("user");

    // Also try clearing with different path options to ensure complete removal
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    // Clear Redux state
    dispatch(logout());

    // Show success message
    toast.success("Logged out successfully");

    // Redirect to home page
    router.push("/");

    // Close modal and dropdown
    setIsLogoutOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening logout modal
  };

  const getProfileImage = () => {
    // Use profile data if available, otherwise fall back to user data
    if (profileData?.data?.image) {
      return profileData.data.image;
    }
    if (user?.image) {
      return user.image;
    }
    // Default profile image
    return "/images/profile.jpg";
  };

  const getDisplayName = () => {
    if (profileData?.data) {
      return `${profileData.data.firstName} ${profileData.data.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "Guest User";
  };

  const getDisplayEmail = () => {
    if (profileData?.data?.email) {
      return profileData.data.email;
    }
    if (user?.email) {
      return user.email;
    }
    return "";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 backdrop-blur-md bg-transparent px-4 md:px-8 py-4 transition-all duration-300 ${
          isScrolled ? "shadow-md " : "shadow-none"
        }`}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <img
                src="/images/logo.png"
                alt="Business AI Plan Logo"
                width={50}
                height={50}
                className="rounded-lg"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <h3 className="text-black font-medium text-2xl ">
                Business AI Plan
              </h3>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-x-4 text-end flex gap-0.5 md:gap-1">
            {/* Temporary Debug Display */}
            {/* {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-red-500 bg-yellow-100 p-2 rounded">
                Debug: User: {user ? "Yes" : "No"} | Token:{" "}
                {token ? "Yes" : "No"} | Role: {user?.role || "None"}
              </div>
            )} */}

            {user && token ? (
              // User is logged in - show profile dropdown
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-card text-accent px-3 py-2 rounded-[13px] transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getProfileImage()}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[20px] font-medium text-accent text-left">
                        {getDisplayName()}
                      </p>
                      <p className="text-[1rem]  text-gray-500 text-left">
                        {getDisplayEmail()}
                      </p>
                    </div>
                    <Link
                      href={
                        user?.role === "USER"
                          ? "/dashboard"
                          : user?.role === "ADMIN" ||
                            user?.role === "SUPERADMIN"
                          ? "/admin"
                          : "/"
                      }
                    >
                      <div className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm text-accent hover:bg-card transition-colors border-b border-gray-100 cursor-pointer">
                        <CgProfile className="text-xl text-[#99A6B8]" />
                        <p className="text-[1rem] ">Dashboard</p>
                      </div>
                    </Link>
                    <div
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm hover:bg-card transition-colors cursor-pointer"
                    >
                      <MdLogout className="text-xl text-[#99A6B8]" />
                      <button className="text-[1rem] ">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show login/signup buttons

              <>
                <Link href="/signIn">
                  <button className="text-accent text-[1rem] font-medium px-4 py-2 rounded-[33px] transition bg-white cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link href="/signUp">
                  <button className="bg-primary text-[1rem] font-medium hover:bg-primary/80 text-white px-5 py-2 rounded-[33px] transition cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 🔒 Logout Confirmation Modal */}
      <LogoutPopup
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
