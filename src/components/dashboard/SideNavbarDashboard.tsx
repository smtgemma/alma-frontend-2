"use client";

import Image from "next/image";
import { BsCalendar2Check, BsCreditCard, BsEnvelope } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { GrPower } from "react-icons/gr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "@/redux/api/auth/authApi";
import { store } from "@/redux/store";
import { logout } from "@/redux/features/user/userSlice";
import { clearSubscriptionData } from "@/redux/features/subscription/subscriptionSlice";
import { persistor } from "@/redux/store";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Loading from "../Others/Loading";
import { HiMenu, HiX } from "react-icons/hi";
import { RiGroupLine } from "react-icons/ri";

export default function SideNavbarDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.user
  );

  // Get updated profile data
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !token, // Only fetch if user is logged in
  });
  const { data: MyProfileData } = useGetUserProfileQuery({});

  console.log(
    "MyProfileData",
    MyProfileData?.data?.Subscription[0]?.subscriptionType
  );

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLogoutSelected, setIsLogoutSelected] = useState(false);
  const [currentSelectedPath, setCurrentSelectedPath] = useState(pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear subscription related localStorage items
    localStorage.removeItem("subscriptionId");
    localStorage.removeItem("paymentIntentId");
    localStorage.removeItem("clientSecret");
    localStorage.removeItem("subscriptionStatus");
    localStorage.removeItem("subscriptionAmount");
    localStorage.removeItem("subscriptionCurrency");

    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("user");

    // Also try clearing with different path options to ensure complete removal
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    // Clear Redux state
    dispatch(logout());
    dispatch(clearSubscriptionData()); // Clear subscription data

    // Purge Redux persist store to clear all persisted data
    persistor.purge();

    // Show success message
    toast.success("Disconnesso con successo");

    // Redirect to home page
    router.push("/");

    // Close modal
    setIsLogoutOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutSelected(true);
    setCurrentSelectedPath(""); // Clear the current path selection
    setIsLogoutOpen(true);
  };

  // Reset logout selection when other menu items are clicked
  const handleMenuClick = (path: string) => {
    setIsLogoutSelected(false);
    setCurrentSelectedPath(path);
    // Close mobile menu when a menu item is clicked
    setIsMobileMenuOpen(false);
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
    return "User";
  };

  // Get user email
  const getDisplayEmail = () => {
    if (profileData?.data?.email) {
      return profileData.data.email;
    }
    if (user?.email) {
      return user.email;
    }
    return "user@example.com";
  };

  return (
    <>
      {/* Mobile Burger Menu Button */}
      <div className="lg:hidden fixed top-8 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-primary transition-colors duration-200 group"
        >
          {isMobileMenuOpen ? (
            <HiX className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-200" />
          ) : (
            <HiMenu className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-white  h-full flex flex-col transition-transform duration-300 ease-in-out",
          "lg:w-64 lg:relative lg:translate-x-0",
          isMobileMenuOpen
            ? "fixed top-0 left-0 w-64 z-50 translate-x-0"
            : "fixed top-0 left-0 w-64 z-50 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Profile Section */}
        <div className="flex flex-col justify-center items-center mx-6 pt-14 pb-4 border-b border-gray-300 ">
          <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
            <Image
              src={getProfileImage()}
              alt="User"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-1 text-start items-center mt-2">
            <h2 className="text-xl font-normal">{getDisplayName()}</h2>
            {profileData?.data?.isVerified && (
              <img src="/images/p.png" alt="Verified" />
            )}
          </div>
          <div>
            <p className="text-[1rem] text-info font-normal text-start">
              {getDisplayEmail()}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1  pt-4 px-4">
          <div className="space-y-3 ">
            <Link href="/dashboard/plans">
              <button
                onClick={() => handleMenuClick("/dashboard/plans")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group", // 👈 added group
                  currentSelectedPath === "/dashboard/plans"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsCalendar2Check
                  className={clsx(
                    "text-2xl transition-colors", // smooth effect
                    currentSelectedPath === "/dashboard/plans"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white" // 👈 changes on hover
                  )}
                />
                Piano Generato
              </button>
            </Link>

            <Link href="/dashboard/profile">
              <button
                onClick={() => handleMenuClick("/dashboard/profile")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group", // 👈 added group
                  currentSelectedPath === "/dashboard/profile"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <CgProfile
                  className={clsx(
                    "text-2xl transition-colors", // smooth color transition
                    currentSelectedPath === "/dashboard/profile"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white" // 👈 icon follows parent hover
                  )}
                />
                Il Mio Profilo
              </button>
            </Link>
            {MyProfileData?.data?.Subscription?.length > 0 &&
              MyProfileData?.data?.Subscription[0]?.subscriptionType ===
                "TEAM" && (
                <Link href="/dashboard/manage-users">
                  <button
                    onClick={() => handleMenuClick("/dashboard/manage-users")}
                    className={clsx(
                      "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group", // 👈 added group
                      currentSelectedPath === "/dashboard/manage-users"
                        ? "bg-primary text-white"
                        : "bg-white hover:bg-primary hover:text-white"
                    )}
                  >
                    <RiGroupLine
                      className={clsx(
                        "text-2xl transition-colors",
                        currentSelectedPath === "/dashboard/manage-users"
                          ? "text-white"
                          : "text-[#99A6B8] group-hover:text-white" // 👈 icon turns white on hover
                      )}
                    />
                    Gestisci Utenti
                  </button>
                </Link>
              )}

            <Link href="/dashboard/subscription-plan">
              <button
                onClick={() => handleMenuClick("/dashboard/subscription-plan")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group", // 👈 added group
                  currentSelectedPath === "/dashboard/subscription-plan"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsCreditCard
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/dashboard/subscription-plan"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white" // 👈 icon changes to white on hover
                  )}
                />
                Piano Abbonamento
              </button>
            </Link>

            <Link href="/contact">
              <button
                onClick={() => handleMenuClick("/contact")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group",
                  currentSelectedPath === "/contact"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsEnvelope
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/contact"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Contatto
              </button>
            </Link>
          </div>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogoutClick}
            className={clsx(
              "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-medium cursor-pointer group", // 👈 added group
              isLogoutSelected
                ? "bg-primary text-white"
                : "bg-[#E9E9E9] hover:bg-primary hover:text-white"
            )}
          >
            <GrPower
              className={clsx(
                "text-2xl transition-colors",
                isLogoutSelected
                  ? "text-white"
                  : "text-[#99A6B8] group-hover:text-white" // 👈 stroke turns white when parent button hovered
              )}
            />
            Disconnetti
          </button>
        </div>
      </aside>

      {/* Mobile Content Padding */}
      <div className="lg:hidden h-16" />

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
