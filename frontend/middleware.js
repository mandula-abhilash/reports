import { NextResponse } from "next/server";

export function middleware(request) {
  // Only run on /pricing route
  if (request.nextUrl.pathname === "/pricing") {
    // Get the referer
    const referer = request.headers.get("referer");

    // Check if user is coming from the home page
    if (!referer || !referer.includes(request.nextUrl.origin)) {
      // Redirect to home if accessed directly
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/pricing",
};
