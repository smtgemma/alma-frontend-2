import {
  PlansTable,
  SoloDashboardHeader,
  SummaryCards,
} from "@/components/dashboard/soloDashboard";

export default function TeamDashboardPage() {
  return (
    <div className="space-y-6 bg-card min-h-screen">
      <SoloDashboardHeader />
      <SummaryCards />
      <PlansTable />
    </div>
  );
}
