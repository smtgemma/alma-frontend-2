import AdminAuthLayout from "@/feature/adminAuth/AdminAuthLayout";
import AdminAuthSide from "@/feature/adminAuth/AdminAuthSide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Healixity",
    template: "%s | Admin",
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAuthLayout sideComponent={<AdminAuthSide />}>{children}</AdminAuthLayout>;
}
