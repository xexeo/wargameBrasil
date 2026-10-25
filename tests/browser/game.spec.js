import { test, expect } from "@playwright/test";
test("narrativa, mapa, movimento, combate, zoom e turno do computador", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("dialog")).toBeVisible();
  await page.getByText("Assumir o comando").click();
  await expect(page.locator("#map .unit")).toHaveCount(10);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await page.locator('[data-id="b1"]').click();
  await page.locator('[data-q="1"][data-r="5"]').click();
  await expect(page.locator("#unitInfo")).toContainText("Movimento 2");
  await page.locator('[data-id="b2"]').click();
  await page.locator('[data-q="3"][data-r="4"]').click();
  await page.locator('[data-id="g2"]').click();
  await expect(page.locator("#log")).toContainText("dado");
  await page.locator("#ideal").click();
  await expect(page.locator("#resetZoom")).not.toHaveText("100%");
  await page.locator("#fit").click();
  const sizes = await page
    .locator("#map")
    .evaluate((el) => ({
      map: el.getBoundingClientRect().width,
      parent: el.parentElement.clientWidth,
    }));
  expect(sizes.map).toBeLessThanOrEqual(sizes.parent + 1);
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("2 / 10", { timeout: 10000 });
  await expect(page.locator("#end")).toBeEnabled();
  await page.locator("#rules").click();
  await expect(page.locator("#modalBody")).toContainText("altura");
  await page.locator("#close").click();
  expect(errors).toEqual([]);
});
test("aprendizado persiste ao recarregar e duplo toque amplia peça", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator('[data-id="b1"]').dblclick();
  await expect(page.locator(".bigpiece")).toBeVisible();
  await page.locator("#close").click();
  await page.locator("#ai").selectOption("learning");
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("2 / 10");
  const value = await page.evaluate(() =>
    localStorage.getItem("monte-castelo-learning-v1"),
  );
  expect(value).toBeTruthy();
  const memory = JSON.parse(value);
  expect(Object.keys(memory.q).length).toBeGreaterThan(0);
  await page.reload();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("monte-castelo-learning-v1"),
    ),
  ).toBe(value);
});

test("autoria mostra logo oficial e licença integral", async ({ page }) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator("#credits").click();
  await expect(page.locator("#modalBody")).toContainText("Geraldo Xexéo");
  await expect(page.locator("#modalBody")).toContainText("CC BY-NC-SA 4.0");
  expect(
    await page
      .locator('img[alt="Logo oficial do LUDES"]')
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  ).toBeTruthy();
  await page.locator("summary").click();
  await expect(page.locator(".license-text")).toContainText(
    "Attribution-NonCommercial-ShareAlike",
  );
});

test("arquivo standalone funciona com todos os recursos embutidos", async ({
  page,
}) => {
  const errors = [];
  const blocked = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) => {
    if (
      route.request().isNavigationRequest() &&
      route.request().url().endsWith("/jogo.html")
    )
      return route.continue();
    blocked.push(route.request().url());
    return route.abort();
  });
  await page.goto("/jogo.html");
  await page.locator("#begin").click();
  await expect(page.locator(".unit")).toHaveCount(10);
  expect(
    await page.locator("#gameLogo").evaluate((img) => img.naturalWidth > 0),
  ).toBeTruthy();
  await page.locator("#credits").click();
  expect(
    await page
      .locator('img[alt="Logo oficial do LUDES"]')
      .evaluate((img) => img.naturalWidth > 0),
  ).toBeTruthy();
  await page.locator("summary").click();
  await expect(page.locator(".license-text")).toContainText("Creative Commons");
  expect(errors).toEqual([]);
  expect(blocked).toEqual([]);
});
