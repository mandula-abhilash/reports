"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";

export default function CancelPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <XCircle className="h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold">Payment Cancelled</h1>
            <p className="text-muted-foreground">
              Your payment was cancelled. No charges were made.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link href="/pricing" className="w-full">
                <Button variant="outline" className="w-full">
                  Try Again
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button className="w-full bg-web-orange hover:bg-web-orange/90 text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
