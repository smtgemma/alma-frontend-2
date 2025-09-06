"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TeamDashboardHeader from "@/components/dashboard/teamDashboard/TeamDashboardHeader";
import UserProfile from "@/components/dashboard/teamDashboard/UserProfile";
import RemoveUserModal from "@/components/dashboard/teamDashboard/RemoveUserModal";
import Loading from "@/components/Others/Loading";
import { useRemoveMemberTeamMutation } from "@/redux/api/team/teamApi";
import { toast } from "sonner";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [removeMember, { isLoading: isRemoving }] =
    useRemoveMemberTeamMutation();
  useEffect(() => {
    setIsLoading(true);
    // Fetch user data based on the ID
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${params?.userId}`
        );
        const data = await response.json();
        setIsLoading(false);
        setUser(data?.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.userId, router]);

  const handleRemoveUser = () => {
    setShowRemoveModal(true);
  };

  const confirmRemoveUser = async () => {
    if (!user) return;

    try {
      const res = await removeMember({
        email: user.email,
        teamId: params.teamId,
      }).unwrap();
      setShowRemoveModal(false);
      toast.success(res.message || "User removed successfully");
      // Redirect back to user list after successful removal
      router.push("/dashboard/manage-users");
    } catch (error: any) {
      setShowRemoveModal(false);
      toast.error(error.data.message);
    }
  };

  const closeModal = () => {
    setShowRemoveModal(false);
  };

  const goBackToList = () => {
    router.push("/dashboard/manage-users");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TeamDashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading user profile...</div>
        </div>
      </div>
    );
  }
  if (!params?.teamId && !params.userId) {
    return <Loading />;
  }
  return (
    <div className="space-y-6 bg-card h-screen">
      <TeamDashboardHeader />
      {user && (
        <UserProfile
          user={user}
          onRemoveUser={handleRemoveUser}
          onBackToList={goBackToList}
        />
      )}

      <RemoveUserModal
        isOpen={showRemoveModal}
        isRemoving={isRemoving}
        onConfirm={confirmRemoveUser}
        onCancel={closeModal}
      />
    </div>
  );
}
