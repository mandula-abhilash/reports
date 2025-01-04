"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPaymentSession } from "@/visdak-auth/src/api/stripe";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { PaymentSuccess } from "./payment-success";

export function PaymentVerification({ sessionId }) {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [plan, setPlan] = useState(null);
  const { fetchTokens } = useAuth();
  const router = useRouter();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        router.replace("/dashboard");
        return;
      }

      // Prevent multiple verification attempts
      if (verificationAttempted.current) {
        return;
      }

      verificationAttempted.current = true;

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

  useEffect(() => {
    // Redirect to cancel page if verification fails
    if (verificationStatus === "failed") {
      const timeoutId = setTimeout(() => {
        router.replace("/cancel");
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [verificationStatus, router]);

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
    return (
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spinner size="lg" className="text-web-orange" />
          <p className="text-muted-foreground">
            Payment verification failed. Redirecting...
          </p>
        </div>
      </Card>
    );
  }

  return <PaymentSuccess plan={plan} />;
}
