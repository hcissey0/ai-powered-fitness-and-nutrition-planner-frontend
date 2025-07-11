
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_KEY = "fitness_auth_token"; // Key for the authentication token in cookies
// Paths that don't require authentication
const publicPaths = ["/auth/login", "/register", "/auth/signup", "/forgot-password"];

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
  );

  // Get the authentication token from the cookies
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  console.log(token)

  // If the path requires authentication and the user is not authenticated
  if (!isPublicPath && !token) {
    // Create a URL for the login page
    const loginUrl = new URL("/auth/login", request.url);

    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set("redirect", path);

    // Redirect to the login page
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  // Apply this middleware to all routes except static files and api routes that handle auth
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth routes (for authentication API)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (common static files)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
