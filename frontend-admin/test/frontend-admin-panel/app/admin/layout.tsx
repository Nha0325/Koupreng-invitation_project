import type { Metadata } from "next";
import AdminProvider from "@/context/AdminProvider";

export const metadata: Metadata = {
  title: "Admin Dashboard | Koupreng Invitations",
  description: "Admin dashboard for managing invitations and users",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    </AdminProvider>
  );
}
