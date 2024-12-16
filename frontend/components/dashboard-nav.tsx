"use client";

import { cn } from "@/lib/utils";
import { FileText, FileStack , User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface DashboardNavProps {
  activeTab: string;
}

export function DashboardNav({ activeTab }: DashboardNavProps) {
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
          <Link key={item.id} href={item.href}>
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