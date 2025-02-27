"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PricingContent } from "@/components/pricing/pricing-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <MainLayout>
      <PricingContent />
    </MainLayout>
  );
}
