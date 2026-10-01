import { clerkMiddleware } from "@clerk/nextjs/server";
import { getClerkOptions } from "./server/auth/clerk-config";

export default clerkMiddleware(
  () => undefined,
  (request) => getClerkOptions(request.headers),
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};