import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import { getClerkOptions } from "@/server/auth/clerk-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Frontier",
  description: "An idle MMO. Assign work, leave the station, come back to claim it.",
  icons: { icon: "/logo.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkOptions = getClerkOptions(await headers());
  return (
    <ClerkProvider
      publishableKey={clerkOptions.publishableKey}
      proxyUrl={clerkOptions.proxyUrl}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
