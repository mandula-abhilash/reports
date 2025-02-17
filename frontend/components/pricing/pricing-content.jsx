"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingContent() {
  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-12">
        <section className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Choose Your Report Type
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select the type of report that best suits your needs. Each report
              provides detailed insights for informed decision-making.
            </p>
          </div>
          <PricingCards />
        </section>
      </div>
    </MainLayout>
  );
}
