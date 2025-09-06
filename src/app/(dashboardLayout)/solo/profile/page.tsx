import SoloDashboardHeader from '@/components/dashboard/soloDashboard/SoloDashboardHeader';
import ProfileForm from '@/components/dashboard/soloDashboard/ProfileForm';

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      <SoloDashboardHeader />
      <ProfileForm />
    </div>
  );
}
