"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircle2, XCircle } from "lucide-react";

import { verifyEmail } from "@/lib/api/auth";
import { creditWelcomeBonus } from "@/lib/api/wallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/main-layout";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const verificationAttempted = useRef(false);
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    if (!verificationAttempted.current && token) {
      verificationAttempted.current = true;

      const verifyToken = async () => {
        try {
          const response = await verifyEmail(token);

          // Auto-login the user
          if (response.credentials) {
            await login(response.credentials);

            // Credit welcome bonus
            try {
              await creditWelcomeBonus();
              toast({
                title: "Welcome Bonus",
                description: "You've received 50 tokens as a welcome bonus!",
              });
            } catch (error) {
              console.error("Failed to credit welcome bonus:", error);
            }

            setStatus("success");
            setMessage(
              "Email verified successfully! Redirecting to dashboard..."
            );

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          }
        } catch (error) {
          setStatus("error");
          setMessage(
            error.response?.data?.error?.details || "Email verification failed"
          );
        }
      };

      verifyToken();
    }
  }, [searchParams, router, login, toast]);

  return (
    <MainLayout>
      <main className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {status === "loading" ? (
              <Spinner size="lg" className="text-web-orange" />
            ) : status === "success" ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" />
            )}

            <h1 className="text-2xl font-bold">
              {status === "loading"
                ? "Verifying Email"
                : status === "success"
                  ? "Email Verified"
                  : "Verification Failed"}
            </h1>

            <p className="text-muted-foreground">{message}</p>

            {status === "error" && (
              <Button
                onClick={() => router.push("/login")}
                className="bg-web-orange hover:bg-web-orange/90 text-white"
              >
                Go to Login
              </Button>
            )}
          </div>
        </Card>
      </main>
    </MainLayout>
  );
}
