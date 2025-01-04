import { createAuthMiddleware } from "@/visdak-auth/src/middleware";

// Configure the auth middleware with our routes
export const middleware = createAuthMiddleware({
  protectedRoutes: [
    "/dashboard",
    "/dashboard/requests",
    "/dashboard/profile",
    "/pricing",
    "/success",
    "/cancel",
  ],
  authRoutes: ["/login", "/register"],
  loginPath: "/login",
  defaultProtectedPath: "/dashboard",
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.png$).*)",
  ],
};
