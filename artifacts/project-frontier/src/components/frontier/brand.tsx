import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" />
      Project Frontier
    </Link>
  );
}
