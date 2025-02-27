"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";
import useSiteRequestStore from "@/store/site-request-store";

import { MainLayout } from "@/components/layout/main-layout";
import { SiteRequestForm } from "@/components/site-request-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SiteRequestPage() {
  const router = useRouter();
  const selectedPlan = useSiteRequestStore((state) => state.selectedPlan);

  useEffect(() => {
    // Redirect to home if no plan is selected
    if (!selectedPlan) {
      router.replace("/");
    }
  }, [selectedPlan, router]);

  if (!selectedPlan) {
    return null;
  }

  return (
    <MainLayout>
      <GoogleMapsProvider>
        <main className="container mx-auto px-4 py-8">
          <SiteRequestForm />
        </main>
      </GoogleMapsProvider>
    </MainLayout>
  );
}
