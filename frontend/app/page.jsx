"use client";

import { useRouter } from "next/navigation";

import { MainLayout } from "@/components/layout/main-layout";
import { PricingContent } from "@/components/pricing/pricing-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const router = useRouter();

  return (
    <MainLayout>
      <PricingContent isHomePage={true} />
    </MainLayout>
  );
}
