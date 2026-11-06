# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\teclado.spec.ts >> login: Tab, Enter e foco no campo inválido
- Location: e2e\teclado.spec.ts:3:1

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/?auth=login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("login: Tab, Enter e foco no campo inválido", async ({
  4  |   page,
  5  |   isMobile,
  6  | }) => {
> 7  |   await page.goto("/?auth=login");
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  8  |   const area = isMobile ? page.locator("main") : page.getByRole("dialog");
  9  |   const email = area.getByLabel("E-mail");
  10 |   const senha = area.getByLabel("Senha", { exact: true });
  11 | 
  12 |   await email.focus();
  13 |   await page.keyboard.press("Tab");
  14 |   await expect(senha).toBeFocused();
  15 | 
  16 |   await page.keyboard.press("Enter"); // envia vazio
  17 |   await expect(area.getByText("Informe um e-mail válido")).toBeVisible();
  18 |   await expect(email).toBeFocused(); // o foco vai ao primeiro campo com erro
  19 | });
  20 | 
```