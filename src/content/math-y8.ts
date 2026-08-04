import type { Lesson } from "@/lib/types";

/**
 * MATH Year 8 — aligned to Victorian Curriculum F–10 Version 2.0, Level 8.
 * Matches the Y7 Integers pathway quality bar: 5 lessons, 6–8 quiz Qs each.
 * Import and spread this into LESSONS in src/content/lessons.ts.
 */
export const MATH_Y8_LESSONS: Lesson[] = [
  {
    id: "y8-exponent-laws",
    title: "Exponent Laws & Index Notation",
    summary:
      "30-min block: index notation, multiplying/dividing powers, and the zero exponent.",
    estimatedMinutes: 30,
    year: 8,
    subject: "math",
    strand: "Number · Indices",
    content: [
      { type: "heading", text: "What is index notation?" },
      {
        type: "paragraph",
        text: "Index notation is shorthand for repeated multiplication. 3⁴ means 3 × 3 × 3 × 3 = 81. The small raised number is the exponent (or index/power); the big number is the base.",
      },
      {
        type: "list",
        items: [
          "aᵐ × aⁿ = aᵐ⁺ⁿ (multiplying, same base → add exponents)",
          "aᵐ ÷ aⁿ = aᵐ⁻ⁿ (dividing, same base → subtract exponents)",
          "a⁰ = 1 for any non-zero a",
          "(aᵐ)ⁿ = aᵐⁿ (power of a power → multiply exponents)",
        ],
      },
      {
        type: "example",
        title: "Worked example",
        body: "2⁵ × 2³ = 2⁸ = 256. Check: (2×2×2×2×2) × (2×2×2) = 2⁸ ✓",
      },
      {
        type: "callout",
        tone: "tip",
        text: "The exponent laws only work directly when the bases match. 2³ × 3² cannot be simplified with these rules — evaluate separately.",
      },
    ],
    depthContent: [
      { type: "heading", text: "In depth: negative exponents preview" },
      {
        type: "paragraph",
        text: "a⁻ⁿ = 1/aⁿ. This follows from the division rule: aⁿ ÷ aⁿ⁺ᵏ = a⁻ᵏ, and aⁿ ÷ aⁿ⁺ᵏ must also equal 1/aᵏ.",
      },
      {
        type: "example",
        title: "Why a⁰ = 1",
        body: "aⁿ ÷ aⁿ = 1 (anything divided by itself). But by the law, aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰. So a⁰ = 1.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Simplify: 5² × 5³", options: ["5⁵", "5⁶", "25⁵", "5¹"], correctIndex: 0, explanation: "Same base, add exponents: 2+3=5." },
      { id: "q2", prompt: "Simplify: 7⁶ ÷ 7²", options: ["7³", "7⁴", "7⁸", "1"], correctIndex: 1, explanation: "Same base, subtract exponents: 6−2=4." },
      { id: "q3", prompt: "What is 9⁰?", options: ["0", "9", "1", "Undefined"], correctIndex: 2, explanation: "Any non-zero number to the power 0 is 1." },
      { id: "q4", prompt: "Simplify: (3²)³", options: ["3⁵", "3⁶", "3⁹", "9³"], correctIndex: 1, explanation: "Power of a power: multiply exponents, 2×3=6." },
      { id: "q5", prompt: "Which is equal to 4 × 4 × 4?", options: ["4³", "3⁴", "4×3", "12"], correctIndex: 0, explanation: "Three factors of 4 is 4³." },
      { id: "q6", prompt: "Simplify: 2⁴ × 2⁰", options: ["2⁰", "2⁴", "2⁵", "0"], correctIndex: 1, explanation: "2⁰=1, so 2⁴×1=2⁴." },
      { id: "q7", prompt: "Can 3⁴ × 2² be simplified using the same-base law?", options: ["Yes, to 6⁶", "Yes, to 5⁶", "No, bases differ", "Yes, to 6⁴"], correctIndex: 2, explanation: "The multiplication law needs matching bases." },
    ],
  },
  {
    id: "y8-pythagoras",
    title: "Pythagoras' Theorem",
    summary:
      "30-min block: right-angled triangles, a² + b² = c², and finding an unknown side.",
    estimatedMinutes: 30,
    year: 8,
    subject: "math",
    strand: "Measurement · Geometry",
    content: [
      { type: "heading", text: "The relationship" },
      {
        type: "paragraph",
        text: "In any right-angled triangle, the square of the hypotenuse (the longest side, opposite the right angle) equals the sum of the squares of the other two sides.",
      },
      { type: "formula", latex: "a^2 + b^2 = c^2", note: "c is always the hypotenuse" },
      {
        type: "example",
        title: "Finding the hypotenuse",
        body: "a=3, b=4 → c² = 9+16 = 25 → c = 5 (the classic 3-4-5 triangle).",
      },
      {
        type: "example",
        title: "Finding a shorter side",
        body: "c=13, a=5 → b² = 169−25 = 144 → b = 12.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "The hypotenuse is always the longest side and always opposite the right angle — never one of the legs being squared and added.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "In a right triangle with legs 6 and 8, the hypotenuse is:", options: ["10", "14", "48", "100"], correctIndex: 0, explanation: "6²+8²=36+64=100, √100=10." },
      { id: "q2", prompt: "Which side is always the hypotenuse?", options: ["The shortest side", "Any side you choose", "The side opposite the right angle", "The base"], correctIndex: 2, explanation: "By definition, opposite the right angle." },
      { id: "q3", prompt: "c=17, a=8. Find b.", options: ["9", "15", "225", "13"], correctIndex: 1, explanation: "b²=289−64=225, √225=15." },
      { id: "q4", prompt: "A triangle has sides 5, 12, 13. Is it right-angled?", options: ["Yes, 5²+12²=13²", "No", "Only if it's isosceles", "Cannot tell"], correctIndex: 0, explanation: "25+144=169=13²." },
      { id: "q5", prompt: "Legs 9 and 12 — hypotenuse?", options: ["15", "21", "225", "108"], correctIndex: 0, explanation: "81+144=225, √225=15." },
      { id: "q6", prompt: "Pythagoras' theorem applies to:", options: ["All triangles", "Only right-angled triangles", "Only equilateral triangles", "Only obtuse triangles"], correctIndex: 1, explanation: "It's specific to right-angled triangles." },
      { id: "q7", prompt: "c=10, a=6. Find b.", options: ["4", "8", "64", "16"], correctIndex: 1, explanation: "b²=100−36=64, √64=8." },
    ],
  },
  {
    id: "y8-ratios-rates-percentages",
    title: "Ratios, Rates & Percentages in Money",
    summary:
      "30-min block: simplifying ratios, unit rates, percentage increase/decrease, and simple financial problems.",
    estimatedMinutes: 30,
    year: 8,
    subject: "math",
    strand: "Number · Financial Mathematics",
    content: [
      { type: "heading", text: "Ratios, rates and percentages together" },
      {
        type: "paragraph",
        text: "A ratio compares two quantities of the same kind (3:2). A rate compares two different kinds (60 km/h). A percentage is a rate out of 100, used constantly in discounts, interest and pay rises.",
      },
      {
        type: "example",
        title: "Percentage discount",
        body: "A $80 jacket is 25% off. Discount = 0.25 × 80 = $20. Sale price = $60.",
      },
      {
        type: "example",
        title: "Percentage increase",
        body: "Wage rises from $20/hr to $23/hr. Increase = 3/20 × 100 = 15%.",
      },
      {
        type: "list",
        items: [
          "Simplify ratios by dividing by the highest common factor.",
          "Unit rate = amount ÷ 1 unit (e.g. $ per kg).",
          "Percentage change = (change ÷ original) × 100.",
        ],
      },
    ],
    quiz: [
      { id: "q1", prompt: "Simplify the ratio 18:24.", options: ["3:4", "9:12", "6:8", "2:3"], correctIndex: 0, explanation: "Divide both by HCF 6: 18÷6=3, 24÷6=4." },
      { id: "q2", prompt: "A car travels 240 km in 4 hours. Unit rate?", options: ["60 km/h", "40 km/h", "960 km/h", "6 km/h"], correctIndex: 0, explanation: "240÷4=60 km/h." },
      { id: "q3", prompt: "$60 item, 20% off. Sale price?", options: ["$40", "$48", "$12", "$52"], correctIndex: 1, explanation: "20% of 60=12; 60−12=48." },
      { id: "q4", prompt: "Price rises from $50 to $55. Percentage increase?", options: ["5%", "10%", "50%", "9%"], correctIndex: 1, explanation: "(5÷50)×100=10%." },
      { id: "q5", prompt: "Ratio of 15 boys to 10 girls, simplified:", options: ["3:2", "5:3", "15:10", "2:3"], correctIndex: 0, explanation: "Divide by HCF 5: 15÷5=3, 10÷5=2." },
      { id: "q6", prompt: "Best buy: 2kg for $8, or 3kg for $10.50?", options: ["2kg pack ($4/kg)", "3kg pack ($3.50/kg)", "Same value", "Cannot compare"], correctIndex: 1, explanation: "8÷2=$4/kg vs 10.50÷3=$3.50/kg — 3kg is cheaper per kg." },
      { id: "q7", prompt: "GST of 10% on a $45 item adds:", options: ["$4.50", "$45", "$0.45", "$5.50"], correctIndex: 0, explanation: "10% of 45 = 4.50." },
    ],
  },
  {
    id: "y8-linear-equations",
    title: "Solving Linear Equations",
    summary:
      "30-min block: solving one- and two-step equations, including with negatives and brackets.",
    estimatedMinutes: 30,
    year: 8,
    subject: "math",
    strand: "Algebra",
    content: [
      { type: "heading", text: "Keeping the equation balanced" },
      {
        type: "paragraph",
        text: "An equation is balanced — whatever you do to one side, do to the other. Solve by undoing operations in reverse order (inverse operations).",
      },
      {
        type: "example",
        title: "Two-step equation",
        body: "3x + 5 = 20 → subtract 5: 3x = 15 → divide by 3: x = 5.",
      },
      {
        type: "example",
        title: "With brackets",
        body: "2(x + 4) = 18 → expand: 2x + 8 = 18 → 2x = 10 → x = 5.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Always check your answer by substituting it back into the original equation.",
      },
    ],
    quiz: [
      { id: "q1", prompt: "Solve: x + 7 = 12", options: ["x=5", "x=19", "x=7", "x=−5"], correctIndex: 0, explanation: "Subtract 7 from both sides." },
      { id: "q2", prompt: "Solve: 4x = 28", options: ["x=7", "x=24", "x=32", "x=4"], correctIndex: 0, explanation: "Divide both sides by 4." },
      { id: "q3", prompt: "Solve: 2x − 3 = 11", options: ["x=4", "x=7", "x=8", "x=14"], correctIndex: 1, explanation: "2x=14, x=7." },
      { id: "q4", prompt: "Solve: 3(x − 2) = 15", options: ["x=5", "x=7", "x=3", "x=17"], correctIndex: 1, explanation: "3x−6=15, 3x=21, x=7." },
      { id: "q5", prompt: "Solve: −2x = 10", options: ["x=−5", "x=5", "x=−20", "x=8"], correctIndex: 0, explanation: "Divide both sides by −2." },
      { id: "q6", prompt: "Solve: x/3 + 1 = 4", options: ["x=9", "x=3", "x=15", "x=12"], correctIndex: 0, explanation: "x/3=3, x=9." },
      { id: "q7", prompt: "Check: is x=6 a solution to 2x+1=13?", options: ["Yes", "No", "Only if x is negative", "Cannot check"], correctIndex: 0, explanation: "2(6)+1=13 ✓" },
    ],
  },
  {
    id: "y8-3d-coordinates",
    title: "3D Coordinates & Nets",
    summary:
      "30-min block: locating points in 3D space (x, y, z) and building/reading nets of solids.",
    estimatedMinutes: 30,
    year: 8,
    subject: "math",
    strand: "Space · Geometry",
    content: [
      { type: "heading", text: "Adding a third dimension" },
      {
        type: "paragraph",
        text: "2D points use (x, y). 3D points add a z-axis for height/depth: (x, y, z). Picture the corner of a room — x along the floor, y along the other wall, z going up.",
      },
      {
        type: "example",
        title: "Locating a point",
        body: "The point (2, 3, 4) is 2 units along x, 3 units along y, and 4 units up on z.",
      },
      { type: "heading", text: "Nets" },
      {
        type: "paragraph",
        text: "A net is a 2D shape that folds into a 3D solid. Recognising nets helps calculate surface area and understand a solid's faces, edges and vertices.",
      },
      {
        type: "list",
        items: [
          "A cube has 6 square faces, 12 edges, 8 vertices.",
          "A triangular prism net has 2 triangles + 3 rectangles.",
          "Euler's formula: faces + vertices − edges = 2 (for simple polyhedra).",
        ],
      },
    ],
    quiz: [
      { id: "q1", prompt: "How many coordinates locate a point in 3D space?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "x, y and z." },
      { id: "q2", prompt: "A cube's net is made of how many squares?", options: ["4", "5", "6", "8"], correctIndex: 2, explanation: "A cube has 6 faces." },
      { id: "q3", prompt: "Point (5, 0, 2) — what does the 0 tell you?", options: ["It's at the origin entirely", "The y-coordinate is 0", "It's invalid", "It's negative"], correctIndex: 1, explanation: "The second value is the y-coordinate, here 0." },
      { id: "q4", prompt: "Using Euler's formula, a cube has 6 faces and 8 vertices. How many edges?", options: ["10", "12", "14", "6"], correctIndex: 1, explanation: "F+V−E=2 → 6+8−E=2 → E=12." },
      { id: "q5", prompt: "A triangular prism's net includes:", options: ["6 triangles", "2 triangles and 3 rectangles", "5 rectangles", "3 triangles only"], correctIndex: 1, explanation: "Two triangular ends, three rectangular sides." },
      { id: "q6", prompt: "In (x, y, z), which axis typically represents height?", options: ["x", "y", "z", "None"], correctIndex: 2, explanation: "z conventionally represents height/depth." },
    ],
  },
];
