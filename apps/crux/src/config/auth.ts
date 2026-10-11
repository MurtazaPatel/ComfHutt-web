/**
 * Sign-in methods offered on /signin and /signup.
 *
 * Google sign-in is OFF by default (founder decision D7, 2026-10-11). Its OAuth client
 * lived in the Google Cloud project that was suspended on 2026-09-21, so the button led
 * to a dead end. Email-code sign-in is unaffected. To bring Google back once a working
 * OAuth client exists, set NEXT_PUBLIC_GOOGLE_SIGN_IN_ENABLED=true in Vercel and redeploy
 * (NEXT_PUBLIC_ values are inlined at build time).
 */
export const GOOGLE_SIGN_IN_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_SIGN_IN_ENABLED === "true";
