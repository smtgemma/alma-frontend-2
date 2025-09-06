import TeamDashboardHeader from '@/components/dashboard/teamDashboard/TeamDashboardHeader';
import AddUser from '@/components/dashboard/teamDashboard/AddUser';

export default function AddUserPage() {
  return (
    <div className="space-y-6">
      <TeamDashboardHeader />
      <AddUser />
    </div>
  );
}

