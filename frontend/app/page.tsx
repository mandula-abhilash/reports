import { BarChart3, ClipboardList, MapPin } from "lucide-react";

import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <MainLayout>
      <main className="relative">
        <HeroSection />

        {/* Features Section */}
        <section className="container px-4 md:px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-lg border-2 bg-background/60 backdrop-blur-sm p-8 hover:border-havelock-blue transition-all duration-300 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-havelock-blue/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 text-havelock-blue">
                  <ClipboardList className="h-12 w-12" />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-havelock-blue transition-colors">
                  Easy Submission
                </h3>
                <p className="text-muted-foreground">
                  Submit your site assessment requests quickly and easily
                  through our intuitive interface.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border-2 bg-background/60 backdrop-blur-sm p-8 hover:border-web-orange transition-all duration-300 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-web-orange/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 text-web-orange">
                  <BarChart3 className="h-12 w-12" />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-web-orange transition-colors">
                  Detailed Reports
                </h3>
                <p className="text-muted-foreground">
                  Receive comprehensive reports with detailed analysis and
                  recommendations.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border-2 bg-background/60 backdrop-blur-sm p-8 hover:border-conifer transition-all duration-300 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-conifer/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative">
                <div className="mb-4 text-conifer">
                  <MapPin className="h-12 w-12" />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-conifer transition-colors">
                  Track Progress
                </h3>
                <p className="text-muted-foreground">
                  Monitor the status of your assessment requests in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/60 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="py-8 text-center text-sm text-muted-foreground">
            © 2024 FGB Acumen. All rights reserved.
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
