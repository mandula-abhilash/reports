"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/visdak-auth/src/api/auth";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const verificationAttempted = useRef(false);

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
          await verifyEmail(token);
          setStatus("success");
          setMessage("Email verified successfully! Please log in to continue.");
        } catch (error) {
          setStatus("error");
          setMessage(
            error.response?.data?.error?.details || "Email verification failed"
          );
        }
      };

      verifyToken();
    }
  }, [searchParams]);

  return (
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

          {status !== "loading" && (
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
  );
}
