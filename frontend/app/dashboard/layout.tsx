"use client";

import { usePathname } from "next/navigation";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

import { DashboardNav } from "@/components/dashboard-nav";
import { MainLayout } from "@/components/layout/main-layout";

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
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
            <div className="hidden lg:block">
              <DashboardNav activeTab={getActiveTab()} />
            </div>
            <main className="space-y-6">{children}</main>
          </div>
        </div>
      </GoogleMapsProvider>
    </MainLayout>
  );
}
