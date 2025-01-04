import { NextResponse } from "next/server";

/**
 * Auth middleware for handling protected routes and authentication redirects
 * @param {Object} config - Middleware configuration
 * @param {string[]} config.protectedRoutes - Routes that require authentication
 * @param {string[]} config.authRoutes - Authentication related routes (login/register)
 * @param {string} config.loginPath - Path to redirect unauthenticated users
 * @param {string} config.defaultProtectedPath - Path to redirect authenticated users from auth pages
 */
export function middleware(request, config) {
  const {
    protectedRoutes = [],
    authRoutes = ["/login", "/register"],
    loginPath = "/login",
    defaultProtectedPath = "/dashboard",
  } = config;

  const { pathname } = request.nextUrl;

  // Get the token from the session cookie
  const sessionCookie = request.cookies.get("accessToken");
  const isAuthenticated = !!sessionCookie;

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the requested path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(defaultProtectedPath, request.url));
  }

  // Redirect authenticated users from root to dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL(defaultProtectedPath, request.url));
  }

  // Redirect unauthenticated users to login from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL(loginPath, request.url);
    // redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * Creates a configured middleware instance
 * @param {Object} config - Middleware configuration
 */
export function createAuthMiddleware(config) {
  return (request) => middleware(request, config);
}
