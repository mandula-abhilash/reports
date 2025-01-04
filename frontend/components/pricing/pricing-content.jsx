"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/components/layout/main-layout";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center py-12">
          <Spinner size="lg" className="text-web-orange" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-12">
        <section className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Purchase tokens to generate site assessment reports. The more
              tokens you buy, the more you save.
            </p>
          </div>
          <PricingCards />
        </section>
      </div>
    </MainLayout>
  );
}
