# Yearwise

**Australian secondary learning app — Years 7–12**

Maths · Science · Chemistry · English · Languages · Unfiltered Australian History · Music · Computer Science (code → AI → defend)

## Features

- **Years 7–12** navigation with subject grids
- **Subjects:** Mathematics, Science, Chemistry, English, Languages, Australian History, Music
- **Language pathways:** Spanish, Russian, Chinese (Mandarin), German, Japanese, Khmer, Italian
- **Unfiltered Australian History** — First Nations sovereignty, invasion/colonisation, Frontier Wars, White Australia Policy, rights struggles, contested memory
- **Lessons** with structured content blocks (paragraphs, callouts, formulas, examples)
- **Quizzes** with instant feedback
- **Help me solve** — text step-by-step coach that will not return to the lesson until the student solves the original question alone **and** completes **5 independent** practice solves (using help on a practice item means that item does not count)
- **Progress** saved in the browser (`localStorage`)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Getting started

```bash
cd yearwise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
src/
  app/                 # Routes (home, year, subject, lesson)
  components/          # UI
  content/lessons.ts   # Curriculum bank (expand here)
  lib/                 # Types, subjects, progress helpers
```

## Expanding the curriculum

1. Add a `Lesson` object in `src/content/lessons.ts`
2. Set `year`, `subject`, and optional `language`
3. Write `content` blocks and optional `quiz` questions

State senior syllabuses (HSC, VCE, QCE, SACE, WACE, etc.) differ — use this bank as a base and align outcomes to your jurisdiction.

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm run dev`  | Development server |
| `npm run build`| Production build   |
| `npm run start`| Run production     |
| `npm run lint` | ESLint             |

## Licence

Private project — adjust as needed.
