import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorldClient } from "@/components/frontier/world-client";

export default async function WorldPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <WorldClient key={userId} userId={userId} />;
}
