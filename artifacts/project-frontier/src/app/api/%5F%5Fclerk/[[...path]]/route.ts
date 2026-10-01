import "server-only";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Encoded underscores are required: Next otherwise treats __clerk as private.
// Never accepts an upstream host from the caller or exposes the secret.
async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return new Response(null, { status: 404 });
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) return new Response(null, { status: 503 });
  const upstream = new URL("https://frontend-api.clerk.dev");
  upstream.pathname = request.nextUrl.pathname.replace(/^\/api\/__clerk/, "");
  upstream.search = request.nextUrl.search;
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").split(",")[0]!.trim();
  const protocol = request.headers.get("x-forwarded-proto") === "http" ? "http" : "https";
  const headers = new Headers(request.headers);
  for (const key of ["host", "connection", "transfer-encoding", "content-length", "accept-encoding"]) headers.delete(key);
  headers.set("Clerk-Proxy-Url", `${protocol}://${host}/api/__clerk`);
  headers.set("Clerk-Secret-Key", secret);
  try {
    const response = await fetch(upstream, {
      method: request.method, headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(15_000),
    });
    const out = new Headers(response.headers);
    for (const key of ["connection", "transfer-encoding", "content-encoding", "content-length"]) out.delete(key);
    const bodyless = request.method === "HEAD" || [204, 304].includes(response.status);
    const body = bodyless ? null : await response.arrayBuffer();
    if (body) out.set("content-length", String(body.byteLength));
    return new Response(body, { status: response.status, headers: out });
  } catch {
    return new Response(null, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as OPTIONS, proxy as HEAD };