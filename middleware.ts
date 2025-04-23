import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  // Public pages
  "/",
  "/sign-up",
  "/sign-in",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher([
  // Public API routes
  "/api/videos",
  "api/images",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname.startsWith("/dashboard");
  const isApiRequest = currentUrl.pathname.startsWith("/api");
  if (userId && !isAccessingDashboard && !isApiRequest) {
    return NextResponse.redirect(new URL("/home", req.url));
  } 

  // If the user is not logged in, redirect them to the login page
  if (!userId) {
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
