import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CombatClient } from "@/components/frontier/combat-client";

export default async function CombatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <CombatClient key={userId} userId={userId} />;
}
