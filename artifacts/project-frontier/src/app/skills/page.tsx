import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SkillsClient } from "@/components/frontier/skills-client";

export default async function SkillsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <SkillsClient key={userId} userId={userId} />;
}
