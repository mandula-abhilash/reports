"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSiteRequestStore from "@/store/site-request-store";
import { createCheckoutSession } from "@/visdak-auth/src/api/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { Coins, FileText, Loader2, Mountain } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SiteMap } from "@/components/site-map";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const siteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  siteName: z.string().optional(),
});

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

export function SiteRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const setFormData = useSiteRequestStore((state) => state.setFormData);
  const selectedPlan = useSiteRequestStore((state) => state.selectedPlan);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(siteRequestSchema),
    mode: "onChange",
  });

  const formValues = watch();

  const isFormValid = () => {
    return (
      isValid &&
      selectedLocation &&
      selectedAddress &&
      Object.keys(errors).length === 0
    );
  };

  const handleProceedToPayment = async () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please fill in all required fields and select a location.",
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No report type selected. Please go back and select a report type.",
      });
      return;
    }

    try {
      setIsProcessing(true);

      const formData = {
        ...formValues,
        siteName: formValues.siteName || selectedAddress,
        siteLocation: selectedAddress,
        coordinates: selectedLocation,
        boundary: polygonPath,
      };

      setFormData(formData);

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe is not properly configured");
      }

      const { sessionId } = await createCheckoutSession({
        planId: selectedPlan._id,
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
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to process payment. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  // Get the icon for the selected plan
  const PlanIcon = selectedPlan ? getProductIcon(selectedPlan.name) : FileText;

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
      {/* Form Card */}
      <Card className="order-2 lg:order-1 p-6 bg-background/95 backdrop-blur-sm border-2">
        {selectedPlan && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-web-orange/10">
                <PlanIcon className="h-5 w-5 text-web-orange" />
              </div>
              <h2 className="text-lg font-semibold">{selectedPlan.name}</h2>
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-bold">£{selectedPlan.price}</span>
              <span className="text-muted-foreground text-sm">one-time</span>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="businessName"
                {...register("businessName")}
                className={errors.businessName ? "border-destructive" : ""}
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                Contact Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                {...register("contactEmail")}
                className={errors.contactEmail ? "border-destructive" : ""}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name & Location</Label>
              <Input
                id="siteName"
                placeholder="Enter a name for this site (optional)"
                {...register("siteName")}
                className={errors.siteName ? "border-destructive" : ""}
              />
              {selectedAddress ? (
                <div className="mt-2 p-3 rounded-md border bg-muted/50">
                  <p className="text-sm break-words">{selectedAddress}</p>
                </div>
              ) : (
                <div className="mt-2 p-3 rounded-md border border-destructive/50 bg-destructive/10">
                  <p className="text-sm text-destructive">
                    Please search for or select a location on the map
                  </p>
                </div>
              )}
            </div>

            {polygonPath.length > 0 && (
              <div className="space-y-2">
                <Label>Site Boundary</Label>
                <div className="p-3 rounded-md border bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Boundary area drawn on map
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="button"
                className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                onClick={handleProceedToPayment}
                disabled={!isFormValid() || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Map */}
      <div className="order-1 lg:order-2 lg:col-span-2 h-[600px] lg:h-[calc(100vh-12rem)]">
        <SiteMap
          onLocationSelect={handleLocationSelect}
          onPolygonComplete={handlePolygonComplete}
          selectedLocation={selectedLocation}
          polygonPath={polygonPath}
        />
      </div>
    </div>
  );
}
