"use client";

import { useAdmin } from "@/context/AdminContext";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
