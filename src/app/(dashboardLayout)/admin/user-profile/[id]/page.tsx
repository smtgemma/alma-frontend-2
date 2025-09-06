import { AdminDashboardHeader } from "@/components/dashboard/adminDashboard";
import UserProfile from "@/components/dashboard/adminDashboard/UserProfile";

const TeamUserProfilePage = async ({ params }: any) => {
  const { id } = await params;

  return (
    <>
      {/* <AdminDashboardHeader /> */}
      <UserProfile id={id} />
    </>
  );
};
export default TeamUserProfilePage;
