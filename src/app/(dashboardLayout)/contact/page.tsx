import { SoloDashboardHeader } from "@/components/dashboard/soloDashboard";
import ContactAdminForm from "@/components/dashboard/ContactAdminForm";

export default function ContactPage() {
  return (
    <div className="space-y-6 bg-card min-h-screen">
      <SoloDashboardHeader />
      <ContactAdminForm />
    </div>
  );
}
