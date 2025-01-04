"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/visdak-auth/src/api/auth";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/main-layout";

const validatePasswords = (data) => {
  if (data.password !== data.confirmPassword) {
    return { confirmPassword: "Passwords do not match" };
  }
  return {};
};

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: (data) => {
      const errors = {};
      if (!data.name) {
        errors.name = "Name is required";
      }
      if (!data.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (
        !data.password ||
        data.password.length < 8 ||
        data.password.length > 100
      ) {
        errors.password = "Password must be 8-100 characters";
      }
      return {
        values: data,
        errors: { ...errors, ...validatePasswords(data) },
      };
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast({
        title: "Registration Successful",
        description: "Please verify your email.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          error.response?.data?.error?.details || "Please try again later.",
      });
    }
  };

  return (
    <MainLayout>
      <main className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-card p-8">
            <div className="space-y-2 text-center mb-8">
              <h1 className="text-3xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">
                Register to request site assessments
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-havelock-blue hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
