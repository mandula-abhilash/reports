"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
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
  siteName: z.string().min(1, "Site name is required"),
});

export function SiteRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(siteRequestSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (!selectedLocation || !selectedAddress) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: "Please select a site location using the map.",
        });
        return;
      }

      const requestData = {
        ...data,
        siteLocation: selectedAddress,
        coordinates: selectedLocation,
        boundary: polygonPath,
      };

      // Log the form data
      console.log("Assessment Request Data:", requestData);

      toast({
        title: "Request Submitted",
        description:
          "Your site assessment request has been logged successfully.",
      });

      // Clear form and map selections
      setSelectedLocation(null);
      setSelectedAddress("");
      setPolygonPath([]);

      router.push("/dashboard/requests");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again later.",
      });
    }
  };

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path) => {
    setPolygonPath(path);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Site Assessment Request</h2>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Form Card - Takes 1 column on desktop */}
        <Card className="order-2 lg:order-1 p-6 bg-background/95 backdrop-blur-sm border-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Label htmlFor="siteName">
                  Site Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="siteName"
                  {...register("siteName")}
                  className={errors.siteName ? "border-destructive" : ""}
                />
                {errors.siteName && (
                  <p className="text-sm text-destructive">
                    {errors.siteName.message}
                  </p>
                )}
              </div>

              {selectedAddress && (
                <div className="space-y-2">
                  <Label>Selected Location</Label>
                  <p className="text-sm text-muted-foreground break-words">
                    {selectedAddress}
                  </p>
                </div>
              )}

              {polygonPath.length > 0 && (
                <div className="space-y-2">
                  <Label>Site Boundary</Label>
                  <p className="text-sm text-muted-foreground">
                    Boundary area drawn on map
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Map - Takes 2 columns on desktop */}
        <div className="order-1 lg:order-2 lg:col-span-2 h-[600px] lg:h-[calc(100vh-10rem)]">
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
