"use client";

import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingContent() {
  return (
    <div className="px-4 md:px-8 py-12">
      <section className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl font-bold tracking-tighter">
              Site Assessment Request
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your report type, enter your details, mark your site
              location and proceed with payment. We will assess the site,
              generate a report, and email it to you.
            </p>
          </div>

          <PricingCards />
        </div>
      </section>
    </div>
  );
}
