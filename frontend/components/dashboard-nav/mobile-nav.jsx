"use client";

import Link from "next/link";
import { FileStack, FileText, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileNav({ activeTab, onClose }) {
  const navItems = [
    {
      id: "new-request",
      label: "New Request",
      icon: FileText,
      href: "/dashboard",
    },
    {
      id: "my-requests",
      label: "My Requests",
      icon: FileStack,
      href: "/dashboard/requests",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.id} href={item.href} onClick={onClose}>
            <Button
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-secondary"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
