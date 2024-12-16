"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { DashboardNav } from "@/components/dashboard-nav";
import { usePathname } from "next/navigation";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const getActiveTab = () => {
    if (pathname.includes("/requests")) return "my-requests";
    if (pathname.includes("/profile")) return "profile";
    return "new-request";
  };

  return (
    <MainLayout>
      <GoogleMapsProvider>
        <div className="px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <DashboardNav activeTab={getActiveTab()} />
            <main className="space-y-6">{children}</main>
          </div>
        </div>
      </GoogleMapsProvider>
    </MainLayout>
  );
}