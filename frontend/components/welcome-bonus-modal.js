"use client";

import { Coins } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function WelcomeBonusModal({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 101 }}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Coins className="h-6 w-6 text-web-orange" />
              Welcome Bonus!
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              <p className="text-lg mb-2">
                Congratulations! You've received{" "}
                <span className="font-bold text-web-orange">50 tokens</span> as
                a welcome bonus.
              </p>
              <p className="text-sm text-muted-foreground">
                Use these tokens to generate a site assessment report. Each
                report requires 50 tokens.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
