import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QuestsClient } from "@/components/frontier/quests-client";

export default async function QuestsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <QuestsClient key={userId} userId={userId} />;
}
