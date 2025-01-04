"use client";

import { useEffect, useState } from "react";
import { getActivePlans } from "@/visdak-auth/src/api/plans";
import { createCheckoutSession } from "@/visdak-auth/src/api/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Check, Coins, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const getPlanFeatures = (plan) => {
  const baseFeatures = [
    `${plan.tokens} Assessment Tokens`,
    "Detailed PDF Reports",
    "Email Support",
  ];

  const additionalFeatures = {
    "Starter Plan": ["Valid for 12 months"],
    "Premium Plan": [
      "Valid for 24 months",
      "Priority Support",
      "Custom Branding",
    ],
    "Enterprise Plan": [
      "Never Expire",
      "24/7 Priority Support",
      "Custom Branding",
      "Dedicated Account Manager",
    ],
  };

  return [...baseFeatures, ...(additionalFeatures[plan.name] || [])];
};

export function PricingCards() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const activePlans = await getActivePlans();
        setPlans(activePlans);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load pricing plans. Please try again later.",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handlePurchase = async (plan) => {
    try {
      setLoadingPlanId(plan._id);

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe is not properly configured");
      }

      const { sessionId } = await createCheckoutSession({
        planId: plan._id,
        paymentGateway: "stripe",
        quantity: 1,
      });

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to process purchase. Please try again.",
      });
      setLoadingPlanId(null);
    }
  };

  if (loadingPlans) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No pricing plans available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => {
        const isPopular = plan.name === "Premium Plan";
        const features = getPlanFeatures(plan);

        return (
          <Card key={plan._id} className="flex flex-col">
            <CardHeader>
              {isPopular && (
                <div className="mb-2 text-center">
                  <span className="bg-web-orange/10 text-web-orange text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                {plan.name === "Starter Plan"
                  ? "Perfect for small businesses starting with site assessments"
                  : plan.name === "Premium Plan"
                    ? "Ideal for growing businesses with regular assessment needs"
                    : "Best value for businesses with high-volume requirements"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">£{plan.price}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>{plan.tokens} Tokens</span>
                </div>
                <ul className="space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                onClick={() => handlePurchase(plan)}
                disabled={loadingPlanId !== null}
              >
                {loadingPlanId === plan._id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Buy Now
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
