import { AdminDashboardHeader } from "@/components/dashboard/adminDashboard";
import UserInfo from "@/components/dashboard/adminDashboard/UserInfo";

const UserInfoPage = async ({ params }: any) => {
  const { id } = await params;

  return (
    <>
      <AdminDashboardHeader />
      <UserInfo id= {id} />
    </>
  );
};

export default UserInfoPage;
