"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, FileStack, FileText, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DesktopNavProps {
  activeTab: string;
}

export function DesktopNav({ activeTab }: DesktopNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="hidden lg:block">
      <div
        className={cn(
          "flex flex-col border rounded-lg p-2 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeTab === item.id && "bg-secondary",
                    isCollapsed && "px-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-4 self-end"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
