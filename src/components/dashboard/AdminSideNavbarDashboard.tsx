"use client";

import Image from "next/image";
import {
  BsCalendar2Check,
  BsCreditCard,
  BsPeople,
  BsPerson,
  BsCheckCircle,
  BsGear,
} from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { useSelector, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import { logout } from "@/redux/features/user/userSlice";
import { toast } from "sonner";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import Cookies from "js-cookie";

export default function AdminSideNavbarDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  console.log(user);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLogoutSelected, setIsLogoutSelected] = useState(false);
  const [currentSelectedPath, setCurrentSelectedPath] = useState(pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
    //admin-signin
    setIsLogoutOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutSelected(true);
    setCurrentSelectedPath("");
    setIsLogoutOpen(true);
  };

  const handleMenuClick = (path: string) => {
    setIsLogoutSelected(false);
    setCurrentSelectedPath(path);
    setIsMobileMenuOpen(false);
  };

  const getProfileImage = () => {
    if (user?.image) {
      return user.image;
    }
    return "/images/profile.jpg";
  };

  const getDisplayName = () => {
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "Admin User";
  };

  const getDisplayEmail = () => {
    if (user?.email) {
      return user.email;
    }
    return "admin@example.com";
  };

  return (
    <>
      {/* Mobile Burger Menu Button */}
      <div className="lg:hidden fixed top-8 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <HiX className="w-6 h-6 text-gray-700" />
          ) : (
            <HiMenu className="w-6 h-6 text-gray-700" />
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
          "bg-white border-r border-r-[#99A6B8] h-full flex flex-col transition-transform duration-300 ease-in-out",
          "lg:w-64 lg:relative lg:translate-x-0",
          isMobileMenuOpen
            ? "fixed top-0 left-0 w-64 z-50 translate-x-0"
            : "fixed top-0 left-0 w-64 z-50 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Profile Section */}
        <div className="flex flex-col justify-center items-center px-8 pt-14 pb-4">
          <div className="w-[110px] h-[110px] rounded-full overflow-hidden">
            <Image
              // src={getProfileImage()}
              src="/images/dp.webp"
              alt="Admin"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-1 text-start items-center mt-2">
            <h2 className="text-xl font-normal">{getDisplayName()}</h2>
            <img src="/images/p.png" alt="Verified" />
          </div>
          <div>
            <p className="text-[1rem] text-info font-normal text-start">
              {getDisplayEmail()}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 border-t border-t-[#99A6B8] pt-4 px-4">
          <div className="space-y-3">
            <Link href="/admin">
              <button
                onClick={() => handleMenuClick("/admin")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <HiOutlineDocumentText
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Overview
              </button>
            </Link>

            <Link href="/admin/pending-plans">
              <button
                onClick={() => handleMenuClick("/admin/pending-plans")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/pending-plans"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsCalendar2Check
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/pending-plans"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Pending Plans
              </button>
            </Link>

            <Link href="/admin/solo-users">
              <button
                onClick={() => handleMenuClick("/admin/solo-users")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/solo-users"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsPerson
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/solo-users"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Solo Users
              </button>
            </Link>

            <Link href="/admin/team-users">
              <button
                onClick={() => handleMenuClick("/admin/team-users")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/team-users"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsPeople
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/team-users"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Team Users
              </button>
            </Link>

            <Link href="/admin/expert-review">
              <button
                onClick={() => handleMenuClick("/admin/expert-review")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/expert-review"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsCheckCircle
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/expert-review"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Expert Review
              </button>
            </Link>

            <Link href="/admin/subscription-plan">
              <button
                onClick={() => handleMenuClick("/admin/subscription-plan")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/subscription-plan"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsCreditCard
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/subscription-plan"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Subscription Plan
              </button>
            </Link>

            <Link href="/admin/setting">
              <button
                onClick={() => handleMenuClick("/admin/setting")}
                className={clsx(
                  "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
                  currentSelectedPath === "/admin/setting"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary hover:text-white"
                )}
              >
                <BsGear
                  className={clsx(
                    "text-2xl transition-colors",
                    currentSelectedPath === "/admin/setting"
                      ? "text-white"
                      : "text-[#99A6B8] group-hover:text-white"
                  )}
                />
                Setting
              </button>
            </Link>
          </div>
        </nav>

        {/* Logout Section - Fixed at bottom */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogoutClick}
            className={clsx(
              "w-full flex items-center gap-3 text-left px-4 py-4 rounded-md text-[1rem] font-normal cursor-pointer group",
              isLogoutSelected
                ? "bg-primary text-white"
                : " bg-[#E9E9E9] hover:bg-primary hover:text-white"
            )}
          >
            <RiLogoutCircleRLine
              className={clsx(
                "text-2xl transition-colors",
                isLogoutSelected
                  ? "text-white"
                  : "text-[#99A6B8] group-hover:text-white"
              )}
            />
            Log Out
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
