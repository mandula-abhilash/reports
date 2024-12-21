import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/requests",
  "/dashboard/profile",
  "/dashboard/confirmation",
];

// Add routes that are only accessible to non-authenticated users
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check for either session or token cookie
  const isAuthenticated =
    request.cookies.has("session") || request.cookies.has("token");

  // Clone the response
  const response = NextResponse.next();

  // Add Partitioned attribute to Cloudflare cookies
  const cookies = request.cookies.getAll();
  cookies.forEach((cookie) => {
    if (cookie.name === "__cf_bm" || cookie.name === "_cfuvid") {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        partitioned: true,
        secure: true,
        sameSite: "strict",
      });
    }
  });

  // Redirect authenticated users trying to access auth routes
  if (
    isAuthenticated &&
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|android-chrome-192x192.png|android-chrome-512x512.png|apple-touch-icon.png|favicon-16x16.png|favicon-32x32.png|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
