"use client";

import { Suspense } from "react";

import { VerifyEmailContent } from "@/components/auth/verify-email-content";
import { MainLayout } from "@/components/layout/main-layout";

export default function VerifyEmailPage() {
  return (
    <MainLayout>
      <Suspense fallback={<VerifyEmailLoading />}>
        <VerifyEmailContent />
      </Suspense>
    </MainLayout>
  );
}

function VerifyEmailLoading() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
      <div className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
