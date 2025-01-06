import { NextResponse } from "next/server";

export function middleware(request) {
  // Only run on /pricing route
  if (request.nextUrl.pathname === "/pricing") {
    // Get the referer
    const referer = request.headers.get("referer");
    const hasFormData = request.cookies.get("site_request_data");

    // Allow access if coming from home page or has form data
    if (referer?.includes(request.nextUrl.origin) || hasFormData) {
      return NextResponse.next();
    }

    // Redirect to home if accessed directly without form data
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/pricing",
};
