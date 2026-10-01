import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InventoryClient } from "@/components/frontier/inventory-client";

export default async function InventoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <InventoryClient key={userId} userId={userId} />;
}
