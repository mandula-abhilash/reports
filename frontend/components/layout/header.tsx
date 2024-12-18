"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MobileNav } from "@/components/dashboard-nav/mobile-nav";
import LogoBlack from "@/components/logo/LogoBlack";
import LogoWhite from "@/components/logo/LogoWhite";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // This would come from your auth context in a real app
  const userTokens = 15;
  const isLoggedIn =
    pathname.startsWith("/dashboard") || pathname === "/pricing";

  const getActiveTab = () => {
    if (pathname.includes("/requests")) return "my-requests";
    if (pathname.includes("/profile")) return "profile";
    return "new-request";
  };

  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-2"
        >
          <div className="block dark:hidden w-48 h-10">
            <LogoBlack />
          </div>
          <div className="hidden dark:block w-48 h-10">
            <LogoWhite />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/pricing">
                      <Button variant="outline" size="sm" className="space-x-2">
                        <Coins className="h-4 w-4" />
                        <span>{userTokens} Tokens</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to buy more tokens</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => (window.location.href = "/login")}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {isLoggedIn ? (
                  <>
                    <MobileNav
                      activeTab={getActiveTab()}
                      onClose={() => setIsOpen(false)}
                    />
                    <Link href="/pricing">
                      <Button
                        variant="outline"
                        className="w-full justify-start space-x-2"
                      >
                        <Coins className="h-4 w-4" />
                        <span>{userTokens} Tokens</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => (window.location.href = "/login")}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full justify-start bg-web-orange hover:bg-web-orange/90 text-white">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
