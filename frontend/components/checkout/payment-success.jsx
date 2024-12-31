"use client";

import Link from "next/link";
import { CheckCircle2, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentSuccess({ plan }) {
  return (
    <div className="relative">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>

          <div className="flex items-center gap-2 text-lg">
            <Coins className="h-5 w-5 text-web-orange" />
            <span>
              <strong>{plan?.tokens || 0}</strong> tokens have been added to
              your wallet
            </span>
          </div>

          <p className="text-muted-foreground">
            Thank you for your purchase. You can now use these tokens to
            generate site assessment reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/pricing" className="w-full">
              <Button variant="outline" className="w-full">
                Buy More
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-web-orange hover:bg-web-orange/90 text-white">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
