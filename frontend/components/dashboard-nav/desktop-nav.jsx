"use client";

import { useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { NavItem } from "./nav-item";
import { navItems } from "./nav-items";

export function DesktopNav({ activeTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative h-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronsLeftRight
          className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "rotate-180" : ""
          )}
        />
        <span className="sr-only">
          {isCollapsed ? "Expand" : "Collapse"} Sidebar
        </span>
      </Button>

      <div
        className={cn(
          "flex h-full flex-col border rounded-lg transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <div className="p-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
