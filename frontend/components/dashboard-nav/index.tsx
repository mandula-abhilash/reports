"use client";

import { DesktopNav } from "./desktop-nav";

interface DashboardNavProps {
  activeTab: string;
}

export function DashboardNav({ activeTab }: DashboardNavProps) {
  return <DesktopNav activeTab={activeTab} />;
}
