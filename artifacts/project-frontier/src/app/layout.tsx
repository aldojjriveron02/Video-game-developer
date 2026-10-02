import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { getClerkOptions } from "@/server/auth/clerk-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Frontier",
  description: "An idle MMO. Assign work, leave the station, come back to claim it.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkOptions = getClerkOptions();

  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={clerkOptions.publishableKey}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
