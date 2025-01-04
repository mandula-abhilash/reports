"use client";

import Link from "next/link";

import LogoBlack from "@/components/logo/LogoBlack";
import LogoWhite from "@/components/logo/LogoWhite";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="block ml-2 dark:hidden w-48 h-10">
            <LogoBlack />
          </div>
          <div className="hidden md:-ml-6 dark:block w-48 h-10">
            <LogoWhite />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
