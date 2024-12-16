import { MainLayout } from "@/components/layout/main-layout";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-12">
        <section className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Purchase tokens to generate site assessment reports. The more tokens you buy, the more you save.
            </p>
          </div>
          <PricingCards />
        </section>
      </div>
    </MainLayout>
  );
}