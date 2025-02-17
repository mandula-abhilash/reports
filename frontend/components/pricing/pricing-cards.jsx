"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSiteRequestStore from "@/store/site-request-store";
import { getActivePlans } from "@/visdak-auth/src/api/plans";
import { createCheckoutSession } from "@/visdak-auth/src/api/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { FileText, Loader2, Mountain } from "lucide-react";

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

const getProductFeatures = (name) => {
  switch (name) {
    case "Full Report":
      return [
        "Expert-reviewed site risk reports for quick, shareable insights",
        "Comprehensive risk analysis",
        "Environmental impact assessment",
        "Planning recommendations",
        "PDF report delivery",
        "Email support",
      ];
    case "Topography Report":
      return [
        "Topographical reports giving you accurate height data quickly",
        "Detailed terrain mapping",
        "Slope analysis",
        "Contour mapping",
        "PDF report delivery",
        "Email support",
      ];
    default:
      return [];
  }
};

const getProductIcon = (name) => {
  switch (name) {
    case "Full Report":
      return FileText;
    case "Topography Report":
      return Mountain;
    default:
      return FileText;
  }
};

const getProductDescription = (name) => {
  switch (name) {
    case "Full Report":
      return "Comprehensive site assessment with expert-reviewed risk analysis";
    case "Topography Report":
      return "Detailed topographical analysis with accurate height data";
    default:
      return "";
  }
};

export function PricingCards() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const { toast } = useToast();
  const router = useRouter();
  const formData = useSiteRequestStore((state) => state.formData);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const activePlans = await getActivePlans();
        setPlans(activePlans);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again later.",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    // Redirect if no form data
    if (!formData) {
      router.replace("/");
      return;
    }

    fetchPlans();
  }, [toast, router, formData]);

  const handlePurchase = async (plan) => {
    try {
      setLoadingPlanId(plan._id);

      if (!formData) {
        throw new Error(
          "Please fill in your details before proceeding with the purchase"
        );
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe is not properly configured");
      }

      const { sessionId } = await createCheckoutSession({
        planId: plan._id,
        email: formData.contactEmail,
        name: formData.name,
        businessName: formData.businessName,
        siteRequest: {
          siteName: formData.siteName,
          siteLocation: formData.siteLocation,
          coordinates: formData.coordinates,
        },
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
          No products available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => {
        const Icon = getProductIcon(plan.name);
        const features = getProductFeatures(plan.name);

        return (
          <Card key={plan._id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-web-orange/10">
                  <Icon className="h-6 w-6 text-web-orange" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </div>
              <CardDescription>
                {getProductDescription(plan.name)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">£{plan.price}</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
                <ul className="space-y-2 mt-6">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-green-500/10 mt-0.5">
                        <svg
                          className="h-3 w-3 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
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
                  "Purchase Report"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
