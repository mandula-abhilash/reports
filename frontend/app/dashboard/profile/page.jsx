"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProfilePage() {
  const { user, tokens, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <div className="grid gap-6">
        {/* Token Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tokens</CardTitle>
            <CardDescription>
              Use tokens to generate site assessment reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-web-orange" />
                <span className="text-2xl font-bold">{tokens} Tokens</span>
              </div>
              <Link href="/pricing">
                <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                  Buy More Tokens
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Each report requires 50 tokens to generate
            </p>
          </CardContent>
        </Card>

        {/* Profile Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
