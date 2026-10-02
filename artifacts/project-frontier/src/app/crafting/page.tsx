import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CraftingClient } from "@/components/frontier/crafting-client";

export default async function CraftingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <CraftingClient key={userId} userId={userId} />;
}
