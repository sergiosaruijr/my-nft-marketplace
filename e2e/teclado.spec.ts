import { test, expect } from "@playwright/test";

test("login: Tab, Enter e foco no campo inválido", async ({
  page,
  isMobile,
}) => {
  await page.goto("/?auth=login");
  const area = isMobile ? page.locator("main") : page.getByRole("dialog");
  const email = area.getByLabel("E-mail");
  const senha = area.getByLabel("Senha", { exact: true });

  await email.focus();
  await page.keyboard.press("Tab");
  await expect(senha).toBeFocused();

  await page.keyboard.press("Enter"); // envia vazio
  await expect(area.getByText("Informe um e-mail válido")).toBeVisible();
  await expect(email).toBeFocused(); // o foco vai ao primeiro campo com erro
});
