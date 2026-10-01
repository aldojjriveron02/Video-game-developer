import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Brand } from "@/components/frontier/brand";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <>
      <header className="bar">
        <div className="wrap">
          <Brand />
          <Link href="/sign-in" className="mono muted" style={{ color: "inherit", fontSize: ".85rem" }}>
            Sign in
          </Link>
        </div>
      </header>
      <main className="wrap" style={{ padding: "4rem 1.25rem" }}>
        <p className="label">Field station PF-001</p>
        <h1 className="mono" style={{ fontSize: "clamp(2rem,6vw,3.25rem)", lineHeight: 1.1, margin: "0 0 1rem", maxWidth: "18ch" }}>
          Assign the work. Leave. Claim it later.
        </h1>
        <p className="muted" style={{ maxWidth: "46ch", marginBottom: "1.75rem" }}>
          Project Frontier is an idle MMO. Send your character to gather wood, and the station keeps
          time on the server while you are away.
        </p>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Link href="/sign-up" className="btn">Create account</Link>
          <Link href="/sign-in" className="btn ghost">Sign in</Link>
        </div>
      </main>
    </>
  );
}
