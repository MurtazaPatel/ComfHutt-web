import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/signin(.*)",
  "/signup(.*)",
  "/forgot-password(.*)",
  "/api/webhook(.*)",
  "/sso-callback(.*)",
  "/__clerk/(.*)",
  // Anonymous scoring (WS2): 3 free scores, no signup — quota is enforced
  // server-side (crux_anon_quota / crux_ip_compute_ledger), never trusted
  // client-side. Everything else under /dashboard stays protected.
  // /score is the anon "start scoring" landing page (Get Started destination);
  // /score/[id] is the result page — both need to be listed since the
  // wildcard pattern requires the trailing slash and won't match the bare route.
  "/score",
  "/score/(.*)",
  // SEO (WS4): robots.txt/sitemap.xml aren't covered by the matcher's static-file
  // extension exclusion below (.txt/.xml aren't in that list), so without this
  // Clerk redirects crawlers to /signin instead of serving the actual file.
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image(.*)",
]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/signin",
    signUpUrl: "/signup",
    afterSignInUrl: "/dashboard",
    afterSignUpUrl: "/onboarding",
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/(.*)",
    "/(api|trpc)(.*)",
  ],
};