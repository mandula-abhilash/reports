"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSiteRequestStore from "@/store/site-request-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SiteMap } from "@/components/site-map";

const siteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  siteName: z.string().optional(),
});

export function SiteRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const setFormData = useSiteRequestStore((state) => state.setFormData);

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

  const handleProceedToPayment = () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please fill in all required fields and select a location.",
      });
      return;
    }

    const formData = {
      ...formValues,
      siteName: formValues.siteName || selectedAddress,
      siteLocation: selectedAddress,
      coordinates: selectedLocation,
      boundary: polygonPath,
    };
    setFormData(formData);
    router.push("/pricing");
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="text-center max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Site Assessment Request
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Complete your details, mark your site location, and proceed with
          payment. We will assess the site, generate a report, and email it to
          you.
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="order-2 lg:order-1 p-6 bg-background/95 backdrop-blur-sm border-2">
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
                  disabled={!isFormValid()}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Pay to Submit Request
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
    </div>
  );
}
