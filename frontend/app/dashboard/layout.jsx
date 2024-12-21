"use client";

import { usePathname } from "next/navigation";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

import { DashboardNav } from "@/components/dashboard-nav";
import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const getActiveTab = () => {
    if (pathname.includes("/requests")) return "my-requests";
    if (pathname.includes("/profile")) return "profile";
    return "new-request";
  };

  return (
    <MainLayout>
      <GoogleMapsProvider>
        <div className="h-[calc(100vh-3.5rem)]">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 p-6">
            <div className="hidden lg:block h-full">
              <DashboardNav activeTab={getActiveTab()} />
            </div>
            <main className="space-y-6 overflow-y-auto">{children}</main>
          </div>
        </div>
      </GoogleMapsProvider>
    </MainLayout>
  );
}
