"use client";

import { useSearchParams } from "next/navigation";

import { PaymentVerification } from "@/components/checkout/payment-verification";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return <PaymentVerification sessionId={sessionId} />;
}
