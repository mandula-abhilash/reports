"use client";

import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/components/layout/main-layout";
import { SuccessContent } from "@/components/success/success-content";

export default function SuccessPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="w-full max-w-md flex items-center justify-center">
              <Spinner size="lg" className="text-web-orange" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </MainLayout>
  );
}
