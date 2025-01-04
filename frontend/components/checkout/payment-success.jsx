"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSiteRequestStore from "@/store/site-request-store";
import { CheckCircle2, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentSuccess({ plan, siteRequest }) {
  const router = useRouter();
  const clearFormData = useSiteRequestStore((state) => state.clearFormData);

  useEffect(() => {
    // Clear the form data after successful payment
    clearFormData();
  }, [clearFormData]);

  return (
    <div className="relative">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5 text-web-orange" />
              <p className="text-lg font-medium">
                Report Generation Request Submitted
              </p>
            </div>
            <p className="text-muted-foreground">
              Your site assessment report will be generated and sent to{" "}
              <span className="font-medium">{siteRequest?.contactEmail}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/" className="w-full">
              <Button className="w-full bg-web-orange hover:bg-web-orange/90 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
