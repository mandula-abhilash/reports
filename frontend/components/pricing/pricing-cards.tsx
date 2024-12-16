"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins, Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const pricingPlans = [
  {
    name: "Starter",
    tokens: 5,
    price: 50,
    description: "Perfect for small businesses starting with site assessments",
    features: [
      "5 Assessment Tokens",
      "Valid for 12 months",
      "Detailed PDF Reports",
      "Email Support"
    ]
  },
  {
    name: "Professional",
    tokens: 55,
    price: 500,
    savings: 50,
    description: "Ideal for growing businesses with regular assessment needs",
    features: [
      "55 Assessment Tokens",
      "Valid for 24 months",
      "Priority Support",
      "Custom Branding"
    ]
  },
  {
    name: "Enterprise",
    tokens: 115,
    price: 1000,
    savings: 100,
    description: "Best value for businesses with high-volume requirements",
    features: [
      "115 Assessment Tokens",
      "Never Expire",
      "24/7 Priority Support",
      "Custom Branding",
      "Dedicated Account Manager"
    ]
  }
];

export function PricingCards() {
  const { toast } = useToast();

  const handlePurchase = async (plan: typeof pricingPlans[0]) => {
    try {
      // Call your Express backend endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any auth headers if needed
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: plan.name,
          tokens: plan.tokens,
          amount: plan.price,
        }),
        credentials: 'include', // Important for cookies if you're using session-based auth
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pricingPlans.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold">£{plan.price}</span>
                {plan.savings && (
                  <span className="text-sm text-green-500">Save £{plan.savings}</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>{plan.tokens} Tokens</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
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
            >
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}