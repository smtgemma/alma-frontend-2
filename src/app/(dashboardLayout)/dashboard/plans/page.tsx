import SoloDashboardHeader from "@/components/dashboard/soloDashboard/SoloDashboardHeader";
import SummaryCards from "@/components/dashboard/soloDashboard/SummaryCards";
import PlansTable from "@/components/dashboard/soloDashboard/PlansTable";

export default function MyPlansPage() {
  return (
    <div className="space-y-6">
      <SoloDashboardHeader />
      <SummaryCards />
      <PlansTable />
    </div>
  );
}
