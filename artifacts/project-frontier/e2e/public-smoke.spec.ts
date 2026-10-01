import { expect, test } from "@playwright/test";

test("public landing page is reachable without signing in", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(500);
  await expect(page.locator("body")).toBeVisible();
});

test("public health endpoint reports sanitized application and database status", async ({
  request,
}) => {
  const response = await request.get("/frontier-api/health");
  expect([200, 503]).toContain(response.status());
  const body = await response.json();
  expect(body).toMatchObject({
    status: response.status() === 200 ? "ok" : "degraded",
    app: "ok",
    database: response.status() === 200 ? "ok" : "unavailable",
  });
  expect(JSON.stringify(body)).not.toMatch(/postgres(ql)?:\/\/|password|secret/i);
});