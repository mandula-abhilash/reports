"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyPaymentSession } from "@/visdak-auth/src/api/stripe";

import { Spinner } from "@/components/ui/spinner";
import { PaymentSuccess } from "@/components/checkout/payment-verification";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) return;
        const result = await verifyPaymentSession(sessionId);
        setVerificationData(result);
      } catch (error) {
        console.error("Payment verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  return (
    <PaymentSuccess
      plan={verificationData?.plan}
      siteRequest={verificationData?.siteRequest}
    />
  );
}
