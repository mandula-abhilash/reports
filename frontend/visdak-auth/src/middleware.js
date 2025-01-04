import { NextResponse } from "next/server";

export function createAuthMiddleware(config) {
  const {
    protectedRoutes = [],
    authRoutes = ["/login", "/register"],
    loginPath = "/login",
    defaultProtectedPath = "/dashboard",
  } = config;

  return function middleware(request) {
    const { pathname } = request.nextUrl;

    const sessionCookie = request.cookies.get("accessToken");
    const isAuthenticated = !!sessionCookie;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL(defaultProtectedPath, request.url));
    }

    if (!isAuthenticated && isProtectedRoute) {
      const redirectUrl = new URL(loginPath, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  };
}
