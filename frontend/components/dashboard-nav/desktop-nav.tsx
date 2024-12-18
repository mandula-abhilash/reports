"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileStack,
  FileText,
  PanelLeft,
  PanelLeftClose,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DesktopNavProps {
  activeTab: string;
}

export function DesktopNav({ activeTab }: DesktopNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log(isCollapsed);
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
    <div className="relative">
      <div
        className={cn(
          "flex flex-col border rounded-lg transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <div className="p-2">
          <div className="flex flex-col space-y-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return isCollapsed ? (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <Button
                          variant={
                            activeTab === item.id ? "secondary" : "ghost"
                          }
                          className={cn(
                            "w-full justify-center",
                            activeTab === item.id && "bg-secondary"
                          )}
                          size="icon"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{item.label}</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
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
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <PanelLeft className="h-3 w-3" />
        ) : (
          <PanelLeftClose className="h-3 w-3" />
        )}
        <span className="sr-only">
          {isCollapsed ? "Expand" : "Collapse"} Sidebar
        </span>
      </Button>
    </div>
  );
}
