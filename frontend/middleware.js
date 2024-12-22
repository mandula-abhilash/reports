import { NextResponse } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/requests",
  "/dashboard/profile",
  "/pricing",
];

// List of auth routes (login/register pages)
const authRoutes = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the token from the session cookie
  const sessionCookie = request.cookies.get("session");
  const isAuthenticated = !!sessionCookie;

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the requested path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    // redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Specify which paths the middleware should run on
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.png$).*)",
  ],
};
