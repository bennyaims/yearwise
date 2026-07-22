/**
 * Visual tour of Yearwise — captures screenshots + extracts Genesis theory.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "test-screenshots");
const BASE = process.env.YEARWISE_URL || "http://localhost:3000";

fs.mkdirSync(OUT, { recursive: true });

const results = [];

async function shot(page, name, fullPage = true) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  results.push({ name, file });
  console.log("SHOT", name);
  return file;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  // 1. Home
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "01-home");

  // 2. Year 7 hub
  await page.goto(`${BASE}/year/7`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "02-year-7");

  // 3. Science cells — guided path
  await page.goto(`${BASE}/year/7/science/cells-as-units`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1000);
  await shot(page, "03-cells-guided-start");

  // Advance a few guided steps if present
  for (let i = 0; i < 3; i++) {
    const options = page.locator("button.option");
    if ((await options.count()) > 0) {
      // click correct-looking - just first option then check - better click Check after selecting
      await options.nth(1).click().catch(() => options.first().click());
      const checkBtn = page.getByRole("button", {
        name: /Check my understanding/i,
      });
      if (await checkBtn.isVisible().catch(() => false)) {
        await checkBtn.click();
        await page.waitForTimeout(400);
        // if wrong, try other options
        const next = page.getByRole("button", { name: /Got it|Finish learning/i });
        if (await next.isVisible().catch(() => false)) {
          await next.click();
          await page.waitForTimeout(400);
        } else {
          // try each option until next appears
          const n = await options.count();
          for (let j = 0; j < n; j++) {
            await options.nth(j).click();
            if (await checkBtn.isVisible().catch(() => false)) {
              await checkBtn.click();
              await page.waitForTimeout(300);
            }
            if (await next.isVisible().catch(() => false)) {
              await next.click();
              await page.waitForTimeout(400);
              break;
            }
          }
        }
      }
    }
  }
  await shot(page, "04-cells-after-steps");

  // 4. Computer Science
  await page.goto(`${BASE}/year/7/computerscience`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "05-cs-year7");

  await page.goto(`${BASE}/year/12/computerscience`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "06-cs-year12-exit");

  // 5. Language Spanish
  await page.goto(`${BASE}/year/7/language/spanish`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "07-language-spanish-fluency");

  // 6. Genesis Lab — main show
  await page.goto(`${BASE}/labs/genesis`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Select Photogen strain for interesting morphs
  const strainSelect = page.locator("select").filter({ hasText: "Protocell" }).first();
  if (await strainSelect.count()) {
    await strainSelect.selectOption({ label: "Photogen strain" }).catch(async () => {
      // try by value
      const selects = page.locator("aside select, .glass select");
      const c = await selects.count();
      for (let i = 0; i < c; i++) {
        const opt = selects.nth(i).locator("option");
        const texts = await opt.allTextContents();
        if (texts.some((t) => t.includes("Photogen"))) {
          await selects.nth(i).selectOption({ label: /Photogen/ });
          break;
        }
      }
    });
  }

  // Set interesting environment — find ranges
  const ranges = page.locator('input[type="range"]');
  if ((await ranges.count()) >= 1) {
    await ranges.nth(0).fill("0.8"); // gravity
  }

  // Star to yellow if available
  const starSelect = page.locator("select").filter({ hasText: "Yellow" }).first();
  if (await starSelect.count()) {
    await starSelect.selectOption({ label: /Yellow/ }).catch(() => {});
  }

  await page.getByRole("button", { name: /Apply env|Reseed/i }).first().click().catch(() => {});
  await page.waitForTimeout(500);

  const runBtn = page.getByRole("button", { name: /Run evolution/i });
  if (await runBtn.isVisible().catch(() => false)) {
    await runBtn.click();
  }
  await shot(page, "08-genesis-start");

  // Let evolution run
  await page.waitForTimeout(8000);
  await shot(page, "09-genesis-evolving-3d");

  // Click first population organism
  const popBtn = page.locator("aside + div button, .glass button").filter({ hasText: /gen /i }).first();
  if (await page.getByText(/gen \d+/).count()) {
    await page.getByText(/gen \d+/).first().click();
    await page.waitForTimeout(600);
  }

  // Scroll to theoretical outcome
  await page.getByText(/Theoretical outcome of your creature/i).scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(500);
  await shot(page, "10-genesis-theoretical-outcome", true);

  // Capture viewport of outcome only
  const outcome = page.locator("section").filter({ hasText: "Theoretical outcome of your creature" });
  if (await outcome.count()) {
    await outcome.first().screenshot({
      path: path.join(OUT, "11-outcome-panel.png"),
    });
    results.push({ name: "11-outcome-panel", file: path.join(OUT, "11-outcome-panel.png") });
  }

  // Extract text for theory write-up
  const conclusion = await page
    .locator("text=Student conclusion")
    .locator("..")
    .innerText()
    .catch(() => "");
  const phenotype = await page
    .getByText("1. Theoretical phenotype")
    .locator("..")
    .innerText()
    .catch(() => "");
  const niche = await page
    .getByText("2. Ecological niche")
    .locator("..")
    .innerText()
    .catch(() => "");
  const forecast = await page
    .getByText("Long-term population")
    .locator("..")
    .innerText()
    .catch(() => "");
  const fitness = await page
    .getByText("Fitness now")
    .locator("..")
    .innerText()
    .catch(() => "");
  const strengths = await page
    .getByText("Strengths")
    .locator("..")
    .innerText()
    .catch(() => "");
  const vulns = await page
    .getByText("Vulnerabilities")
    .locator("..")
    .innerText()
    .catch(() => "");

  // Canvas present?
  const canvasCount = await page.locator("canvas").count();

  // Pause for clean shot of 3D area
  await page.getByRole("button", { name: /Pause evolution/i }).click().catch(() => {});
  await page.locator("canvas").first().scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(400);
  const canvasParent = page.locator("canvas").first().locator("xpath=..");
  if (await canvasParent.count()) {
    await canvasParent.screenshot({ path: path.join(OUT, "12-creature-3d-closeup.png") });
    results.push({
      name: "12-creature-3d-closeup",
      file: path.join(OUT, "12-creature-3d-closeup.png"),
    });
  }

  // Rewards / schedule
  await page.goto(`${BASE}/rewards`, { waitUntil: "networkidle" });
  await shot(page, "13-rewards");

  await page.goto(`${BASE}/schedule`, { waitUntil: "networkidle" });
  await shot(page, "14-schedule");

  const theory = {
    canvasCount,
    fitness,
    phenotype,
    niche,
    strengths,
    vulnerabilities: vulns,
    forecast,
    conclusion,
    shots: results.map((r) => r.name),
  };

  fs.writeFileSync(
    path.join(OUT, "theory-extract.json"),
    JSON.stringify(theory, null, 2),
  );

  // Human-readable theory file
  const md = `# Genesis visual test — theoretical understanding

## 3D world
- WebGL canvases found: **${canvasCount}**

## Creature theory (from live UI)

### Fitness
${fitness || "_not extracted_"}

### Phenotype
${phenotype || "_not extracted_"}

### Niche
${niche || "_not extracted_"}

### Strengths
${strengths || "_not extracted_"}

### Vulnerabilities
${vulns || "_not extracted_"}

### Population forecast
${forecast || "_not extracted_"}

### Student conclusion
${conclusion || "_not extracted_"}

## Screenshots
${results.map((r) => `- ${r.name}.png`).join("\n")}
`;
  fs.writeFileSync(path.join(OUT, "THEORY.md"), md);

  console.log("\n=== THEORY EXTRACT ===\n");
  console.log(md);

  await browser.close();
  console.log("\nDone. Screenshots in", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
