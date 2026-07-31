import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    // Skip API routes, Next internals, and any static asset in /public — without
    // the file-extension exclusion the auth check redirects images (e.g. the DTU
    // logo on the login page), so they render broken for signed-out visitors.
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico|webmanifest)$).*)',
    ],
};
