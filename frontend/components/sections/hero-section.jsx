"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const statsAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.pexels.com/photos/14650435/pexels-photo-14650435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Modern architecture"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50"></div>
      </div>

      <div className="px-4 md:px-6 relative">
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="inline-block">
              <div className="inline-flex items-center font-semibold shadow-md rounded-full border px-6 py-2 mt-8 md:mt-0 text-md bg-background/60 backdrop-blur-sm">
                <span className="text-web-orange">Professional</span>
                <div className="mx-2 h-4 w-[1px] bg-muted-foreground/20"></div>
                <span className="text-havelock-blue">Reliable</span>
                <div className="mx-2 h-4 w-[1px] bg-muted-foreground/20"></div>
                <span className="text-conifer">Efficient</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Professional Site
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="block"
              >
                Assessment Services
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl"
            >
              Expert site assessment services with comprehensive reporting.
              Trust FGB Acumen for detailed insights and professional
              assessments.
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-web-orange hover:bg-web-orange/90 font-semibold text-md text-white min-w-[200px] group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] backdrop-blur-sm font-semibold text-md bg-background/60"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.8,
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12"
          >
            <motion.div variants={statsAnimation} className="relative group">
              <div className="absolute inset-0 rounded-lg blur-xl transition-all"></div>
              <div className="relative bg-background/60 backdrop-blur-sm rounded-lg border p-6 transition-all">
                <p className="text-3xl font-bold text-web-orange">500+</p>
                <p className="text-sm text-muted-foreground">Sites Assessed</p>
              </div>
            </motion.div>

            <motion.div variants={statsAnimation} className="relative group">
              <div className="absolute inset-0 rounded-lg blur-xl transition-all"></div>
              <div className="relative bg-background/60 backdrop-blur-sm rounded-lg border p-6 transition-all">
                <p className="text-3xl font-bold text-havelock-blue">98%</p>
                <p className="text-sm text-muted-foreground">
                  Client Satisfaction
                </p>
              </div>
            </motion.div>

            <motion.div variants={statsAnimation} className="relative group">
              <div className="absolute inset-0 rounded-lg blur-xl transition-all"></div>
              <div className="relative bg-background/60 backdrop-blur-sm rounded-lg border p-6 transition-all">
                <p className="text-3xl font-bold text-conifer">24/7</p>
                <p className="text-sm text-muted-foreground">
                  Support Available
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
