"use client";

import { useSearchParams } from "next/navigation";

import { PaymentVerification } from "@/components/checkout/payment-verification";
import { MainLayout } from "@/components/layout/main-layout";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
        <PaymentVerification sessionId={sessionId} />
      </div>
    </MainLayout>
  );
}
