"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { verifyPaymentSession } from "@/lib/api/stripe";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { PaymentSuccess } from "./payment-success";

export function PaymentVerification({ sessionId }) {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [plan, setPlan] = useState(null);
  const { fetchTokens } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.replace("/dashboard");
        return;
      }

      try {
        const result = await verifyPaymentSession(sessionId);
        if (result.status === "complete" || result.paymentStatus === "paid") {
          await fetchTokens();
          setVerificationStatus("success");
          setPlan(result.plan);
        } else {
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setVerificationStatus("failed");
      }
    };

    verifyPayment();
  }, [sessionId, router, fetchTokens]);

  if (verificationStatus === "verifying") {
    return (
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" className="text-web-orange" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </Card>
    );
  }

  if (verificationStatus === "failed") {
    router.replace("/cancel");
    return null;
  }

  return <PaymentSuccess plan={plan} />;
}
