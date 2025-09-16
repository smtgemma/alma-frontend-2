"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "sonner";
import { store } from "@/redux/store";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useChangePasswordMutation,
} from "@/redux/api/auth/authApi";
import {
  useBlockedUsersQuery,
  useUserSuspendMutation,
} from "@/redux/api/admin/adminAPI";
import Link from "next/link";
import { format } from "date-fns";
import Loading from "@/components/Others/Loading";

const Setting = () => {
  const [suspendUser] = useUserSuspendMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: blockedUsers } = useBlockedUsersQuery({});
  // Redux User
  const { user } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.user
  );

  // API hooks
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProfileImageMutation();
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  // State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    email: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Load profile into form
  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        firstName: profileData.data.firstName || "",
        lastName: profileData.data.lastName || "",
        location: profileData.data.location || "",
        email: profileData.data.email || "",
      });
    }
  }, [profileData]);

  // ===== Handlers =====
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return toast.error("Select an image first");
    try {
      const fd = new FormData();
      fd.append("profileImage", selectedImage);
      await uploadImage(fd).unwrap();
      toast.success("Profile image updated");
      setSelectedImage(null);
      setPreviewImage(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Image upload failed");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData: any = {};
      if (formData.firstName !== profileData?.data.firstName)
        updateData.firstName = formData.firstName;
      if (formData.lastName !== profileData?.data.lastName)
        updateData.lastName = formData.lastName;
      if (formData.location !== profileData?.data.location)
        updateData.location = formData.location;

      if (Object.keys(updateData).length === 0)
        return toast.error("No changes to save");

      await updateProfile(updateData).unwrap();
      toast.success("Profile updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      return toast.error("Fill both password fields");
    }
    try {
      await changePassword(passwords).unwrap();
      toast.success("Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Password change failed");
    }
  };

  const getProfileImage = () => {
    if (previewImage) return previewImage;
    if (profileData?.data?.image) return profileData.data.image;
    if (user?.image) return user.image;
    return "/images/profile.jpg";
  };

  // ===== RENDER =====
  if (isLoading) return <Loading />;
  if (error) return <p>Error loading profile</p>;

  const handleConfirmSuspend = async (id: string, status: string) => {
    const res = await suspendUser({ id, body: { status } });
    // Check response success
    if (res.data?.success) {
      toast.success(res.data.message || "User suspended successfully!");
    } else {
      toast.error(res.data?.message || "Failed to suspend user!");
    }

    // console.log(`Suspending user: ${user.firstName} ${user.lastName}`);
    // setIsSuspendModalOpen(false);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">
      <h2 className="text-[32px] font-medium text-gray-900 mb-6">
          Admin Information
        </h2>
      {/* Admin Information Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-[24px] font-medium text-gray-900 mb-6">
          Profile Picture:
        </h2>

        <div className="flex flex-col gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <div className="w-44 h-44 rounded-full overflow-hidden mb-4">
                <Image
                  src={getProfileImage()}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-44 h-44 rounded-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-4 right-2 w-12 h-12 p-1 shadow-md bg-white rounded-lg flex items-center justify-center"
              >
                <FaCamera className="text-[#0795FE] text-3xl" />
              </button>
              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="mt-3 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  {isUploading ? "Uploading..." : "Save Image"}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>
          </div>

          {/* User Details Form */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={isUpdating}
                className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="lg:w-1/3">
            <h3 className="text-lg font-semibold text-gray-900">
              Change Password
            </h3>
          </div>

          <div className="lg:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        oldPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showOldPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showNewPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg">
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isChanging}
                className="px-6 py-2 bg-primary text-white rounded-lg"
              >
                {isChanging ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Suspended Users Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Suspended Users
          </h2>

          {/* Search Bar */}
          <div className="relative mt-4 sm:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-[41px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#475466]">
              <tr>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Date & Time
                </th>
             
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Profile
                </th>
               
                <th className="px-6 py-3 text-left text-sm sm:text-md md:text-[20px] font-medium text-white uppercase tracking-wider">
                  Suspension
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockedUsers?.data.data.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {format(new Date(user.updatedAt), "hh:mm a - MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    {user.firstName}
                    {user.lastName}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-base text-accent font-normal">
                    <span className="">{user.userType}</span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/user-profile/${user.id}`}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-[41px] bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleConfirmSuspend(user.id, "ACTIVE")}
                      className="bg-[#84CC16] text-white px-3 cursor-pointer py-1 rounded-sm hover:bg-[#84CC16]/90 transition-colors duration-200 text-sm"
                    >
                      End Suspension
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing 11 - out of 1450
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
              Previous
            </button>
            <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
              3
            </button>
            <span className="px-2 text-white">...</span>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
              15
            </button>
            <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
              Next
            </button>
          </div>
        </div> */}
      </div>
      {/* Suspend User Modal */}
    </div>
  );
};

export default Setting;
