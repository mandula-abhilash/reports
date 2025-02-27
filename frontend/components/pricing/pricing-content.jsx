"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingContent({ isHomePage = false }) {
  return (
    <div className="px-4 md:px-8 py-12">
      <section className="max-w-6xl mx-auto">
        {isHomePage && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 lg:col-span-1">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tighter">
                  Site Assessment Request
                </h1>
                <p className="text-muted-foreground">
                  Complete your details, mark your site location, and proceed
                  with payment. We will assess the site, generate a report, and
                  email it to you.
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-500/10 mt-0.5">
                      <svg
                        className="h-3 w-3 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Select your report type
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-500/10 mt-0.5">
                      <svg
                        className="h-3 w-3 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Enter your details
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-500/10 mt-0.5">
                      <svg
                        className="h-3 w-3 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Mark your site location
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-500/10 mt-0.5">
                      <svg
                        className="h-3 w-3 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Receive your report via email
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
            <div className="lg:col-span-2">
              <div className="text-center space-y-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Choose Your Report Type
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Select the type of report that best suits your needs. Each
                  report provides detailed insights for informed
                  decision-making.
                </p>
              </div>
              <PricingCards isHomePage={true} />
            </div>
          </div>
        )}

        {!isHomePage && (
          <>
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Choose Your Report Type
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select the type of report that best suits your needs. Each
                report provides detailed insights for informed decision-making.
              </p>
            </div>
            <PricingCards />
          </>
        )}
      </section>
    </div>
  );
}
