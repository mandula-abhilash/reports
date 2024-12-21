"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

import { SiteRequestForm } from "@/components/site-request-form";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <SiteRequestForm />
    </div>
  );
}
