import SoloDashboardHeader from '@/components/dashboard/soloDashboard/SoloDashboardHeader';
import SubscriptionPlan from '@/components/dashboard/soloDashboard/SubscriptionPlan';

export default function SubscriptionPlanPage() {
  return (
    <div className="space-y-6">
      <SoloDashboardHeader />
      <SubscriptionPlan />
    </div>
  );
}
