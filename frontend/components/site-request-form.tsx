"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SiteMap } from "@/components/site-map";
import { useState } from "react";

const siteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  siteName: z.string().min(1, "Site name is required"),
});

export function SiteRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [polygonPath, setPolygonPath] = useState<google.maps.LatLngLiteral[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof siteRequestSchema>>({
    resolver: zodResolver(siteRequestSchema),
  });

  const onSubmit = async (data: z.infer<typeof siteRequestSchema>) => {
    try {
      if (!selectedLocation || polygonPath.length < 3) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please select a location and draw the site boundary.",
        });
        return;
      }

      const requestData = {
        ...data,
        siteLocation: selectedAddress,
        coordinates: selectedLocation,
        boundary: polygonPath,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Request Submitted",
        description: "Your site assessment request has been submitted successfully.",
      });
      
      router.push("/dashboard/confirmation");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again later.",
      });
    }
  };

  const handleLocationSelect = (location: google.maps.LatLngLiteral | null, address: string) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handlePolygonComplete = (path: google.maps.LatLngLiteral[]) => {
    setPolygonPath(path);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-13rem)]">
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <Card className="flex-grow p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register("businessName")}
                className={errors.businessName ? "border-destructive" : ""}
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">{errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...register("contactEmail")}
                className={errors.contactEmail ? "border-destructive" : ""}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                {...register("siteName")}
                className={errors.siteName ? "border-destructive" : ""}
              />
              {errors.siteName && (
                <p className="text-sm text-destructive">{errors.siteName.message}</p>
              )}
            </div>

            {selectedAddress && (
              <div className="space-y-2">
                <Label>Selected Location</Label>
                <p className="text-sm text-muted-foreground">{selectedAddress}</p>
              </div>
            )}
          </Card>

          <Button
            type="submit"
            className="w-full mt-6 bg-web-orange hover:bg-web-orange/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>

      <div className="h-full">
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