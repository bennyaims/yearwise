/**
 * Student experience tour with Playwright video recording.
 * Shows signup, teaching content, quizzes, times tables, GeoGebra, CS pathway.
 * Not every Y7–12 lesson (hours of video) — a complete demo of what is taught.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "test-screenshots", "student-tour");
const VIDEO_DIR = path.join(OUT, "video-raw");
const BASE = process.env.YEARWISE_URL || "http://localhost:3000";

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const log = [];
function note(msg) {
  console.log(msg);
  log.push(msg);
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  note(`SHOT ${name}`);
  return file;
}

async function pause(page, ms = 1200) {
  await page.waitForTimeout(ms);
}

/** Answer all .option buttons in a multi-question quiz, then Submit */
async function completeQuiz(page) {
  const submit = page.getByRole("button", { name: /Submit answers/i });
  if (!(await submit.isVisible().catch(() => false))) {
    note("No Submit answers button — skip quiz");
    return;
  }

  // Each question block: click first .option (demo); better: try all until submit enables
  const questions = page.locator(".glass-soft, .glass-strong").filter({
    has: page.locator("button.option"),
  });
  const qCount = await page.locator("button.option").count();
  note(`Quiz options visible: ${qCount}`);

  // Group: for each question, options are sequential. Click option 0 of each group of 4-ish
  // Simpler approach: for every question card, click the first option
  const cards = page.locator("button.option");
  const n = await cards.count();
  // Click every 4th starting at 0,1,2... actually click first option per question
  // Questions render all options - we need one click per question.
  // Detect question headers "1. " "2. "
  const prompts = page.locator("p.font-medium.text-ink");
  const pCount = await prompts.count();
  for (let qi = 0; qi < pCount; qi++) {
    // Within the same parent, click first option
    const card = prompts.nth(qi).locator("xpath=ancestor::div[contains(@class,'glass')][1]");
    const opt = card.locator("button.option").first();
    if (await opt.isVisible().catch(() => false)) {
      await opt.click();
      await pause(page, 250);
    }
  }

  // Fallback: click options in strides
  if (await submit.isDisabled().catch(() => false)) {
    for (let i = 0; i < n; i += 4) {
      await cards.nth(i).click().catch(() => {});
      await pause(page, 150);
    }
  }

  await pause(page, 400);
  if (await submit.isEnabled().catch(() => true)) {
    await submit.click();
    await pause(page, 1200);
  } else {
    // last resort: click all first options by index
    for (let i = 0; i < Math.min(n, 80); i++) {
      await cards.nth(i).click().catch(() => {});
    }
    await pause(page, 300);
    await submit.click({ force: true }).catch(() => {});
    await pause(page, 1000);
  }
}

/** Guided learning: try each option until correct */
async function completeGuided(page, maxBeats = 14) {
  for (let beat = 0; beat < maxBeats; beat++) {
    if (
      await page
        .getByText(/Learning path complete/i)
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      note("Guided path complete");
      return true;
    }

    const checkBtn = page.getByRole("button", {
      name: /Check my understanding/i,
    });
    if (!(await checkBtn.isVisible().catch(() => false))) {
      note("No guided check — stop guided");
      return false;
    }

    const opts = page.locator("button.option");
    const n = await opts.count();
    let ok = false;
    for (let i = 0; i < n; i++) {
      await opts.nth(i).click();
      await pause(page, 200);
      await checkBtn.click();
      await pause(page, 400);
      const next = page.getByRole("button", {
        name: /Got it|Finish learning/i,
      });
      if (await next.first().isVisible().catch(() => false)) {
        await next.first().click();
        await pause(page, 700);
        ok = true;
        break;
      }
    }
    if (!ok) {
      note(`Guided stuck at beat ${beat}`);
      break;
    }
  }
  return true;
}

async function main() {
  note(`BASE ${BASE}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1400, height: 900 },
    },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  // Clear storage for clean signup
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "01-landing-or-signup");

  // ── Signup ─────────────────────────────────────────
  note("STEP signup");
  if (!page.url().includes("/signup")) {
    await page.goto(`${BASE}/signup`, { waitUntil: "networkidle" });
  }
  await pause(page, 800);
  await shot(page, "02-signup-profile");

  const nameInput = page.getByPlaceholder(/First name/i).or(page.locator('input[autocomplete="name"]'));
  if (await nameInput.first().isVisible().catch(() => false)) {
    await nameInput.first().fill("Demo Student");
  }
  // year select if present
  const yearSelect = page.locator("select").first();
  if (await yearSelect.isVisible().catch(() => false)) {
    await yearSelect.selectOption("7");
  }
  await shot(page, "03-signup-filled");
  await page.getByRole("button", { name: /Next.*Software|Software pack/i }).click();
  await pause(page, 1000);
  await shot(page, "04-software-pack-geogebra-blender");

  // scroll software list
  await page.evaluate(() => window.scrollBy(0, 400));
  await pause(page, 800);
  await shot(page, "05-software-downloads");
  await page.getByRole("button", { name: /Next.*Confirm|Confirm/i }).click();
  await pause(page, 800);
  await shot(page, "06-signup-confirm");
  await page.getByRole("button", { name: /Start curriculum|Start now/i }).first().click();
  await pause(page, 1500);
  await shot(page, "07-home-curriculum");

  // ── Year 7 hub ─────────────────────────────────────
  note("STEP year 7");
  await page.goto(`${BASE}/year/7`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "08-year7-progress-rules");

  // ── Maths integers — teaching ──────────────────────
  note("STEP maths integers teaching");
  await page.goto(`${BASE}/year/7/math/integers-and-number-line`, {
    waitUntil: "networkidle",
  });
  await pause(page, 1200);
  await shot(page, "09-math-integers-taught");
  await page.evaluate(() => window.scrollBy(0, 500));
  await pause(page, 900);
  await shot(page, "10-math-geogebra-fun-challenge");
  await page.evaluate(() => window.scrollBy(0, 600));
  await pause(page, 900);
  await shot(page, "11-math-videos-and-quiz");

  // complete quiz if present
  note("STEP complete math quiz");
  await completeQuiz(page, 25);
  await pause(page, 1000);
  await shot(page, "12-math-lesson-complete");

  // ── Second maths lesson if unlocked ────────────────
  note("STEP next math lesson if open");
  await page.goto(`${BASE}/year/7/math`, { waitUntil: "networkidle" });
  await pause(page, 800);
  await shot(page, "13-math-pathway-list");
  const lessonLink = page.locator('a[href*="/year/7/math/"]').nth(1);
  if (await lessonLink.isVisible().catch(() => false)) {
    await lessonLink.click();
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);
    await shot(page, "14-math-lesson-2-teaching");
    await completeQuiz(page, 20);
    await pause(page, 800);
    await shot(page, "15-math-lesson-2-done");
  }

  // ── Times tables gym ───────────────────────────────
  note("STEP times tables strategies");
  await page.goto(`${BASE}/times-tables`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "16-times-tables-strategies");
  await page.evaluate(() => window.scrollBy(0, 450));
  await pause(page, 900);
  await shot(page, "17-times-doubles-nines-breakup");
  // open a strategy
  await page.getByRole("button", { name: /Nines|Doubles|Break it up/i }).first().click().catch(() => {});
  await pause(page, 900);
  await shot(page, "18-times-strategy-detail");
  await page.evaluate(() => window.scrollBy(0, 800));
  await pause(page, 800);
  await shot(page, "19-times-tables-test");
  await completeQuiz(page, 18);
  await pause(page, 800);
  await shot(page, "20-times-drill-complete");

  // ── GeoGebra design studio ─────────────────────────
  note("STEP geogebra designs");
  await page.goto(`${BASE}/game/geogebra`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "21-geogebra-beginner-designs");
  await page.getByRole("button", { name: /Star burst|Number-line|mandala/i }).first().click().catch(() => {});
  await pause(page, 900);
  await page.evaluate(() => window.scrollBy(0, 400));
  await pause(page, 800);
  await shot(page, "22-geogebra-steps-taught");
  await page.getByRole("button", { name: /Intermediate|Advanced|Expert/i }).first().click().catch(() => {});
  await pause(page, 800);
  await shot(page, "23-geogebra-higher-levels");

  // ── Science cells guided teaching ──────────────────
  note("STEP science cells guided");
  await page.goto(`${BASE}/year/7/science/cells-as-units`, {
    waitUntil: "networkidle",
  });
  await pause(page, 1200);
  await shot(page, "24-science-cells-guided-start");
  await completeGuided(page, 8);
  await pause(page, 800);
  await shot(page, "25-science-cells-after-guided");
  await page.evaluate(() => window.scrollBy(0, 500));
  await pause(page, 800);
  await shot(page, "26-science-content-videos");
  await completeQuiz(page, 20);
  await pause(page, 800);
  await shot(page, "27-science-lesson-complete");

  // ── CS pathway choice ──────────────────────────────
  note("STEP CS pathway");
  await page.goto(`${BASE}/year/7/computerscience`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "28-cs-choose-pathway");
  await page.getByRole("button", { name: /Software & App Coding|Creative Computing/i }).first().click();
  await pause(page, 1200);
  await shot(page, "29-cs-pathway-lessons");
  const csLesson = page.locator('a[href*="/year/7/computerscience/"]').first();
  if (await csLesson.isVisible().catch(() => false)) {
    await csLesson.click();
    await page.waitForLoadState("networkidle");
    await pause(page, 1000);
    await shot(page, "30-cs-computational-thinking-taught");
    await page.evaluate(() => window.scrollBy(0, 400));
    await pause(page, 800);
    await shot(page, "31-cs-lesson-detail");
    await completeQuiz(page, 15);
    await pause(page, 800);
    await shot(page, "32-cs-lesson-complete");
  }

  // ── Build Lab + Genesis ────────────────────────────
  note("STEP build lab");
  await page.goto(`${BASE}/game`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "33-build-lab-hub");
  await page.goto(`${BASE}/labs/genesis`, { waitUntil: "networkidle" });
  await pause(page, 2000);
  await shot(page, "34-genesis-science-world");
  await page.evaluate(() => window.scrollBy(0, 500));
  await pause(page, 1000);
  await shot(page, "35-genesis-habitation-teaching");

  // ── Year exam (cumulative) ─────────────────────────
  note("STEP year exam info");
  await page.goto(`${BASE}/year/7/exam`, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "36-year-exam-rules-memory");
  await page.evaluate(() => window.scrollBy(0, 300));
  await pause(page, 800);
  await shot(page, "37-year-exam-questions");

  // ── Tools pack ─────────────────────────────────────
  await page.goto(`${BASE}/tools`, { waitUntil: "networkidle" });
  await pause(page, 900);
  await shot(page, "38-tools-geogebra-blender");

  // ── About / curriculum framing ─────────────────────
  await page.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  await pause(page, 900);
  await shot(page, "39-about-curriculum");

  // Final home
  await page.goto(BASE, { waitUntil: "networkidle" });
  await pause(page, 1000);
  await shot(page, "40-tour-end-home");

  await context.close();
  await browser.close();

  // Move video file to a stable name
  const videos = fs.readdirSync(VIDEO_DIR).filter((f) => f.endsWith(".webm"));
  let finalVideo = null;
  if (videos[0]) {
    finalVideo = path.join(OUT, "yearwise-student-tour.webm");
    fs.copyFileSync(path.join(VIDEO_DIR, videos[0]), finalVideo);
    note(`VIDEO ${finalVideo}`);
  }

  fs.writeFileSync(
    path.join(OUT, "tour-log.txt"),
    log.join("\n") +
      "\n\nNOTE: Full Y7–12 every lesson would be multi-hour. This recording is a complete student-facing demo of teaching styles, tests, software, pathways, and labs.\n",
  );
  note("DONE");
  console.log(JSON.stringify({ out: OUT, video: finalVideo, shots: log.filter((l) => l.startsWith("SHOT")).length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
