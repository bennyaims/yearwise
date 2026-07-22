import type { Lesson, LanguageId, SubjectId, YearLevel } from "@/lib/types";
import { buildComputerScienceLessons } from "./cs-pathway";
import { buildFluencyLanguageLessons } from "./language-pathway";

/**
 * Starter curriculum bank for Yearwise.
 * Structured for Australian Curriculum Years 7–12.
 * Languages: fluency pathway. CS: code → build AI → defend against dominance.
 */
export const LESSONS: Lesson[] = [
  // ─── MATH Year 7 · Integers pathway (30-min blocks) ───
  {
    id: "integers-and-number-line",
    title: "Integers & the Number Line",
    summary:
      "30-min block: positive and negative numbers, ordering, zero, and real-world contexts.",
    estimatedMinutes: 30,
    year: 7,
    subject: "math",
    strand: "Number · Integers",
    content: [
      {
        type: "heading",
        text: "What are integers?",
      },
      {
        type: "paragraph",
        text: "Integers are whole numbers and their negatives: …, −3, −2, −1, 0, 1, 2, 3, …. They appear in temperature, bank balances, elevation and sport scores.",
      },
      {
        type: "list",
        items: [
          "Zero is neither positive nor negative.",
          "Every integer has an opposite (additive inverse).",
          "On a number line, numbers increase from left to right.",
          "Farther left = smaller; farther right = larger.",
        ],
      },
      {
        type: "example",
        title: "Ordering",
        body: "Order from least to greatest: −4, 2, −1, 0 → −4, −1, 0, 2",
      },
      {
        type: "callout",
        tone: "tip",
        text: "When comparing negatives, the number farther left is smaller: −8 < −3. Finish the quiz to unlock the next lesson. For fun: build a Number-line city skyline in GeoGebra (Build Lab → GeoGebra design studio).",
      },
      {
        type: "callout",
        tone: "tip",
        text: "🎨 GeoGebra fun: plot integers on the x-axis and raise “buildings” with height |n|. Colour positives warm and negatives cool — maths you can see.",
      },
    ],
    depthContent: [
      {
        type: "heading",
        text: "In depth: comparing and real contexts",
      },
      {
        type: "paragraph",
        text: "When both numbers are negative, the one with the larger absolute value is smaller (farther from zero on the left). So −20 is colder and “more negative” than −5.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Draw a number line from −10 to 10 and place four integers.",
          "Write two real-world sentences that use negatives (money, height, temperature).",
          "State the opposite of each integer you placed.",
          "GeoGebra: make the skyline design, then screenshot for your folio.",
        ],
      },
      {
        type: "example",
        title: "Worked context",
        body: "A scuba diver is at −12 m, then rises 5 m. New depth: −12 + 5 = −7 m (still below sea level).",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which is smaller: −5 or −2?",
        options: ["−5", "−2", "They are equal", "Cannot tell"],
        correctIndex: 0,
        explanation: "−5 is further left on the number line, so it is smaller.",
      },
      {
        id: "q2",
        prompt: "What is the opposite of −7?",
        options: ["−7", "0", "7", "1/7"],
        correctIndex: 2,
        explanation: "The additive inverse of −7 is 7.",
      },
      {
        id: "q3",
        prompt: "Which list is ordered from smallest to largest?",
        options: [
          "3, 0, −2, −5",
          "−5, −2, 0, 3",
          "−2, −5, 0, 3",
          "0, −5, −2, 3",
        ],
        correctIndex: 1,
        explanation: "Left to right on the number line: −5, −2, 0, 3.",
      },
      {
        id: "q4",
        prompt: "Zero is:",
        options: [
          "Positive",
          "Negative",
          "Neither positive nor negative",
          "Only a fraction",
        ],
        correctIndex: 2,
        explanation: "Zero sits between negatives and positives.",
      },
      {
        id: "q5",
        prompt: "Which is greater: −11 or −8?",
        options: ["−11", "−8", "Equal", "Neither"],
        correctIndex: 1,
        explanation: "−8 is to the right of −11.",
      },
      {
        id: "q6",
        prompt: "A temperature of −3 °C is colder than 2 °C. Which statement matches the number line?",
        options: [
          "−3 > 2",
          "−3 < 2",
          "−3 = 2",
          "You cannot compare them",
        ],
        correctIndex: 1,
        explanation: "−3 is left of 2, so −3 < 2 (colder / smaller).",
      },
      {
        id: "q7",
        prompt: "Which integer is farthest left?",
        options: ["−1", "−9", "4", "0"],
        correctIndex: 1,
        explanation: "−9 is the most negative of these options.",
      },
      {
        id: "q8",
        prompt: "The opposite of 15 is:",
        options: ["15", "−15", "0", "1/15"],
        correctIndex: 1,
        explanation: "15 + (−15) = 0.",
      },
    ],
  },
  {
    id: "integer-patterns-counting",
    title: "Integer Patterns: Count by Any Step",
    summary:
      "30-min block: count from one integer to another by 1, 2, 3, 5… negative ↔ positive through zero.",
    estimatedMinutes: 30,
    year: 7,
    subject: "math",
    strand: "Number · Integers",
    content: [
      {
        type: "heading",
        text: "Patterns on the number line",
      },
      {
        type: "paragraph",
        text: "A counting pattern starts at an integer and keeps adding the same step. The step can be positive (moving right / up) or negative (moving left / down). Patterns do not stop at zero — they pass straight through.",
      },
      {
        type: "example",
        title: "Count by +3 from −6",
        body: "−6, −3, 0, 3, 6, 9 … (each term is 3 more than the last)",
      },
      {
        type: "example",
        title: "Count by −2 from 5",
        body: "5, 3, 1, −1, −3, −5 … (each term is 2 less)",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Write the start number.",
          "Decide the step (e.g. +4 or −5).",
          "Add the step again and again.",
          "Check: difference between neighbours is always the same.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "After this lesson, open Daily patterns for randomised 30-min drills that change every day.",
      },
    ],
    quiz: [
      {
        id: "p1",
        prompt: "Pattern: −4, −1, 2, 5, … What is the step?",
        options: ["+2", "+3", "−3", "+1"],
        correctIndex: 1,
        explanation: "Each term increases by 3: −4 + 3 = −1, and so on.",
      },
      {
        id: "p2",
        prompt: "Count by +2 from −5. Which sequence is correct?",
        options: [
          "−5, −3, −1, 1, 3",
          "−5, −7, −9, −11",
          "−5, −4, −3, −2",
          "−5, 2, 4, 6",
        ],
        correctIndex: 0,
        explanation: "Add 2 each time: −5, −3, −1, 1, 3.",
      },
      {
        id: "p3",
        prompt: "−8, −3, 2, 7, … Next term?",
        options: ["9", "10", "12", "5"],
        correctIndex: 2,
        explanation: "Step is +5. 7 + 5 = 12.",
      },
      {
        id: "p4",
        prompt: "Count by −4 from 6. Third term is:",
        options: ["6", "2", "−2", "−6"],
        correctIndex: 2,
        explanation: "6, 2, −2 — third term is −2.",
      },
      {
        id: "p5",
        prompt: "Fill the blank: −10, −5, □, 5, 10 (count by +5)",
        options: ["0", "−1", "1", "−15"],
        correctIndex: 0,
        explanation: "−5 + 5 = 0. Pattern crosses zero.",
      },
      {
        id: "p6",
        prompt: "Start at −2. Jump +3 four times. Where do you land?",
        options: ["7", "10", "1", "−14"],
        correctIndex: 1,
        explanation: "−2 + 4×3 = −2 + 12 = 10.",
      },
      {
        id: "p7",
        prompt: "Which pattern counts down by 1 through zero?",
        options: [
          "2, 1, 0, −1, −2",
          "2, 1, −1, −2 (skips 0)",
          "0, 1, 2, 3 only",
          "−2, −1, 1, 2 (skips 0)",
        ],
        correctIndex: 0,
        explanation: "Step −1 includes every integer, including zero.",
      },
      {
        id: "p8",
        prompt: "Common difference of 9, 4, −1, −6 is:",
        options: ["+5", "−5", "+4", "−9"],
        correctIndex: 1,
        explanation: "4 − 9 = −5; each step is −5.",
      },
      {
        id: "p9",
        prompt: "Count by +10 from −30: −30, −20, −10, □",
        options: ["0", "10", "−40", "20"],
        correctIndex: 0,
        explanation: "−10 + 10 = 0.",
      },
      {
        id: "p10",
        prompt: "True or false: a pattern can go from negative numbers into positive numbers.",
        options: [
          "True — if the step is positive",
          "False — patterns cannot cross zero",
          "Only if you skip zero",
          "Only with fractions",
        ],
        correctIndex: 0,
        explanation: "Positive steps move right across zero into positives.",
      },
    ],
  },
  {
    id: "integers-compare-order",
    title: "Comparing & Ordering Integers",
    summary: "30-min block: inequalities, least/greatest, real-life orderings.",
    estimatedMinutes: 30,
    year: 7,
    subject: "math",
    strand: "Number · Integers",
    content: [
      {
        type: "heading",
        text: "Compare with care",
      },
      {
        type: "paragraph",
        text: "Use < (less than) and > (greater than). For negatives, “larger magnitude” means more negative — which is actually smaller. Example: −20 < −3.",
      },
      {
        type: "list",
        items: [
          "Place both numbers on a mental number line.",
          "The one on the left is smaller.",
          "Between negatives, the one closer to zero is greater.",
        ],
      },
      {
        type: "example",
        title: "Rank elevations",
        body: "Sea level 0 m, trench −400 m, hill 200 m → order: −400, 0, 200.",
      },
    ],
    quiz: [
      {
        id: "c1",
        prompt: "Which is true?",
        options: ["−7 > −2", "−7 < −2", "−7 = −2", "−7 > 0"],
        correctIndex: 1,
        explanation: "−7 is left of −2.",
      },
      {
        id: "c2",
        prompt: "Greatest integer: −15, −4, −19, −1",
        options: ["−15", "−4", "−19", "−1"],
        correctIndex: 3,
        explanation: "−1 is closest to zero among these negatives.",
      },
      {
        id: "c3",
        prompt: "Least integer: 3, −8, 0, −1",
        options: ["3", "−8", "0", "−1"],
        correctIndex: 1,
        explanation: "−8 is farthest left.",
      },
      {
        id: "c4",
        prompt: "Order ascending: 4, −6, −1, 2",
        options: [
          "4, 2, −1, −6",
          "−6, −1, 2, 4",
          "−1, −6, 2, 4",
          "−6, 2, −1, 4",
        ],
        correctIndex: 1,
        explanation: "−6, −1, 2, 4.",
      },
      {
        id: "c5",
        prompt: "A bank balance of −$50 is less than −$20. True?",
        options: ["True", "False", "Only sometimes", "Cannot compare money"],
        correctIndex: 0,
        explanation: "−50 < −20; more debt is a smaller integer.",
      },
      {
        id: "c6",
        prompt: "Which symbol makes −3 □ 5 true?",
        options: [">", "<", "=", "×"],
        correctIndex: 1,
        explanation: "−3 is less than 5.",
      },
      {
        id: "c7",
        prompt: "Between −12 and −9, which is larger?",
        options: ["−12", "−9", "Equal", "Neither is an integer"],
        correctIndex: 1,
        explanation: "−9 > −12.",
      },
      {
        id: "c8",
        prompt: "Insert the integers in order: __ , −2, __ , 3 using −5 and 0",
        options: [
          "−5, −2, 0, 3",
          "0, −2, −5, 3",
          "−2, −5, 0, 3",
          "−5, 0, −2, 3",
        ],
        correctIndex: 0,
        explanation: "−5 < −2 < 0 < 3.",
      },
    ],
  },
  {
    id: "integers-opposites-absolute",
    title: "Opposites & Distance from Zero",
    summary: "30-min block: additive inverses and absolute value ideas.",
    estimatedMinutes: 30,
    year: 7,
    subject: "math",
    strand: "Number · Integers",
    content: [
      {
        type: "heading",
        text: "Opposites cancel to zero",
      },
      {
        type: "paragraph",
        text: "The opposite of n is −n. Absolute value |n| is the distance from zero (always ≥ 0). |−7| = 7 and |7| = 7.",
      },
      {
        type: "formula",
        latex: "n + (−n) = 0    ·    |n| = distance from 0",
      },
      {
        type: "callout",
        tone: "info",
        text: "Absolute value is not “drop the sign blindly” in every topic later — but for a single integer it is the non-negative distance from zero.",
      },
    ],
    quiz: [
      {
        id: "a1",
        prompt: "Opposite of 0 is:",
        options: ["1", "−1", "0", "10"],
        correctIndex: 2,
        explanation: "0 is its own opposite.",
      },
      {
        id: "a2",
        prompt: "|−14| equals:",
        options: ["−14", "14", "0", "1/14"],
        correctIndex: 1,
        explanation: "Distance from zero is 14.",
      },
      {
        id: "a3",
        prompt: "Which pair are opposites?",
        options: ["6 and 3", "−9 and 9", "−2 and −2", "5 and 0"],
        correctIndex: 1,
        explanation: "−9 + 9 = 0.",
      },
      {
        id: "a4",
        prompt: "Opposite of the opposite of −4 is:",
        options: ["4", "−4", "0", "8"],
        correctIndex: 1,
        explanation: "Opposite of −4 is 4; opposite of that is −4 again.",
      },
      {
        id: "a5",
        prompt: "Which has the greater absolute value?",
        options: ["−3", "2", "They are equal", "0"],
        correctIndex: 0,
        explanation: "|−3| = 3 > |2| = 2.",
      },
      {
        id: "a6",
        prompt: "Two numbers sum to zero. One is −11. The other is:",
        options: ["−11", "11", "0", "1"],
        correctIndex: 1,
        explanation: "They are opposites.",
      },
      {
        id: "a7",
        prompt: "|0| is:",
        options: ["Undefined", "0", "1", "−0 only"],
        correctIndex: 1,
        explanation: "Distance from zero to zero is 0.",
      },
      {
        id: "a8",
        prompt: "On a number line, 8 and −8 are:",
        options: [
          "The same point",
          "Same distance from zero, opposite sides",
          "Both positive",
          "Not integers",
        ],
        correctIndex: 1,
        explanation: "Mirror images across zero.",
      },
    ],
  },
  {
    id: "integers-mixed-practice",
    title: "Integers Mixed Practice Block",
    summary:
      "30-min checkpoint: compare, order, patterns, opposites — longer quiz before weekly test.",
    estimatedMinutes: 30,
    year: 7,
    subject: "math",
    strand: "Number · Integers",
    content: [
      {
        type: "heading",
        text: "Pull it together",
      },
      {
        type: "paragraph",
        text: "This block is mostly practice. Work carefully. Use Help me solve if stuck — then finish enough independent practice that the ideas stick.",
      },
      {
        type: "list",
        items: [
          "Number line position decides size",
          "Patterns use a constant step",
          "Opposites sum to zero",
          "Zero is a normal step on the line",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Complete all questions. After this pathway, sit the weekly test for stars and badges.",
      },
    ],
    quiz: [
      {
        id: "m1",
        prompt: "−1, 2, 5, 8, … step is:",
        options: ["+2", "+3", "−3", "+4"],
        correctIndex: 1,
        explanation: "Each term +3.",
      },
      {
        id: "m2",
        prompt: "Smallest: −2, 5, −18, 0",
        options: ["−2", "5", "−18", "0"],
        correctIndex: 2,
        explanation: "−18 is farthest left.",
      },
      {
        id: "m3",
        prompt: "Opposite of −25:",
        options: ["−25", "25", "0", "1/25"],
        correctIndex: 1,
        explanation: "−25 + 25 = 0.",
      },
      {
        id: "m4",
        prompt: "Count by −3 from 4: 4, 1, −2, □",
        options: ["−5", "−4", "1", "5"],
        correctIndex: 0,
        explanation: "−2 + (−3) = −5.",
      },
      {
        id: "m5",
        prompt: "True: −0.5 is an integer?",
        options: ["True", "False", "Only in winter", "Only if positive"],
        correctIndex: 1,
        explanation: "Integers are whole numbers; −0.5 is not an integer.",
      },
      {
        id: "m6",
        prompt: "Which shows ascending order?",
        options: [
          "1, −3, −7",
          "−7, −3, 1",
          "−3, 1, −7",
          "−7, 1, −3",
        ],
        correctIndex: 1,
        explanation: "−7 < −3 < 1.",
      },
      {
        id: "m7",
        prompt: "|−9| + opposite of 9 =",
        options: ["0", "18", "−18", "9"],
        correctIndex: 0,
        explanation: "9 + (−9) = 0.",
      },
      {
        id: "m8",
        prompt: "Start −7, step +4, five terms. Fifth term?",
        options: ["5", "9", "1", "−3"],
        correctIndex: 1,
        explanation: "−7, −3, 1, 5, 9 → fifth is 9.",
      },
      {
        id: "m9",
        prompt: "Which is false?",
        options: ["−4 < 0", "3 > −10", "−8 > −2", "−1 < 1"],
        correctIndex: 2,
        explanation: "−8 is less than −2, so −8 > −2 is false.",
      },
      {
        id: "m10",
        prompt: "Pattern through zero: −6, −2, 2, 6 uses step:",
        options: ["+2", "+4", "−4", "+6"],
        correctIndex: 1,
        explanation: "Common difference +4.",
      },
      {
        id: "m11",
        prompt: "A lift goes from floor −2 to floor 3. How many floors up?",
        options: ["1", "5", "3", "2"],
        correctIndex: 1,
        explanation: "3 − (−2) = 5 floors up.",
      },
      {
        id: "m12",
        prompt: "Best first step when stuck on integers?",
        options: [
          "Guess C",
          "Sketch a number line and mark the points",
          "Ignore negatives",
          "Multiply by zero",
        ],
        correctIndex: 1,
        explanation: "The number line makes order and patterns visible.",
      },
    ],
  },
  {
    id: "linear-equations",
    title: "Solving Linear Equations",
    summary: "Balance method, inverse operations, and checking solutions.",
    estimatedMinutes: 25,
    year: 8,
    subject: "math",
    strand: "Algebra",
    content: [
      {
        type: "heading",
        text: "The balance idea",
      },
      {
        type: "paragraph",
        text: "An equation is a balance: whatever you do to one side, do to the other. Use inverse operations to isolate the unknown.",
      },
      {
        type: "formula",
        latex: "2x + 5 = 17  →  2x = 12  →  x = 6",
        note: "Subtract 5, then divide by 2.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Simplify each side if needed.",
          "Move constants away from the variable.",
          "Divide or multiply to make the coefficient 1.",
          "Substitute back to check.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Solve: 3x − 4 = 11",
        options: ["x = 3", "x = 5", "x = 7", "x = 15"],
        correctIndex: 1,
        explanation: "Add 4 to both sides: 3x = 15. Divide both sides by 3: x = 5.",
        solveSteps: [
          {
            id: "le-1",
            title: "Step 1 — Name the goal",
            teaching:
              "You need the value of x that makes 3x − 4 = 11 true.\n\nThink of the equation as a balanced scale: whatever you do to one side, do to the other.",
            check: {
              prompt: "What are we trying to find?",
              options: [
                "The value of x",
                "Only the number 11",
                "A random integer",
                "The letter y",
              ],
              correctIndex: 0,
              hint: "The unknown is x — isolate it.",
            },
          },
          {
            id: "le-2",
            title: "Step 2 — Undo the − 4",
            teaching:
              "3x has 4 subtracted from it. The inverse of subtract 4 is add 4.\n\n3x − 4 + 4 = 11 + 4\n3x = 15",
            check: {
              prompt: "After adding 4 to both sides, you get:",
              options: ["3x = 7", "3x = 15", "x − 4 = 11", "3x = 11"],
              correctIndex: 1,
              hint: "11 + 4 = 15, so 3x = 15.",
            },
          },
          {
            id: "le-3",
            title: "Step 3 — Undo the × 3",
            teaching:
              "x is multiplied by 3. Divide both sides by 3:\n\n3x / 3 = 15 / 3\nx = 5",
            check: {
              prompt: "x equals:",
              options: ["3", "5", "7", "15"],
              correctIndex: 1,
              hint: "15 ÷ 3 = 5.",
            },
          },
          {
            id: "le-4",
            title: "Step 4 — Check by substituting",
            teaching:
              "Put x = 5 back into the original:\n3(5) − 4 = 15 − 4 = 11. ✓\n\nIt works. Options like x = 3 give 5, not 11 — eliminate them.",
            check: {
              prompt: "Which check confirms x = 5?",
              options: [
                "3(5) − 4 = 11",
                "3(5) − 4 = 0",
                "5 − 4 = 11",
                "3 + 5 = 11",
              ],
              correctIndex: 0,
              hint: "Substitute into the original equation.",
            },
          },
        ],
        practiceVariants: [
          {
            id: "q1-p1",
            prompt: "Solve: 2x + 3 = 11",
            options: ["x = 3", "x = 4", "x = 7", "x = 14"],
            correctIndex: 1,
            explanation: "2x = 8, so x = 4.",
          },
          {
            id: "q1-p2",
            prompt: "Solve: 5x − 10 = 20",
            options: ["x = 2", "x = 4", "x = 6", "x = 30"],
            correctIndex: 2,
            explanation: "5x = 30, so x = 6.",
          },
          {
            id: "q1-p3",
            prompt: "Solve: 4x + 1 = 13",
            options: ["x = 2", "x = 3", "x = 4", "x = 12"],
            correctIndex: 1,
            explanation: "4x = 12, so x = 3.",
          },
          {
            id: "q1-p4",
            prompt: "Solve: 6x − 6 = 18",
            options: ["x = 2", "x = 3", "x = 4", "x = 12"],
            correctIndex: 2,
            explanation: "6x = 24, so x = 4.",
          },
          {
            id: "q1-p5",
            prompt: "Solve: 3x + 6 = 21",
            options: ["x = 3", "x = 5", "x = 7", "x = 9"],
            correctIndex: 1,
            explanation: "3x = 15, so x = 5.",
          },
        ],
      },
    ],
  },
  {
    id: "pythagoras",
    title: "Pythagoras' Theorem",
    summary: "Right-angled triangles, hypotenuse, and applications.",
    estimatedMinutes: 25,
    year: 9,
    subject: "math",
    strand: "Geometry",
    content: [
      {
        type: "paragraph",
        text: "In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
      },
      {
        type: "formula",
        latex: "a² + b² = c²",
        note: "c is the side opposite the right angle (hypotenuse).",
      },
      {
        type: "example",
        title: "Find the hypotenuse",
        body: "Legs 3 and 4: c = √(9 + 16) = √25 = 5. The classic 3-4-5 triple.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A right triangle has legs 6 and 8. What is the hypotenuse?",
        options: ["10", "12", "14", "√14"],
        correctIndex: 0,
        explanation: "√(36+64)=√100=10 (scaled 3-4-5).",
      },
    ],
  },
  {
    id: "quadratic-intro",
    title: "Introduction to Quadratics",
    summary: "Parabolas, factoring, and the quadratic formula.",
    estimatedMinutes: 30,
    year: 10,
    subject: "math",
    strand: "Algebra",
    content: [
      {
        type: "paragraph",
        text: "A quadratic has the form ax² + bx + c (a ≠ 0). Its graph is a parabola. Roots are where y = 0.",
      },
      {
        type: "formula",
        latex: "x = (−b ± √(b² − 4ac)) / (2a)",
        note: "Discriminant Δ = b² − 4ac tells how many real roots.",
      },
      {
        type: "list",
        items: [
          "Δ > 0: two real roots",
          "Δ = 0: one repeated root",
          "Δ < 0: no real roots (complex pair in senior maths)",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "For x² − 5x + 6 = 0, the roots are:",
        options: ["1 and 6", "2 and 3", "−2 and −3", "5 and 6"],
        correctIndex: 1,
        explanation: "(x−2)(x−3)=0 → x=2 or 3.",
      },
    ],
  },
  {
    id: "calculus-limits",
    title: "Limits & Rates of Change",
    summary: "Foundation for differential calculus — Year 11/12 pathway.",
    estimatedMinutes: 30,
    year: 11,
    subject: "math",
    strand: "Calculus",
    content: [
      {
        type: "paragraph",
        text: "A limit describes the value a function approaches as the input approaches a point. Average rate of change becomes instantaneous rate of change as the interval shrinks.",
      },
      {
        type: "formula",
        latex: "f'(x) = lim(h→0) [f(x+h) − f(x)] / h",
        note: "Definition of the derivative.",
      },
      {
        type: "callout",
        tone: "info",
        text: "In Australian senior maths, derivative rules (power, product, chain) build from this idea — always connect back to rate of change.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The derivative of x² is:",
        options: ["x", "2x", "x²", "2"],
        correctIndex: 1,
        explanation: "Power rule: d/dx(xⁿ) = n xⁿ⁻¹ → 2x.",
      },
    ],
  },
  {
    id: "probability-distributions",
    title: "Probability Distributions",
    summary: "Discrete vs continuous, expected value, and binomial model.",
    estimatedMinutes: 30,
    year: 12,
    subject: "math",
    strand: "Statistics & Probability",
    content: [
      {
        type: "paragraph",
        text: "A probability distribution assigns probabilities to outcomes. For discrete random variables, expected value E(X) = Σ x·P(x).",
      },
      {
        type: "formula",
        latex: "P(X = k) = C(n,k) p^k (1−p)^{n−k}",
        note: "Binomial probability for n independent trials.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A fair coin is tossed 3 times. P(exactly 2 heads) is:",
        options: ["1/8", "2/8", "3/8", "4/8"],
        correctIndex: 2,
        explanation: "C(3,2)×(1/2)³ = 3/8.",
      },
    ],
  },

  // ─── SCIENCE ────────────────────────────────────────
  {
    id: "cells-as-units",
    title: "Cells: The Units of Life",
    summary:
      "Guided path: cell → organelle jobs → photosynthesis → plant vs animal. Quiz unlocks only after you pass each teaching check.",
    estimatedMinutes: 35,
    year: 7,
    subject: "science",
    strand: "Biological sciences",
    // learnPath injected via CELLS_LEARN_PATH in LessonClient (deep teach loop)
    content: [
      {
        type: "heading",
        text: "What is a cell?",
      },
      {
        type: "paragraph",
        text: "A cell is the smallest unit of life that can carry out the processes of living things. Your body, a plant, and a bacterium are all built from cells. Most cells are microscopic and need a microscope to see clearly.",
      },
      {
        type: "heading",
        text: "Cell theory (three ideas to remember)",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "All living things are made of one or more cells.",
          "The cell is the basic unit of structure and function in living things.",
          "New cells are produced only from existing cells (they divide).",
        ],
      },
      {
        type: "heading",
        text: "What is an organelle?",
      },
      {
        type: "paragraph",
        text: "An organelle is a specialised structure inside a cell that does a particular job — like organs do jobs in a body. If the question asks “which organelle…”, it means “which cell part…”.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Learn the job of each organelle by name. Quiz questions usually match one name to one job.",
      },
      {
        type: "heading",
        text: "Key organelles and their jobs",
      },
      {
        type: "list",
        items: [
          "Nucleus — control centre; contains DNA (genetic instructions).",
          "Cell membrane — thin boundary that controls what enters and leaves the cell. All cells have one.",
          "Cytoplasm — jelly-like fluid where many chemical reactions happen.",
          "Mitochondrion (plural: mitochondria) — releases energy from food by cellular respiration. Often called the “powerhouse” of the cell. Does NOT do photosynthesis.",
          "Ribosome — builds proteins using instructions from DNA/RNA.",
          "Chloroplast — found in plant (and some algae) cells only. Contains green chlorophyll and is the site of photosynthesis (makes food from light).",
          "Cell wall — rigid outer layer outside the membrane in plant cells (support/protection). Animal cells do not have a cell wall.",
          "Large vacuole — storage of water and dissolved substances; large in plant cells.",
        ],
      },
      {
        type: "heading",
        text: "Photosynthesis — what, where, why",
      },
      {
        type: "paragraph",
        text: "Photosynthesis is the process plants use to make their own food (glucose) using light energy. It mainly happens in the leaves, inside chloroplasts.",
      },
      {
        type: "formula",
        latex: "carbon dioxide + water  →  glucose + oxygen   (using light energy)",
        note: "Word equation for photosynthesis. Chlorophyll in chloroplasts captures the light.",
      },
      {
        type: "list",
        items: [
          "Where? Chloroplasts (organelle).",
          "What is needed? Light, carbon dioxide (CO₂), water (H₂O), chlorophyll.",
          "What is made? Glucose (food/energy store) and oxygen (released).",
          "Who has chloroplasts? Plant cells (green parts). Animal cells do not — animals eat food instead of photosynthesising.",
        ],
      },
      {
        type: "example",
        title: "Match organelle → job (exam style)",
        body: "Photosynthesis → chloroplast. Energy from food (respiration) → mitochondrion. Control / DNA → nucleus. Make proteins → ribosome.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Do not mix up mitochondrion and chloroplast. Mitochondria release energy from food. Chloroplasts capture light to make food. Only plant cells have chloroplasts.",
      },
      {
        type: "heading",
        text: "Plant cells vs animal cells",
      },
      {
        type: "paragraph",
        text: "Both plant and animal cells usually have: nucleus, cytoplasm, cell membrane, mitochondria, ribosomes.",
      },
      {
        type: "list",
        items: [
          "Plant cells also have: cell wall, chloroplasts (in green parts), large permanent vacuole.",
          "Animal cells do not have a cell wall or chloroplasts; vacuoles (if present) are usually small.",
        ],
      },
      {
        type: "example",
        title: "Quick check before the quiz",
        body: "Q: Which organelle performs photosynthesis? A: Chloroplast — because that is where chlorophyll captures light and glucose is made. Not the nucleus (DNA), not the mitochondrion (respiration), not the ribosome (proteins).",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which organelle performs photosynthesis?",
        options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
        correctIndex: 2,
        explanation:
          "Photosynthesis happens in chloroplasts. They contain chlorophyll, which captures light energy so the plant can make glucose. Mitochondria do respiration (energy from food), the nucleus holds DNA, and ribosomes make proteins.",
        solveSteps: [
          {
            id: "c1",
            title: "Step 1 — What is the question asking?",
            teaching:
              "You need the organelle (cell part) whose job is photosynthesis — making food using light.",
            check: {
              prompt: "Photosynthesis is mainly about:",
              options: [
                "Making proteins",
                "Making food using light",
                "Storing DNA only",
                "Controlling what enters the cell",
              ],
              correctIndex: 1,
              hint: "Photo = light; synthesis = making.",
            },
          },
          {
            id: "c2",
            title: "Step 2 — Match each option to its real job",
            teaching:
              "Mitochondrion → respiration (energy from food).\nNucleus → DNA / control.\nChloroplast → photosynthesis (light → glucose).\nRibosome → proteins.\n\nOnly one matches photosynthesis.",
            check: {
              prompt: "Which part contains chlorophyll and uses light?",
              options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
              correctIndex: 2,
              hint: "Green plant organelle = chloroplast.",
            },
          },
          {
            id: "c3",
            title: "Step 3 — Choose and check",
            teaching:
              "Answer: chloroplast. Animal cells lack chloroplasts, which is why only plants (and some algae) photosynthesise this way.",
            check: {
              prompt: "Final answer — organelle for photosynthesis:",
              options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
              correctIndex: 2,
              hint: "Chloroplast.",
            },
          },
        ],
        practiceVariants: [
          {
            id: "q1-p1",
            prompt: "Chloroplasts are mainly found in:",
            options: [
              "Animal cells only",
              "Plant cells (green parts)",
              "Only the nucleus",
              "Ribosomes",
            ],
            correctIndex: 1,
            explanation: "Chloroplasts occur in plant cells that photosynthesise.",
          },
          {
            id: "q1-p2",
            prompt: "Which organelle is the site of cellular respiration (energy from food)?",
            options: ["Chloroplast", "Mitochondrion", "Cell wall", "Vacuole"],
            correctIndex: 1,
            explanation: "Mitochondria release energy from food.",
          },
          {
            id: "q1-p3",
            prompt: "Chlorophyll is important because it:",
            options: [
              "Builds cell walls",
              "Captures light energy for photosynthesis",
              "Stores DNA",
              "Makes proteins",
            ],
            correctIndex: 1,
            explanation: "Chlorophyll in chloroplasts captures light.",
          },
          {
            id: "q1-p4",
            prompt: "Which organelle contains the cell’s DNA?",
            options: ["Ribosome", "Chloroplast", "Nucleus", "Cell wall"],
            correctIndex: 2,
            explanation: "The nucleus is the control centre with DNA.",
          },
          {
            id: "q1-p5",
            prompt: "Animal cells cannot photosynthesise mainly because they lack:",
            options: ["Mitochondria", "Chloroplasts", "A nucleus", "A membrane"],
            correctIndex: 1,
            explanation: "No chloroplasts → no photosynthesis like plants.",
          },
        ],
      },
      {
        id: "q2",
        prompt: "Which statement is part of cell theory?",
        options: [
          "Only animals are made of cells",
          "All living things are made of cells",
          "Cells appear from non-living dust",
          "Plants do not have cells",
        ],
        correctIndex: 1,
        explanation:
          "Cell theory: all living things are made of cells; the cell is the basic unit of life; new cells come from existing cells.",
      },
      {
        id: "q3",
        prompt: "Which structures do plant cells usually have that animal cells do not?",
        options: [
          "Nucleus and membrane only",
          "Cell wall and chloroplasts",
          "Only ribosomes",
          "Only cytoplasm",
        ],
        correctIndex: 1,
        explanation:
          "Plant cells typically have a cell wall, chloroplasts (in green tissue), and a large vacuole. Animal cells lack cell walls and chloroplasts.",
      },
      {
        id: "q4",
        prompt: "The organelle that builds proteins is the:",
        options: ["Ribosome", "Chloroplast", "Cell wall", "Vacuole"],
        correctIndex: 0,
        explanation: "Ribosomes synthesise proteins.",
      },
      {
        id: "q5",
        prompt: "Word equation: photosynthesis needs light plus carbon dioxide and water to make:",
        options: [
          "Only salt",
          "Glucose and oxygen",
          "Only nitrogen",
          "DNA and ribosomes",
        ],
        correctIndex: 1,
        explanation:
          "Photosynthesis products are glucose (food) and oxygen. Reactants are CO₂ and water; light energy is required.",
      },
      {
        id: "q6",
        prompt: "“Powerhouse of the cell” usually refers to the:",
        options: ["Chloroplast", "Mitochondrion", "Cell wall", "Large vacuole"],
        correctIndex: 1,
        explanation:
          "Mitochondria release usable energy from food (respiration). Chloroplasts make food using light — different job.",
      },
    ],
  },
  {
    id: "energy-forms",
    title: "Forms of Energy & Transfer",
    summary: "Kinetic, potential, thermal, chemical — conservation ideas.",
    estimatedMinutes: 20,
    year: 8,
    subject: "science",
    strand: "Physical sciences",
    content: [
      {
        type: "paragraph",
        text: "Energy cannot be created or destroyed — only transformed. Everyday systems (solar panels, food chains, engines) illustrate energy transfers with some waste heat.",
      },
      {
        type: "list",
        items: [
          "Kinetic: energy of motion",
          "Gravitational potential: height in a field",
          "Chemical: stored in bonds (food, fuels)",
          "Thermal: related to particle motion",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A ball held above the ground has mainly:",
        options: [
          "Kinetic energy",
          "Gravitational potential energy",
          "Sound energy",
          "Nuclear energy",
        ],
        correctIndex: 1,
        explanation: "Height gives gravitational potential energy.",
      },
    ],
  },
  {
    id: "ecosystems-australia",
    title: "Australian Ecosystems",
    summary: "Biotic/abiotic factors, food webs, and unique biomes.",
    estimatedMinutes: 25,
    year: 9,
    subject: "science",
    strand: "Biological sciences",
    content: [
      {
        type: "paragraph",
        text: "Australia’s ecosystems range from tropical rainforest and coral reefs to arid deserts and alpine zones. Many species are endemic — found nowhere else.",
      },
      {
        type: "callout",
        tone: "info",
        text: "First Nations peoples have managed Country with fire, seasonal knowledge and totemic systems for tens of thousands of years — ecological science is older than the colonial record.",
      },
      {
        type: "list",
        items: [
          "Producers → primary consumers → secondary consumers",
          "Decomposers recycle nutrients",
          "Human impacts: habitat loss, invasive species, climate change",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "An endemic species is one that:",
        options: [
          "Migrates every year",
          "Is found only in a particular place",
          "Is always a predator",
          "Is extinct",
        ],
        correctIndex: 1,
        explanation: "Endemic means restricted to a defined geographic area.",
      },
    ],
  },
  {
    id: "genetics-basics",
    title: "Genetics & Inheritance",
    summary: "DNA, genes, alleles, and simple Mendelian crosses.",
    estimatedMinutes: 30,
    year: 10,
    subject: "science",
    strand: "Biological sciences",
    content: [
      {
        type: "paragraph",
        text: "DNA carries genetic information. Genes are segments of DNA; alleles are variants of a gene. Dominant and recessive patterns explain many (not all) traits.",
      },
      {
        type: "example",
        title: "Monohybrid cross",
        body: "Tt × Tt → offspring genotypes 1 TT : 2 Tt : 1 tt. If T is dominant, phenotype ratio is 3 tall : 1 short.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "If B is dominant brown eyes and b is blue, genotype Bb is:",
        options: ["Blue eyes", "Brown eyes", "Green eyes", "No eyes"],
        correctIndex: 1,
        explanation: "Heterozygous with dominant B → brown phenotype.",
      },
    ],
  },
  {
    id: "forces-motion",
    title: "Newton’s Laws of Motion",
    summary: "Inertia, F=ma, action–reaction — senior physics bridge.",
    estimatedMinutes: 30,
    year: 11,
    subject: "science",
    strand: "Physical sciences",
    content: [
      {
        type: "list",
        ordered: true,
        items: [
          "1st: Objects stay at rest or uniform motion unless a net force acts.",
          "2nd: F_net = ma",
          "3rd: Every action has an equal and opposite reaction.",
        ],
      },
      {
        type: "formula",
        latex: "F = m a",
        note: "Force in newtons, mass in kg, acceleration in m/s².",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A 2 kg mass accelerates at 3 m/s². Net force is:",
        options: ["1.5 N", "5 N", "6 N", "0 N"],
        correctIndex: 2,
        explanation: "F = 2 × 3 = 6 N.",
      },
    ],
  },
  {
    id: "climate-systems",
    title: "Earth Systems & Climate",
    summary: "Atmosphere, carbon cycle, and evidence for climate change.",
    estimatedMinutes: 30,
    year: 12,
    subject: "science",
    strand: "Earth & space",
    content: [
      {
        type: "paragraph",
        text: "Earth’s climate is driven by energy balance, greenhouse gases, oceans and biosphere feedbacks. Multiple independent lines of evidence show rapid warming since industrialisation, driven primarily by human CO₂ emissions.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Scientific consensus is not a vote — it is the result of convergent evidence from ice cores, satellites, ocean heat content and models tested against observations.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The main driver of recent global warming is:",
        options: [
          "Volcanoes alone",
          "Human greenhouse gas emissions",
          "Solar dimming",
          "Earth’s magnetic field",
        ],
        correctIndex: 1,
        explanation: "Anthropogenic greenhouse gases dominate the observed forcing.",
      },
    ],
  },

  // ─── CHEMISTRY ──────────────────────────────────────
  {
    id: "particle-model",
    title: "Particle Model of Matter",
    summary: "Solids, liquids, gases — particles in motion.",
    estimatedMinutes: 20,
    year: 7,
    subject: "chemistry",
    strand: "Matter",
    content: [
      {
        type: "paragraph",
        text: "All matter is made of particles. In solids they vibrate in fixed positions; in liquids they move past each other; in gases they move freely and fill the container.",
      },
      {
        type: "list",
        items: [
          "Heating increases particle kinetic energy.",
          "Changes of state are physical, not chemical.",
          "Diffusion is particles spreading from high to low concentration.",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In which state are particles farthest apart on average?",
        options: ["Solid", "Liquid", "Gas", "All the same"],
        correctIndex: 2,
        explanation: "Gas particles are far apart and move freely.",
      },
    ],
  },
  {
    id: "periodic-table",
    title: "The Periodic Table",
    summary: "Groups, periods, metals/non-metals, atomic number.",
    estimatedMinutes: 25,
    year: 8,
    subject: "chemistry",
    strand: "Atomic structure",
    content: [
      {
        type: "paragraph",
        text: "Elements are ordered by atomic number (protons). Groups share similar chemical properties; periods show repeating patterns of electron shells.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Group 1 alkali metals react vigorously with water. Noble gases (Group 18) are largely unreactive.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Atomic number equals the number of:",
        options: ["Neutrons", "Protons", "Electrons + neutrons", "Nuclei"],
        correctIndex: 1,
        explanation: "Atomic number Z = number of protons.",
      },
    ],
  },
  {
    id: "chemical-reactions",
    title: "Chemical Reactions & Equations",
    summary: "Reactants, products, conservation of mass, balancing.",
    estimatedMinutes: 25,
    year: 9,
    subject: "chemistry",
    strand: "Reactions",
    content: [
      {
        type: "paragraph",
        text: "In a chemical reaction, atoms rearrange. Mass is conserved: the number of each type of atom must balance on both sides of the equation.",
      },
      {
        type: "example",
        title: "Balancing",
        body: "H₂ + O₂ → H₂O is unbalanced. Correct: 2H₂ + O₂ → 2H₂O.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In a balanced equation, what is conserved?",
        options: [
          "Volume only",
          "Number of molecules only",
          "Number of each type of atom",
          "Colour",
        ],
        correctIndex: 2,
        explanation: "Atoms (and mass) are conserved; molecule counts can change.",
      },
    ],
  },
  {
    id: "bonding",
    title: "Ionic & Covalent Bonding",
    summary: "Electron transfer vs sharing; simple properties.",
    estimatedMinutes: 30,
    year: 10,
    subject: "chemistry",
    strand: "Bonding",
    content: [
      {
        type: "paragraph",
        text: "Ionic bonding: metals transfer electrons to non-metals, forming charged ions held by electrostatic attraction. Covalent bonding: non-metals share electron pairs.",
      },
      {
        type: "list",
        items: [
          "Ionic compounds: high melting points, conduct when molten/aqueous",
          "Simple molecular covalents: lower melting points, poor conductors",
          "Electronegativity differences help predict bond type",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "NaCl is held together mainly by:",
        options: [
          "Covalent bonds",
          "Ionic attraction",
          "Metallic bonding",
          "Hydrogen bonds only",
        ],
        correctIndex: 1,
        explanation: "Na⁺ and Cl⁻ form an ionic lattice.",
      },
    ],
  },
  {
    id: "stoichiometry",
    title: "Moles & Stoichiometry",
    summary: "Avogadro’s number, molar mass, limiting reagents.",
    estimatedMinutes: 35,
    year: 11,
    subject: "chemistry",
    strand: "Quantitative chemistry",
    content: [
      {
        type: "paragraph",
        text: "The mole links number of particles to measurable mass. n = m/M and n = N/N_A. Stoichiometry uses balanced equations to relate amounts of reactants and products.",
      },
      {
        type: "formula",
        latex: "n = m / M",
        note: "n in mol, m in g, M in g·mol⁻¹.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Molar mass of H₂O is approximately:",
        options: ["10 g·mol⁻¹", "18 g·mol⁻¹", "32 g·mol⁻¹", "44 g·mol⁻¹"],
        correctIndex: 1,
        explanation: "2(1) + 16 = 18 g·mol⁻¹.",
      },
    ],
  },
  {
    id: "equilibrium",
    title: "Chemical Equilibrium",
    summary: "Dynamic equilibrium, Le Chatelier, Kc basics.",
    estimatedMinutes: 35,
    year: 12,
    subject: "chemistry",
    strand: "Equilibrium",
    content: [
      {
        type: "paragraph",
        text: "At equilibrium, forward and reverse rates are equal; concentrations of reactants and products stay constant. Changing conditions shifts the position of equilibrium (Le Chatelier’s principle).",
      },
      {
        type: "formula",
        latex: "K_c = [products]^coeff / [reactants]^coeff",
        note: "Only aqueous and gas species appear in K expressions as written at this level.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "If a system at equilibrium is heated and the forward reaction is endothermic, equilibrium shifts:",
        options: [
          "To the left",
          "To the right",
          "Not at all",
          "Until K becomes zero",
        ],
        correctIndex: 1,
        explanation: "Heat favours the endothermic direction → products.",
      },
    ],
  },

  // ─── ENGLISH ────────────────────────────────────────
  {
    id: "narrative-structure",
    title: "Narrative Structure",
    summary: "Orientation, complication, climax, resolution — and why it matters.",
    estimatedMinutes: 25,
    year: 7,
    subject: "english",
    strand: "Literature & writing",
    content: [
      {
        type: "paragraph",
        text: "Most narratives move through orientation (who/where), complication (problem), rising action, climax and resolution. Writers can twist this structure deliberately.",
      },
      {
        type: "list",
        items: [
          "Point of view: first, second, third (limited/omniscient)",
          "Show, don’t only tell — use concrete detail",
          "Theme is the big idea beneath the plot",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The climax of a story is best described as:",
        options: [
          "The first sentence",
          "The turning point of greatest tension",
          "A list of characters",
          "The author’s biography",
        ],
        correctIndex: 1,
        explanation: "Climax is the peak conflict / turning point.",
      },
    ],
  },
  {
    id: "persuasive-techniques",
    title: "Persuasive Language",
    summary: "Rhetoric, appeals, and analysing media arguments.",
    estimatedMinutes: 25,
    year: 8,
    subject: "english",
    strand: "Literacy",
    content: [
      {
        type: "paragraph",
        text: "Persuasive texts use ethos (credibility), pathos (emotion) and logos (logic). Techniques include rhetorical questions, emotive language, statistics, repetition and inclusive pronouns.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Always ask: Who benefits if I accept this argument? What evidence is missing?",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "An appeal to emotion is called:",
        options: ["Ethos", "Pathos", "Logos", "Syntax"],
        correctIndex: 1,
        explanation: "Pathos targets feelings.",
      },
    ],
  },
  {
    id: "poetry-analysis",
    title: "Reading Poetry Closely",
    summary: "Imagery, sound devices, form and Australian voices.",
    estimatedMinutes: 30,
    year: 9,
    subject: "english",
    strand: "Literature",
    content: [
      {
        type: "paragraph",
        text: "Poetry compresses meaning through imagery, metaphor, rhythm and sound (alliteration, assonance, rhyme). Australian poets write about Country, identity, suburbia, migration and resistance — not only landscape postcards.",
      },
      {
        type: "list",
        items: [
          "Denotation vs connotation",
          "Enjambment and caesura affect pace",
          "Context: when and why was it written?",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A comparison using “like” or “as” is a:",
        options: ["Metaphor", "Simile", "Hyperbole", "Oxymoron"],
        correctIndex: 1,
        explanation: "Similes use like/as; metaphors state identity.",
      },
    ],
  },
  {
    id: "critical-literacy",
    title: "Critical Literacy & Representation",
    summary: "How texts position readers; whose voices are centred or missing.",
    estimatedMinutes: 30,
    year: 10,
    subject: "english",
    strand: "Literacy",
    content: [
      {
        type: "paragraph",
        text: "Critical literacy asks how language constructs power. Whose perspective is privileged? What stereotypes are reinforced? How might First Nations, migrant, queer or working-class readers experience the same text differently?",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Neutral language is rarely neutral. School anthologies, news and advertising all select and omit. Your job as a reader is to notice the framing.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Critical literacy primarily focuses on:",
        options: [
          "Spelling only",
          "How texts position readers and construct power",
          "Typing speed",
          "Font choice",
        ],
        correctIndex: 1,
        explanation: "It examines ideology, representation and power in texts.",
      },
    ],
  },
  {
    id: "comparative-essay",
    title: "Comparative Text Response",
    summary: "Structuring essays that compare ideas across two texts.",
    estimatedMinutes: 35,
    year: 11,
    subject: "english",
    strand: "Writing",
    content: [
      {
        type: "paragraph",
        text: "Senior English often requires comparing how two texts explore shared themes. Organise by idea (not text-then-text dump). Use topic sentences that name both texts and the idea, then evidence and analysis.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Thesis answering the prompt",
          "Body paragraphs by idea / lens",
          "Integrated quotations with analysis",
          "Nuanced conclusion — not a repeat",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A strong comparative paragraph usually:",
        options: [
          "Summarises one whole text then the other",
          "Compares both texts around one idea",
          "Avoids quotations",
          "Ignores the prompt",
        ],
        correctIndex: 1,
        explanation: "Idea-driven comparison is clearer and more analytical.",
      },
    ],
  },
  {
    id: "creative-craft",
    title: "Creative Craft for Assessment",
    summary: "Voice, structure and purpose under exam conditions.",
    estimatedMinutes: 30,
    year: 12,
    subject: "english",
    strand: "Writing",
    content: [
      {
        type: "paragraph",
        text: "Year 12 creative pieces need deliberate craft: consistent voice, controlled structure, purposeful imagery and a clear relationship to stimulus or framework. Editing for precision beats purple prose.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Read your piece aloud. Awkward rhythm often marks weak sentences.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In a timed creative response, priority one is usually:",
        options: [
          "Maximum adjectives",
          "Clear purpose and controlled structure",
          "Longest possible piece",
          "Ignoring the stimulus",
        ],
        correctIndex: 1,
        explanation: "Markers reward purposeful craft tied to the task.",
      },
    ],
  },

  // ─── HISTORY (unfiltered Australian) ────────────────
  {
    id: "deep-time-country",
    title: "Deep Time & First Nations Sovereignty",
    summary: "60,000+ years of continuous cultures before 1788.",
    estimatedMinutes: 30,
    year: 7,
    subject: "history",
    strand: "First Nations & invasion",
    content: [
      {
        type: "heading",
        text: "This is not empty land",
      },
      {
        type: "paragraph",
        text: "Aboriginal and Torres Strait Islander peoples have lived on this continent for at least 65,000 years — among the oldest continuous cultures on Earth. Hundreds of nations, languages and law systems governed Country long before Britain claimed it.",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "The British doctrine of terra nullius (“land belonging to no one”) was a legal fiction used to justify colonisation. It denied existing sovereignty and was overturned in Australian law by the Mabo decision (1992).",
      },
      {
        type: "list",
        items: [
          "Songlines, ceremony and kinship organised knowledge and land care",
          "Trade networks spanned the continent",
          "Contact with Macassan traders pre-dated British settlement in the north",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Terra nullius claimed that Australia was:",
        options: [
          "Already a British colony",
          "Land belonging to no one",
          "Owned by the Dutch",
          "A French protectorate",
        ],
        correctIndex: 1,
        explanation: "Terra nullius denied Indigenous ownership/sovereignty.",
      },
    ],
  },
  {
    id: "invasion-and-frontier",
    title: "Invasion, Resistance & the Frontier Wars",
    summary: "1788 onward: dispossession, violence, and Aboriginal resistance.",
    estimatedMinutes: 35,
    year: 8,
    subject: "history",
    strand: "Colonisation",
    content: [
      {
        type: "paragraph",
        text: "From 1788, British colonisation expanded through land seizure, disease, forced labour and violence. First Nations peoples resisted — through diplomacy, economic adaptation and armed conflict often called the Frontier Wars.",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Massacres of Aboriginal people occurred across the continent well into the early 20th century. Many were poorly recorded in official sources; oral histories and later research (e.g. massacre mapping projects) document a far bloodier record than older school textbooks admitted.",
      },
      {
        type: "list",
        items: [
          "Pemulwuy and others led early resistance near Sydney",
          "Pastoral expansion drove conflict over water, stock and land",
          "Punitive expeditions and police actions killed large numbers",
          "Survivors faced missions, reserves and loss of language",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The Frontier Wars refers primarily to:",
        options: [
          "WWI in Europe",
          "Conflict between First Nations peoples and colonisers over land",
          "The Eureka Stockade only",
          "Naval battles with France",
        ],
        correctIndex: 1,
        explanation: "It names the long conflict over land and sovereignty after 1788.",
      },
    ],
  },
  {
    id: "gold-federation-exclusion",
    title: "Gold, Federation & Racial Exclusion",
    summary: "Wealth, nation-building, and the White Australia Policy.",
    estimatedMinutes: 30,
    year: 9,
    subject: "history",
    strand: "Nation-making",
    content: [
      {
        type: "paragraph",
        text: "Gold rushes transformed demography and politics. Federation (1901) created the Commonwealth — and one of its first priorities was racial gatekeeping via the Immigration Restriction Act (White Australia Policy).",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Nation-building was not inclusive. Chinese miners faced riots and discriminatory taxes. Pacific Islanders (including those kidnapped in “blackbirding”) were exploited in Queensland sugar. Aboriginal people were largely excluded from citizenship rights and the national story told in white newspapers.",
      },
      {
        type: "list",
        items: [
          "Eureka Stockade (1854): miners vs colonial authority",
          "Federation: defence, trade, and racial purity debates",
          "White Australia Policy shaped migration until dismantled mid–late 20th century",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The Immigration Restriction Act 1901 is associated with:",
        options: [
          "Open borders",
          "The White Australia Policy",
          "Aboriginal land rights",
          "Free university",
        ],
        correctIndex: 1,
        explanation: "It was the legal core of White Australia.",
      },
    ],
  },
  {
    id: "wars-and-home-front",
    title: "World Wars, Anzac & Contested Memory",
    summary: "Gallipoli to Kokoda — myth, sacrifice, and who gets remembered.",
    estimatedMinutes: 30,
    year: 10,
    subject: "history",
    strand: "20th century",
    content: [
      {
        type: "paragraph",
        text: "Australia’s involvement in WWI and WWII cost tens of thousands of lives and shaped national identity. Anzac became a powerful story of mateship and courage — but history also includes conscription debates, censorship, treatment of enemy aliens, and Aboriginal service members who returned to discrimination.",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Remembering war honestly means holding both courage and critique: imperial loyalty, trauma, gender on the home front, and the political uses of Anzac in later decades.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A critical approach to Anzac memory means:",
        options: [
          "Never mentioning Gallipoli",
          "Only celebrating without questions",
          "Examining myth, sacrifice, exclusion and political use of the story",
          "Ignoring WWII",
        ],
        correctIndex: 2,
        explanation: "Critical history analyses how memory is constructed.",
      },
    ],
  },
  {
    id: "rights-stolen-generations",
    title: "Rights, Stolen Generations & Land",
    summary: "Protection eras, child removal, referendum, Mabo and beyond.",
    estimatedMinutes: 35,
    year: 11,
    subject: "history",
    strand: "Rights & justice",
    content: [
      {
        type: "paragraph",
        text: "20th-century “protection” and assimilation policies controlled Aboriginal lives — movement, wages, marriage and children. The Stolen Generations names the systematic removal of Aboriginal and Torres Strait Islander children from families.",
      },
      {
        type: "list",
        items: [
          "1967 Referendum: counted in the census; Commonwealth could legislate",
          "Mabo (1992): native title; terra nullius rejected",
          "Bringing Them Home (1997): documented removal and called for reparations",
          "National Apology (2008): formal apology for Stolen Generations",
        ],
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Apology without structural change does not end inequality. Debates over Voice, Treaty and truth-telling remain live political struggles — not settled ancient history.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The Mabo decision (1992) is significant because it:",
        options: [
          "Created the White Australia Policy",
          "Rejected terra nullius and recognised native title",
          "Ended WWII",
          "Banned mining",
        ],
        correctIndex: 1,
        explanation: "High Court recognised pre-existing native title.",
      },
    ],
  },
  {
    id: "modern-australia-contested",
    title: "Modern Australia: Migration, Culture Wars & Truth",
    summary: "Multiculturalism, republican debate, climate, and history wars.",
    estimatedMinutes: 30,
    year: 12,
    subject: "history",
    strand: "Contemporary",
    content: [
      {
        type: "paragraph",
        text: "Post-war migration remade Australia. Multicultural policy, Asian engagement, and refugee debates reshaped identity. The “history wars” contested how invasion, race and Anzac should be taught. Climate, inequality and Indigenous justice dominate 21st-century politics.",
      },
      {
        type: "callout",
        tone: "unfiltered",
        text: "Unfiltered history does not mean anti-Australian. It means refusing comforting myths when evidence shows violence, racism or injustice — and still recognising creativity, solidarity and reform. A mature democracy can face its past.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "The “history wars” in Australia mainly concerned:",
        options: [
          "Sports results",
          "How colonial violence and national identity are interpreted",
          "Currency design only",
          "Train timetables",
        ],
        correctIndex: 1,
        explanation: "Public debate over interpreting invasion, race and national story.",
      },
    ],
  },

  // ─── MUSIC ──────────────────────────────────────────
  {
    id: "elements-of-music",
    title: "Elements of Music",
    summary: "Duration, pitch, dynamics, tone colour, texture, structure.",
    estimatedMinutes: 20,
    year: 7,
    subject: "music",
    strand: "Listening",
    content: [
      {
        type: "paragraph",
        text: "Musicians describe sound using shared elements: duration (rhythm/tempo), pitch (melody/harmony), dynamics (loud/soft), tone colour (timbre), texture (layers) and structure (form).",
      },
      {
        type: "list",
        items: [
          "Beat vs rhythm",
          "Melody moves by step or leap",
          "Texture: monophonic, homophonic, polyphonic",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Timbre is another word for:",
        options: ["Tempo", "Tone colour", "Time signature", "Texture only"],
        correctIndex: 1,
        explanation: "Timbre/tone colour is the quality of a sound.",
      },
    ],
  },
  {
    id: "scales-and-keys",
    title: "Scales, Keys & the Keyboard",
    summary: "Major/minor, sharps/flats, and basic notation.",
    estimatedMinutes: 25,
    year: 8,
    subject: "music",
    strand: "Theory",
    content: [
      {
        type: "paragraph",
        text: "A major scale follows W-W-H-W-W-W-H (whole and half steps). Keys organise pitch centres. Reading treble and bass clef unlocks ensemble and composition work.",
      },
      {
        type: "example",
        title: "C major",
        body: "C D E F G A B C — no sharps or flats. A minor is the relative minor (same key signature).",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "How many different pitch letter names are in a diatonic scale?",
        options: ["5", "6", "7", "12"],
        correctIndex: 2,
        explanation: "Seven letter names (e.g. C–B) before the octave repeats.",
      },
    ],
  },
  {
    id: "australian-music-voices",
    title: "Australian Musical Voices",
    summary: "First Nations music, folk, rock, classical and contemporary scenes.",
    estimatedMinutes: 25,
    year: 9,
    subject: "music",
    strand: "Culture",
    content: [
      {
        type: "paragraph",
        text: "Music on this continent includes ancient song traditions, mission hymns, bush ballads, jazz, pub rock, hip-hop and experimental art music. First Nations artists continue ceremony-based practice and innovate in every popular genre.",
      },
      {
        type: "callout",
        tone: "info",
        text: "When studying Indigenous music, respect protocols: some songs and instruments are restricted. Listen to living artists and community sources — not only colonial collectors’ archives.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Studying First Nations music ethically requires:",
        options: [
          "Ignoring living artists",
          "Respecting cultural protocols and context",
          "Treating all songs as free samples",
          "Only using 19th-century sheet music",
        ],
        correctIndex: 1,
        explanation: "Protocols and community authority matter.",
      },
    ],
  },
  {
    id: "harmony-chords",
    title: "Harmony & Chord Progressions",
    summary: "Triads, primary chords, and popular progressions.",
    estimatedMinutes: 30,
    year: 10,
    subject: "music",
    strand: "Theory",
    content: [
      {
        type: "paragraph",
        text: "Triads stack thirds. In major keys, I, IV and V are primary chords. Progressions like I–V–vi–IV power countless pop songs; blues uses I–IV–V in a 12-bar form.",
      },
      {
        type: "example",
        title: "In C major",
        body: "I = C, IV = F, V = G, vi = Am.",
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "In G major, the V chord is:",
        options: ["C", "D", "Em", "Am"],
        correctIndex: 1,
        explanation: "V is built on the 5th degree → D major.",
      },
    ],
  },
  {
    id: "composition-process",
    title: "Composition Process",
    summary: "From idea to structure — motifs, form and revision.",
    estimatedMinutes: 30,
    year: 11,
    subject: "music",
    strand: "Creating",
    content: [
      {
        type: "paragraph",
        text: "Composers develop small ideas (motifs) through repetition, variation and contrast. Choose a form (binary, ternary, verse–chorus, through-composed) early, then revise with intention.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Generate: improvise, record, sketch",
          "Select: keep the strongest cells",
          "Develop: sequence, invert, reharmonise",
          "Structure: map sections and energy",
          "Refine: dynamics, articulation, balance",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "A motif is:",
        options: [
          "A full symphony",
          "A short musical idea used for development",
          "Only a drum solo",
          "A type of microphone",
        ],
        correctIndex: 1,
        explanation: "Motifs are compact cells composers develop.",
      },
    ],
  },
  {
    id: "performance-analysis",
    title: "Performance & Critical Listening",
    summary: "Evaluating interpretation, style and technical control.",
    estimatedMinutes: 30,
    year: 12,
    subject: "music",
    strand: "Performance",
    content: [
      {
        type: "paragraph",
        text: "Senior music assessment judges technical fluency, stylistic awareness, expressive communication and ensemble skills. Critical listening names what you hear with precise vocabulary — not just “it was good.”",
      },
      {
        type: "list",
        items: [
          "Intonation, timing, tone",
          "Phrasing and dynamic shape",
          "Stylistic conventions (Baroque vs rock vs jazz swing)",
          "Stagecraft and communication",
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Strong critical listening commentary should:",
        options: [
          "Only say “nice”",
          "Use specific musical vocabulary and evidence",
          "Ignore style",
          "Avoid mentioning technique",
        ],
        correctIndex: 1,
        explanation: "Precision and evidence beat vague praise.",
      },
    ],
  },

  // ─── LANGUAGES: full Y7–Y12 fluency pathway ──
  ...buildFluencyLanguageLessons(),

  // ─── COMPUTER SCIENCE: code → AI → defence ──
  ...buildComputerScienceLessons(),
];

export function getLessonsFor(
  year: YearLevel,
  subject: SubjectId,
  language?: LanguageId,
  /** CS pathway filter — when set, only core + that pathway electives */
  csPathway?: import("@/lib/types").CsPathwayId,
): Lesson[] {
  return LESSONS.filter((l) => {
    if (l.year !== year || l.subject !== subject) return false;
    if (subject === "language") {
      return language ? l.language === language : true;
    }
    if (subject === "computerscience" && csPathway) {
      const tags = l.csPathways;
      if (!tags || tags.length === 0) return true; // core
      return tags.includes(csPathway);
    }
    return true;
  });
}

export function getLesson(
  year: YearLevel,
  subject: SubjectId,
  lessonId: string,
  language?: LanguageId,
): Lesson | undefined {
  return LESSONS.find((l) => {
    if (l.year !== year || l.subject !== subject || l.id !== lessonId) return false;
    if (subject === "language") {
      return language ? l.language === language : true;
    }
    return true;
  });
}

export function allLessonKeysForYear(year: YearLevel): string[] {
  return LESSONS.filter((l) => l.year === year).map((l) =>
    l.language
      ? `${l.year}:${l.subject}:${l.language}:${l.id}`
      : `${l.year}:${l.subject}:${l.id}`,
  );
}
