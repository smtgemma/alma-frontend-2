'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { useGetUserProfileQuery, useUpdateProfileMutation, useUploadProfileImageMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { store } from "@/redux/store";
import { CiLock } from "react-icons/ci";
import DashboardLoading from './soloDashboard/DashboardLoading';

const Label = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-lg text-accent font-normal mb-1 block">
    {children}
  </label>
);

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user from Redux store
  const { user } = useSelector((state: ReturnType<typeof store.getState>) => state.user);

  // API hooks
  const { data: profileData, isLoading, error, refetch } = useGetUserProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProfileImageMutation();

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        firstName: profileData.data.firstName || '',
        lastName: profileData.data.lastName || '',
      });
    }
  }, [profileData]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      await uploadImage(formData).unwrap();
      toast.success("Profile image updated successfully!");
      setSelectedImage(null);
      setPreviewImage(null);
      refetch(); // Refresh profile data
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const updateData: any = {};
      if (formData.firstName !== profileData?.data.firstName) {
        updateData.firstName = formData.firstName;
      }
      if (formData.lastName !== profileData?.data.lastName) {
        updateData.lastName = formData.lastName;
      }

      if (Object.keys(updateData).length === 0) {
        toast.error("No changes to save");
        return;
      }

      await updateProfile(updateData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refetch(); // Refresh profile data
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (profileData?.data) {
      setFormData({
        firstName: profileData.data.firstName || '',
        lastName: profileData.data.lastName || '',
      });
    }
    setSelectedImage(null);
    setPreviewImage(null);
    setIsEditing(false);
  };

  // Get current profile image
  const getProfileImage = () => {
    if (previewImage) return previewImage;
    if (profileData?.data?.image) return profileData.data.image;
    if (user?.image) return user.image;
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
    return '';
  };

  // Get user email
  const getDisplayEmail = () => {
    if (profileData?.data?.email) {
      return profileData.data.email;
    }
    if (user?.email) {
      return user.email;
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <DashboardLoading 
          type="profile" 
          title="Loading Profile" 
          message="Retrieving your account information..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <DashboardLoading 
          type="profile" 
          title="Error Loading Profile" 
          message="Failed to load your profile. Please try again."
        />
      </div>
    );
  }

  // If no profile data and no user data, show error
  if (!profileData?.data && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <DashboardLoading 
          type="profile" 
          title="No Profile Data" 
          message="No user data available. Please contact support."
        />
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-10 border-b-2 border-b-[#99A6B8] gap-4">
        <div>
          <h1 className="text-[24px] mb-2 font-medium">Personal Info</h1>
          <p className="text-[1rem] font-regular text-info">Upload your photo and personal info here</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handleCancel}
            disabled={isUpdating || isUploading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-accent rounded-lg border border-accent shadow w-full md:w-auto cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProfileUpdate}
            disabled={isUpdating || isUploading || !isEditing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-accent rounded-lg shadow w-full md:w-auto cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <section>
        {/* Upload Photo Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-b border-b-[#99a6b888] overflow-x-hidden">
          <div>
            <h2 className="font-normal mb-2 text-[20px]">Your Photo</h2>
            <p className="text-[1rem] font-regular text-info">This photo will be displayed on your profile</p>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4 items-center">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-[#CCF5FF] text-accent rounded-[10px] shadow cursor-pointer disabled:opacity-50"
              >
                <FiUpload size={18} className="text-accent" />
                {"Upload Photo"}
              </button>
              {selectedImage && (
                <button
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-accent rounded-[10px] shadow cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Save Image"}
                </button>
              )}
            </div>

            <div className="w-40 h-40 overflow-hidden rounded-full">
              <Image
                src={getProfileImage()}
                alt="User"
                width={160}
                height={160}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Name Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-b border-b-[#99a6b888]">
          <h2 className="font-normal mb-2 text-[20px]">Name</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-[600px]">
            <div className="flex-1">
              <Label>First Name</Label>
              <input
                type="text"
                className="input w-full"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => {
                  handleInputChange('firstName', e.target.value);
                  setIsEditing(true);
                }}
                disabled={isUpdating}
              />
            </div>
            <div className="flex-1">
              <Label>Last Name</Label>
              <input
                type="text"
                className="input w-full"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => {
                  handleInputChange('lastName', e.target.value);
                  setIsEditing(true);
                }}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-b border-b-[#99a6b888]">
          <h2 className="font-normal mb-2 text-[20px]">Email</h2>
          {/* <div className="w-full max-w-[600px]">
            <Label>Email Address</Label>
            <input
              type="email"
              className="input w-full  cursor-not-allowed"
              placeholder="Email Address"
              value={getDisplayEmail()}
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div> */}

          <div className="w-full max-w-[600px]">
            <Label>Email Address</Label>
            <div className="relative">
              <input
                type="email"
                className="input w-full pr-10 cursor-not-allowed"
                placeholder="Email Address"
                value={getDisplayEmail()}
                disabled
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                  <path d="M8 0a3 3 0 0 1 3 3v3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V3a3 3 0 0 1 3-3zm1 3a2 2 0 1 0-4 0v3h4V3zM1 8a1 1 0 0 0 1 1h2v2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1V9h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H1z" />
                </svg> */}
                <CiLock />
              </span>
            </div>
            {/* <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p> */}
          </div>

        </div>

        {/* Account Status Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-b border-b-[#99a6b888]">
          <h2 className="font-normal mb-2 text-[20px]">Account Status</h2>
          <div className="w-full max-w-[600px] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Verified:</span>
              <span className={`text-sm font-medium ${profileData?.data?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                {profileData?.data?.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
              </span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account Verified:</span>
              <span className={`text-sm font-medium ${profileData?.data?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {profileData?.data?.isVerified ? '✓ Verified' : '✗ Not Verified'}
              </span>
            </div> */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pro Member:</span>
              <span className={`text-sm font-medium ${profileData?.data?.isProMember ? 'text-green-600' : 'text-gray-600'}`}>
                {profileData?.data?.isProMember ? '✓ Pro Member' : 'Free User'}
              </span>
            </div>
            {profileData?.data?.membershipEnds && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Membership Ends:</span>
                <span className="text-sm font-medium text-gray-800">
                  {new Date(profileData.data.membershipEnds).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">User ID:</span>
              <span className="text-sm font-medium text-gray-800">
                {profileData?.data?.id || user?.id || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Role:</span>
              <span className="text-sm font-medium text-gray-800">
                {profileData?.data?.role || user?.role || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription History Section */}
        {profileData?.data?.Subscription && profileData.data.Subscription.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start py-8 border-b border-b-[#99a6b888]">
            <h2 className="font-normal mb-2 text-[20px]">Subscription History</h2>
            <div className="w-full max-w-[600px]">
              <div className="space-y-3">
                {profileData.data.Subscription.slice(0, 3).map((sub:any, index:number) => (
                  <div key={sub.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Subscription #{index + 1}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Started: {new Date(sub.startDate).toLocaleDateString()}</div>
                      {sub.endDate && <div>Ended: {new Date(sub.endDate).toLocaleDateString()}</div>}
                      <div>Plan ID: {sub.planId}</div>
                      <div>Stripe ID: {sub.stripeSubscriptionId}</div>
                    </div>
                  </div>
                ))}
                {profileData.data.Subscription.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{profileData.data.Subscription.length - 3} more subscriptions
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Debug Information (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="flex flex-col md:flex-row justify-between items-start py-8 border-b border-b-[#99a6b888]">
            <h2 className="font-normal mb-2 text-[20px]">Debug Info</h2>
            <div className="w-full max-w-[600px]">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Profile Data Loaded: {profileData ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600 mb-2">User Data Loaded: {user ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600 mb-2">Current Name: {getDisplayName()}</p>
                <p className="text-xs text-gray-600 mb-2">Current Email: {getDisplayEmail()}</p>
                <p className="text-xs text-gray-600">Profile Image: {getProfileImage()}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
