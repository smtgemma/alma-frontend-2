import TeamDashboardHeader from "@/components/dashboard/teamDashboard/TeamDashboardHeader";
import UserList from "@/components/dashboard/teamDashboard/UserList";

// Mock user data - in a real app, this would come from an API

export default function ManageUsersPage() {
  return (
    <div className="">
      <TeamDashboardHeader />
      <UserList />
    </div>
  );
}
