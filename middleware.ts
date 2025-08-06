// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_KEY } from "./lib/constants";

// Paths that are publicly accessible and do not require authentication.
const publicPaths = ["/auth/login", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is considered a public path.
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  // Get the authentication token from the cookies.
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  // If the path is protected and there is no token, redirect to the login page.
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    // Optionally, add a redirect query param to return the user after login.
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user has a token and tries to access a public auth page (like login),
  // redirect them to the main user dashboard.
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/u", request.url));
  }

  // Allow the request to proceed if none of the above conditions are met.
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
