"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

// Types for our request data
interface SiteRequest {
  id: string;
  siteName: string;
  location: string;
  status: "pending" | "completed" | "in_progress";
  submittedAt: string;
  reportUrl?: string;
}

// Dummy data
const dummyRequests: SiteRequest[] = [
  {
    id: "REQ001",
    siteName: "Downtown Office Complex",
    location: "123 Business Ave, London",
    status: "completed",
    submittedAt: "2024-02-15",
    reportUrl: "#",
  },
  {
    id: "REQ002",
    siteName: "Riverside Shopping Center",
    location: "456 River Road, Manchester",
    status: "in_progress",
    submittedAt: "2024-02-14",
  },
  {
    id: "REQ003",
    siteName: "Tech Hub Building",
    location: "789 Innovation Street, Birmingham",
    status: "pending",
    submittedAt: "2024-02-13",
  },
];

export default function RequestsPage() {
  const [requests] = useState<SiteRequest[]>(dummyRequests);

  const getStatusColor = (status: SiteRequest["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    }
  };

  const getStatusText = (status: SiteRequest["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
    }
  };

  if (requests.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">My Requests</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any site assessment requests yet.
            </p>
            <Link href="/dashboard">
              <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                Submit New Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Requests</h2>
        <Link href="/dashboard">
          <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
            New Request
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-1">{request.siteName}</CardTitle>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{request.location}</p>
                    <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(request.status)} variant="secondary">
                  {getStatusText(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                {request.status === "completed" && request.reportUrl && (
                  <>
                    <Button variant="outline" size="sm" className="space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </Button>
                    <Button variant="outline" size="sm" className="space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Online</span>
                    </Button>
                  </>
                )}
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}