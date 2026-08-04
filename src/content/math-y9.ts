import type { Lesson } from "@/lib/types";

/**
 * MATH Year 9 — aligned to Victorian Curriculum F–10 Version 2.0, Level 9.
 * 5 lessons, 6–8 quiz Qs each, matching the Y7/Y8 quality bar.
 * Import and spread this into LESSONS in src/content/lessons.ts.
 */
export const MATH_Y9_LESSONS: Lesson[] = [
  {
    id: "y9-index-laws-scientific-notation",
    title: "Index Laws with Negative Indices & Scientific Notation",
    summary:
      "30-min block: extending exponent laws to negative indices, and writing very large/small numbers in scientific notation.",
    estimatedMinutes: 30,
    year: 9,
    subject: "math",
    strand: "Number · Indices",
    content: [
      { type: "heading", text: "Negative indices" },
      {
        type: "paragraph",
        text: "A negative exponent means 'reciprocal': a⁻ⁿ = 1/aⁿ. This falls straight out of the division law you learned in Year 8 (aᵐ ÷ aⁿ = aᵐ⁻ⁿ) when m < n.",
      },
      {
        type: "example",
        title: "Applying it",
        body: "2⁻³ = 1/2³ = 1/8. And 5² ÷ 5⁵ = 5⁻³ = 1/125.",
      },
      { type: "heading", text: "Scientific notation" },
      {
        type: "paragraph",
        text: "Very large or small numbers are written as a × 10ⁿ, where 1 ≤ a < 10. Positive n = large number, negative n = small number.",
      },
      {
        type: "example",
        title: "Two directions",
        body: "384,000,000 = 3.84 × 10⁸ (Earth–Moon distance in metres). 0.000012 = 1.2 × 10⁻⁵.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Count how many places the decimal point moves to find the exponent — moving left gives a positive power, moving right gives a negative power.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "What is 3⁻²?", options: ["−9", "1/9", "9", "−1/9"], correctIndex: 1, explanation: "3⁻²=1/3²=1/9." },
      { id: "q2", prompt: "Write 56,000 in scientific notation.", options: ["5.6×10³", "5.6×10⁴", "56×10³", "0.56×10⁵"], correctIndex: 1, explanation: "56,000 = 5.6×10⁴." },
      { id: "q3", prompt: "Write 0.0009 in scientific notation.", options: ["9×10⁻⁴", "9×10⁴", "0.9×10⁻³", "9×10⁻³"], correctIndex: 0, explanation: "Decimal moves 4 places right: 9×10⁻⁴." },
      { id: "q4", prompt: "Simplify: 4⁵ ÷ 4⁸", options: ["4³", "4⁻³", "1/4⁻³", "4¹³"], correctIndex: 1, explanation: "Subtract exponents: 5−8=−3, so 4⁻³." },
      { id: "q5", prompt: "Which number is largest?", options: ["3×10²", "3×10⁻²", "3×10⁰", "3×10¹"], correctIndex: 0, explanation: "Highest positive exponent = largest value." },
      { id: "q6", prompt: "2⁻¹ equals:", options: ["−2", "0.5", "2", "−0.5"], correctIndex: 1, explanation: "2⁻¹=1/2=0.5." },
      { id: "q7", prompt: "5.2×10⁻³ written as a decimal is:", options: ["0.0052", "5200", "0.052", "520"], correctIndex: 0, explanation: "Negative exponent 3 moves decimal 3 places left." },
    ],
  },
  {
    id: "y9-expand-factorise",
    title: "Expanding Binomials & Factorising Quadratics",
    summary:
      "30-min block: expanding binomial products (FOIL) and factorising monic quadratic expressions.",
    estimatedMinutes: 30,
    year: 9,
    subject: "math",
    strand: "Algebra",
    content: [
      { type: "heading", text: "Expanding binomial products" },
      {
        type: "paragraph",
        text: "To expand (x + a)(x + b), multiply every term in the first bracket by every term in the second (First, Outer, Inner, Last).",
      },
      {
        type: "example",
        title: "Expand (x+3)(x+5)",
        body: "x² + 5x + 3x + 15 = x² + 8x + 15",
      },
      { type: "heading", text: "Factorising monic quadratics" },
      {
        type: "paragraph",
        text: "To factorise x² + bx + c, find two numbers that multiply to c and add to b. This reverses the expansion process.",
      },
      {
        type: "example",
        title: "Factorise x² + 8x + 15",
        body: "Need two numbers that multiply to 15 and add to 8: 3 and 5. So x² + 8x + 15 = (x+3)(x+5).",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Expand: (x+2)(x+4)", options: ["x²+6x+8", "x²+8x+6", "x²+6x+6", "2x+6"], correctIndex: 0, explanation: "2+4=6, 2×4=8: x²+6x+8." },
      { id: "q2", prompt: "Factorise: x²+7x+12", options: ["(x+3)(x+4)", "(x+2)(x+6)", "(x+1)(x+12)", "(x+5)(x+2)"], correctIndex: 0, explanation: "3×4=12, 3+4=7." },
      { id: "q3", prompt: "Expand: (x−3)(x+5)", options: ["x²+2x−15", "x²−2x−15", "x²+8x−15", "x²−8x+15"], correctIndex: 0, explanation: "−3+5=2, −3×5=−15." },
      { id: "q4", prompt: "Factorise: x²−5x+6", options: ["(x−2)(x−3)", "(x+2)(x+3)", "(x−1)(x−6)", "(x−6)(x+1)"], correctIndex: 0, explanation: "−2×−3=6, −2+−3=−5." },
      { id: "q5", prompt: "Expand: (x+6)²", options: ["x²+12x+36", "x²+36", "x²+6x+36", "2x+12"], correctIndex: 0, explanation: "(x+6)(x+6)=x²+6x+6x+36=x²+12x+36." },
      { id: "q6", prompt: "Factorise: x²−9", options: ["(x−3)(x+3)", "(x−9)(x+1)", "(x−3)²", "Cannot factorise"], correctIndex: 0, explanation: "Difference of two squares: x²−3²=(x−3)(x+3)." },
      { id: "q7", prompt: "Factorise: x²+x−6", options: ["(x+3)(x−2)", "(x+2)(x−3)", "(x+6)(x−1)", "(x−6)(x+1)"], correctIndex: 0, explanation: "3×−2=−6, 3+−2=1." },
    ],
  },
  {
    id: "y9-simple-interest-proportion",
    title: "Simple Interest & Direct Proportion",
    summary:
      "30-min block: calculating simple interest and solving direct proportion/rate problems.",
    estimatedMinutes: 30,
    year: 9,
    subject: "math",
    strand: "Number · Financial Mathematics",
    content: [
      { type: "heading", text: "Simple interest" },
      { type: "formula", latex: "I = P \\times r \\times t", note: "P=principal, r=rate (as a decimal), t=time in years" },
      {
        type: "example",
        title: "Worked example",
        body: "$2000 invested at 4% p.a. for 3 years: I = 2000 × 0.04 × 3 = $240.",
      },
      { type: "heading", text: "Direct proportion" },
      {
        type: "paragraph",
        text: "Two quantities are in direct proportion when one is always a constant multiple of the other: y = kx. If you double x, y doubles too.",
      },
      {
        type: "example",
        title: "Direct proportion",
        body: "5 kg of apples costs $15, so 1 kg costs $3 (k=3). 8 kg would cost 8×3=$24.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Simple interest on $3000 at 5% p.a. for 2 years:", options: ["$150", "$300", "$450", "$600"], correctIndex: 1, explanation: "I=3000×0.05×2=300." },
      { id: "q2", prompt: "$500 at 6% p.a. for 4 years — total amount (principal + interest)?", options: ["$620", "$120", "$680", "$500"], correctIndex: 0, explanation: "I=500×0.06×4=120; total=500+120=620." },
      { id: "q3", prompt: "If y is directly proportional to x, and y=20 when x=4, find y when x=10.", options: ["25", "40", "50", "16"], correctIndex: 2, explanation: "k=20÷4=5; y=5×10=50." },
      { id: "q4", prompt: "6 hours of work pays $150. At the same rate, 10 hours pays:", options: ["$200", "$250", "$300", "$150"], correctIndex: 1, explanation: "$25/hr × 10 = $250." },
      { id: "q5", prompt: "What rate (decimal) is 7.5% in the simple interest formula?", options: ["7.5", "0.75", "0.075", "75"], correctIndex: 2, explanation: "Percent ÷ 100 = 0.075." },
      { id: "q6", prompt: "$1000 earns $80 interest in 2 years. What was the annual rate?", options: ["4%", "8%", "40%", "80%"], correctIndex: 0, explanation: "80=1000×r×2 → r=0.04=4%." },
      { id: "q7", prompt: "In y=kx, k is called the:", options: ["Gradient/constant of proportionality", "Intercept", "Remainder", "Base"], correctIndex: 0, explanation: "k is the constant multiplier linking x and y." },
    ],
  },
  {
    id: "y9-surds-irrational",
    title: "Surds & Irrational Numbers",
    summary:
      "30-min block: recognising irrational numbers and simplifying surds.",
    estimatedMinutes: 30,
    year: 9,
    subject: "math",
    strand: "Number · Real Numbers",
    content: [
      { type: "heading", text: "Rational vs irrational" },
      {
        type: "paragraph",
        text: "A rational number can be written as a fraction of integers (or a terminating/recurring decimal). An irrational number cannot — its decimal goes on forever without repeating. √2, π, and most square roots of non-perfect squares are irrational.",
      },
      { type: "heading", text: "Simplifying surds" },
      {
        type: "example",
        title: "Simplify √50",
        body: "√50 = √(25×2) = √25 × √2 = 5√2",
      },
      {
        type: "list",
        items: [
          "Look for the largest perfect-square factor.",
          "√(a×b) = √a × √b",
          "√4=2, √9=3, √16=4, √25=5, √36=6, √49=7 — memorise these.",
        ],
      },
    ],
    quiz: [
      { id: "q1", prompt: "Which of these is irrational?", options: ["4/5", "√16", "√7", "0.25"], correctIndex: 2, explanation: "16 is a perfect square (√16=4, rational); 7 is not." },
      { id: "q2", prompt: "Simplify √18", options: ["3√2", "2√3", "6√2", "9√2"], correctIndex: 0, explanation: "√18=√(9×2)=3√2." },
      { id: "q3", prompt: "Simplify √72", options: ["6√2", "8√3", "6√3", "36√2"], correctIndex: 0, explanation: "√72=√(36×2)=6√2." },
      { id: "q4", prompt: "Is π rational or irrational?", options: ["Rational", "Irrational", "Neither", "Depends on context"], correctIndex: 1, explanation: "π's decimal never terminates or repeats." },
      { id: "q5", prompt: "Which is a perfect square?", options: ["45", "49", "50", "48"], correctIndex: 1, explanation: "49=7²." },
      { id: "q6", prompt: "Simplify √8 + √2", options: ["3√2", "√10", "2√4", "4√2"], correctIndex: 0, explanation: "√8=2√2, so 2√2+√2=3√2." },
      { id: "q7", prompt: "0.333... (recurring) is:", options: ["Irrational", "Rational (=1/3)", "Neither", "Undefined"], correctIndex: 1, explanation: "Recurring decimals are always rational." },
    ],
  },
  {
    id: "y9-linear-graphs-cartesian",
    title: "Linear Graphs: Gradient, Distance & Midpoint",
    summary:
      "30-min block: finding gradient, the distance between two points, and the midpoint of a line segment on the Cartesian plane.",
    estimatedMinutes: 30,
    year: 9,
    subject: "math",
    strand: "Space · Algebra",
    content: [
      { type: "heading", text: "Three key formulas" },
      { type: "formula", latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}", note: "Gradient" },
      { type: "formula", latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}", note: "Distance (from Pythagoras)" },
      { type: "formula", latex: "M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)", note: "Midpoint" },
      {
        type: "example",
        title: "Worked: points (1,2) and (5,6)",
        body: "Gradient = (6−2)/(5−1) = 4/4 = 1. Distance = √(16+16) = √32 = 4√2. Midpoint = (3,4).",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Notice the distance formula is just Pythagoras' theorem applied to the horizontal and vertical gaps between two points.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Gradient between (0,0) and (4,8):", options: ["2", "4", "0.5", "8"], correctIndex: 0, explanation: "(8−0)/(4−0)=2." },
      { id: "q2", prompt: "Midpoint of (2,4) and (6,10):", options: ["(4,7)", "(8,14)", "(2,3)", "(4,6)"], correctIndex: 0, explanation: "((2+6)/2, (4+10)/2) = (4,7)." },
      { id: "q3", prompt: "Distance between (0,0) and (3,4):", options: ["5", "7", "12", "25"], correctIndex: 0, explanation: "√(9+16)=√25=5." },
      { id: "q4", prompt: "A gradient of 0 means the line is:", options: ["Vertical", "Horizontal", "Diagonal at 45°", "Undefined"], correctIndex: 1, explanation: "No vertical change = horizontal line." },
      { id: "q5", prompt: "Gradient between (1,5) and (1,9):", options: ["0", "4", "Undefined", "1"], correctIndex: 2, explanation: "Zero horizontal change means division by zero — vertical line, undefined gradient." },
      { id: "q6", prompt: "Midpoint of (−2,3) and (4,−1):", options: ["(1,1)", "(2,2)", "(1,2)", "(3,1)"], correctIndex: 0, explanation: "((−2+4)/2, (3+−1)/2)=(1,1)." },
      { id: "q7", prompt: "Distance between (2,1) and (2,7):", options: ["6", "5", "8", "36"], correctIndex: 0, explanation: "Same x-coordinate: distance is just the difference in y, |7−1|=6." },
    ],
  },
];
