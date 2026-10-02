import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GatheringClient } from "@/components/frontier/gathering-client";

export default async function GatheringPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <GatheringClient key={userId} userId={userId} />;
}
