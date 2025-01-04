"use client";

import { GoogleMapsProvider } from "@/contexts/google-maps-context";

import { MainLayout } from "@/components/layout/main-layout";
import { SiteRequestForm } from "@/components/site-request-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <MainLayout>
      <GoogleMapsProvider>
        <main className="container mx-auto px-4 py-8">
          <SiteRequestForm />
        </main>
        <footer className="border-t bg-background/60 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="py-8 text-center text-sm text-muted-foreground">
              © 2024 FGB Acumen. All rights reserved.
            </div>
          </div>
        </footer>
      </GoogleMapsProvider>
    </MainLayout>
  );
}
