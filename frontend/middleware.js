import { NextResponse } from "next/server";

export function middleware(request) {
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

  return response;
}

export const config = {
  matcher: "/:path*",
};
