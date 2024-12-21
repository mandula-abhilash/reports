import Link from "next/link";
import { FileStack, FileText, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const icons = {
  FileText,
  FileStack,
  User,
};

export function NavItem({ item, isActive, isCollapsed }) {
  const Icon = icons[item.icon];

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-center",
                  isActive && "bg-secondary"
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
      </TooltipProvider>
    );
  }

  return (
    <Link href={item.href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start", isActive && "bg-secondary")}
      >
        <Icon className="mr-2 h-4 w-4" />
        {item.label}
      </Button>
    </Link>
  );
}
