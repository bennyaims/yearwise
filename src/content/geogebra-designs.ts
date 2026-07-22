/**
 * Fun GeoGebra design studio — beginner → expert.
 * Cool maths art that teaches real curriculum ideas.
 */

import type { ContentBlock, LessonVideo, QuizQuestion, YearLevel } from "@/lib/types";

export type GeoGebraLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type GeoGebraDesign = {
  id: string;
  level: GeoGebraLevel;
  /** Minimum year this design is recommended for */
  yearMin: YearLevel;
  title: string;
  vibe: string;
  /** Maths skills practised */
  maths: string[];
  minutes: number;
  /** What the finished design looks like */
  wow: string;
  /** Step-by-step in GeoGebra Classic */
  steps: string[];
  /** Stretch challenges */
  stretch: string[];
  /** Optional starter commands / inputs */
  inputs?: string[];
  youtube?: LessonVideo;
  quiz: QuizQuestion[];
};

export const GEOGEBRA_LEVELS: {
  id: GeoGebraLevel;
  label: string;
  blurb: string;
  color: string;
}[] = [
  {
    id: "beginner",
    label: "Beginner · Play & paint",
    blurb: "Points, segments, circles, colour — make shapes that look awesome.",
    color: "#4a9b72",
  },
  {
    id: "intermediate",
    label: "Intermediate · Patterns that move",
    blurb: "Sliders, polygons, reflections — designs that transform.",
    color: "#5b8fd4",
  },
  {
    id: "advanced",
    label: "Advanced · Curves & art",
    blurb: "Functions, loci, polar vibes — mathematical neon art.",
    color: "#8b7ec8",
  },
  {
    id: "expert",
    label: "Expert · Dynamic masterpieces",
    blurb: "Parameters, sequences, 3D optional — gallery-level maths design.",
    color: "#d48a5a",
  },
];

export const GEOGEBRA_DESIGNS: GeoGebraDesign[] = [
  // ─── Beginner ───────────────────────────────────────
  {
    id: "gg-star-burst",
    level: "beginner",
    yearMin: 7,
    title: "Star burst from a point",
    vibe: "Firework of coloured rays",
    maths: ["Points", "Segments", "Angles around a point", "Symmetry ideas"],
    minutes: 20,
    wow: "A bright star of rays from one centre — change colours for a night-sky look.",
    steps: [
      "Open GeoGebra Classic (Geometry view).",
      "Place point A at the origin (or centre of the page).",
      "Place 8–12 points around A (B, C, D…).",
      "Join each outer point to A with Segment.",
      "Style → colour each segment differently; thicken lines.",
      "Optional: Circle with centre A through one outer point as a halo.",
      "Screenshot for your portfolio: name it StarBurst-Y7.",
    ],
    stretch: [
      "Make every ray the same length (use Circle + points on circle).",
      "Hide point labels for a clean poster look.",
    ],
    youtube: {
      youtubeId: "WsZjFODgk4U",
      title: "GeoGebra basics — tools you'll use for star burst",
      channel: "GeoGebra",
      why: "Learn move, point, segment, and style before designing.",
      minutes: 12,
      role: "core",
    },
    quiz: [
      {
        id: "gg1q1",
        prompt: "Rays from one centre to outer points are best drawn as:",
        options: ["Random freehand only", "Segments between two points", "Only text boxes", "Spreadsheets"],
        correctIndex: 1,
        explanation: "Segment joins two points with a straight edge — perfect for rays.",
      },
      {
        id: "gg1q2",
        prompt: "If all outer points sit on one circle, the rays have:",
        options: ["Random lengths", "Equal lengths from the centre", "No geometry meaning", "Only integer coordinates"],
        correctIndex: 1,
        explanation: "Radius is constant, so every ray from centre to the circle has equal length.",
      },
    ],
  },
  {
    id: "gg-number-line-art",
    level: "beginner",
    yearMin: 7,
    title: "Number-line city skyline",
    vibe: "Skyline bars at integer heights",
    maths: ["Integers", "Ordering", "Absolute value idea", "Coordinates intro"],
    minutes: 25,
    wow: "A skyline of rectangles sitting on a number line — taller buildings at bigger |n|.",
    steps: [
      "Show axes; zoom so x from −10 to 10 is comfortable.",
      "For integers n = −8, −5, −2, 0, 3, 6, 9: plot points (n, 0).",
      "From each base, draw a vertical segment up to (n, |n|) or (n, n+5 if positive).",
      "Optional: use Polygon to make thin rectangles as buildings.",
      "Colour positives warm (orange) and negatives cool (blue).",
      "Add text labels for 2–3 integers you chose.",
    ],
    stretch: [
      "Rule: height = |n| + 1. Predict heights before drawing.",
      "Mark zero with a special gold tower.",
    ],
    inputs: ["Point: (3,0)", "Segment: (3,0) to (3,3)"],
    quiz: [
      {
        id: "gg2q1",
        prompt: "On a number line, −7 is to the ____ of −2:",
        options: ["Right", "Left", "Same place", "Above"],
        correctIndex: 1,
        explanation: "More negative values sit further left.",
      },
      {
        id: "gg2q2",
        prompt: "If building height is |n|, then n = −4 gives height:",
        options: ["−4", "4", "0", "16"],
        correctIndex: 1,
        explanation: "Absolute value |−4| = 4.",
      },
    ],
  },
  {
    id: "gg-mandala-circles",
    level: "beginner",
    yearMin: 7,
    title: "Circle mandala",
    vibe: "Flower / mandala of overlapping circles",
    maths: ["Circle", "Radius", "Congruent copies", "Intersection"],
    minutes: 25,
    wow: "A flower-like mandala from equal circles — classic compass art, digital edition.",
    steps: [
      "Draw circle c1 centre A radius AB.",
      "Place point C on the circle; circle centre C same radius as c1.",
      "Continue placing centres on previous circle intersections (classic 6-petal).",
      "Use Intersect tool to find petal points.",
      "Colour fill regions with soft transparency.",
      "Hide clutter labels; keep a clean mandala.",
    ],
    stretch: [
      "Second layer with larger radius for a double ring.",
      "Reflect the design over a diameter (Mirror tool).",
    ],
    youtube: {
      youtubeId: "mLeNaZcy-hE",
      title: "Geometry tools mindset (support)",
      channel: "Khan Academy",
      why: "Circles and equal lengths are the math behind mandalas.",
      minutes: 6,
      role: "core",
    },
    quiz: [
      {
        id: "gg3q1",
        prompt: "All circles in a regular petal mandala share the same:",
        options: ["Colour only", "Radius", "Random size", "Text font"],
        correctIndex: 1,
        explanation: "Equal radius makes regular petal patterns.",
      },
    ],
  },

  // ─── Intermediate ───────────────────────────────────
  {
    id: "gg-slider-kaleidoscope",
    level: "intermediate",
    yearMin: 8,
    title: "Slider kaleidoscope",
    vibe: "Symmetry that spins when you drag a slider",
    maths: ["Rotation", "Reflection", "Angles", "Dynamic geometry"],
    minutes: 30,
    wow: "Drag one slider and the whole pattern rotates like a kaleidoscope.",
    steps: [
      "Create slider α from 0° to 360° (or 0 to 2π).",
      "Draw a colourful polygon or freehand polyline seed shape near the origin.",
      "Rotate the seed by α around the origin (Rotate tool / command).",
      "Create 5 more copies rotated by α + 60°, α + 120°, …",
      "Or reflect over lines at equal angles.",
      "Animate the slider (right-click → Animation On) for a living design.",
    ],
    stretch: [
      "Two sliders: angle and scale factor.",
      "Trace the path of a vertex (Locus or Trace On).",
    ],
    inputs: ["Slider: α = 0 to 360", "Rotate[seed, α, origin]"],
    quiz: [
      {
        id: "gg4q1",
        prompt: "A full turn is:",
        options: ["90°", "180°", "360°", "45°"],
        correctIndex: 2,
        explanation: "One full rotation is 360 degrees.",
      },
      {
        id: "gg4q2",
        prompt: "Six equal sectors around a point each measure:",
        options: ["30°", "60°", "90°", "120°"],
        correctIndex: 1,
        explanation: "360° ÷ 6 = 60°.",
      },
    ],
  },
  {
    id: "gg-polygon-tessellation",
    level: "intermediate",
    yearMin: 8,
    title: "Tessellation wallpaper",
    vibe: "Repeating tile pattern that could wallpaper a room",
    maths: ["Polygons", "Translation", "Interior angles", "Tessellation"],
    minutes: 35,
    wow: "A repeating geometric wallpaper from one tile translated across the plane.",
    steps: [
      "Construct a regular hexagon or parallelogram tile.",
      "Colour it boldly.",
      "Translate the tile by a vector u (side length direction).",
      "Translate again by vector v (another side direction).",
      "Fill a grid of copies (repeat translations).",
      "Optional: colour alternate tiles for a checker vibe.",
    ],
    stretch: [
      "Design a non-regular tile that still tessellates (e.g. parallelogram art).",
      "Explain why regular pentagons alone do not tile the plane.",
    ],
    quiz: [
      {
        id: "gg5q1",
        prompt: "A tessellation covers the plane with:",
        options: ["Gaps and overlaps freely", "No gaps and no overlaps", "Only circles", "Only 3D cubes"],
        correctIndex: 1,
        explanation: "Tessellations tile without gaps or overlaps.",
      },
    ],
  },
  {
    id: "gg-function-mountain",
    level: "intermediate",
    yearMin: 9,
    title: "Function mountain range",
    vibe: "Neon graphs as mountain silhouettes",
    maths: ["Linear & quadratic graphs", "Transformations", "Intercepts"],
    minutes: 30,
    wow: "Layered parabolas and lines become a glowing mountain range.",
    steps: [
      "Graph y = −0.2(x−2)² + 5 as a peak.",
      "Add y = −0.15(x+3)² + 4 and y = −0.1(x−6)² + 3.5.",
      "Add a ground line y = 0 and colour fill if available.",
      "Slider a for y = a(x−h)² + k; animate a gently.",
      "Style graphs thick with high contrast colours.",
      "Label one vertex as “summit” with coordinates.",
    ],
    inputs: ["f(x) = -0.2(x-2)^2 + 5", "Slider a"],
    stretch: [
      "Add a linear “ski slope” y = −0.5x + 2 and find intersection with a peak.",
    ],
    youtube: {
      youtubeId: "zUWCot2adcg",
      title: "Patterns & sequences mindset (support)",
      channel: "Khan Academy",
      why: "Seeing structure in changing parameters links to function families.",
      minutes: 9,
      role: "depth",
    },
    quiz: [
      {
        id: "gg6q1",
        prompt: "The vertex of y = −(x−3)² + 7 is at:",
        options: ["(0,7)", "(3,7)", "(−3,7)", "(3,−7)"],
        correctIndex: 1,
        explanation: "Vertex form y = a(x−h)² + k has vertex (h,k) = (3,7).",
      },
    ],
  },

  // ─── Advanced ───────────────────────────────────────
  {
    id: "gg-spiro-trig",
    level: "advanced",
    yearMin: 10,
    title: "Trig spiro art",
    vibe: "Hypnotic curves from sine & cosine",
    maths: ["Trigonometric graphs", "Amplitude", "Period", "Parametric feel"],
    minutes: 35,
    wow: "Overlapping sine waves and polar-style roses that look like sound visualisers.",
    steps: [
      "Graph y = sin(x), y = 2sin(x), y = sin(2x) with different colours.",
      "Add slider A for amplitude: y = A sin(x).",
      "Add slider B for period feel: y = sin(B x).",
      "Optional parametric: Curve[(cos(t), sin(3t)), t, 0, 2π] for a rose-like path.",
      "Trace or animate B slowly.",
      "Dark background style if your theme allows; bright curves.",
    ],
    inputs: [
      "y = A sin(B x)",
      "Curve[(cos(t), sin(3 t)), t, 0, 2 pi]",
    ],
    stretch: [
      "Create a 4-petal rose and explain the 3 in sin(3t).",
      "Compare sin and cos by phase shift.",
    ],
    quiz: [
      {
        id: "gg7q1",
        prompt: "In y = A sin(x), A mainly controls:",
        options: ["Period only", "Amplitude (height)", "Domain only", "Undefined slopes"],
        correctIndex: 1,
        explanation: "Amplitude is the maximum absolute height of the wave.",
      },
    ],
  },
  {
    id: "gg-locus-comet",
    level: "advanced",
    yearMin: 10,
    title: "Locus comet trail",
    vibe: "A point races and leaves a glowing trail",
    maths: ["Locus", "Circle geometry", "Parameters", "Dynamic dependence"],
    minutes: 35,
    wow: "A comet-like trail as a point moves on a circle or line — pure motion geometry.",
    steps: [
      "Create circle c and point P on c.",
      "Create point Q related to P (e.g. midpoint of P and fixed point F, or reflection).",
      "Turn Trace On for Q (or use Locus tool if available).",
      "Animate P around the circle.",
      "Change F and watch the trail morph — that's the power of dependent geometry.",
      "Screenshot three different F positions for a mini gallery.",
    ],
    stretch: [
      "Predict the locus shape before animating (circle? ellipse? line?).",
      "Write one sentence: what stays constant in your construction?",
    ],
    quiz: [
      {
        id: "gg8q1",
        prompt: "A locus is best described as:",
        options: [
          "A single static label",
          "The set of points satisfying a rule / path of a moving point",
          "Only a calculator button",
          "A random scribble with no rule",
        ],
        correctIndex: 1,
        explanation: "Locus = path or set of points under a geometric condition.",
      },
    ],
  },

  // ─── Expert ─────────────────────────────────────────
  {
    id: "gg-family-portrait",
    level: "expert",
    yearMin: 11,
    title: "Function family portrait",
    vibe: "Gallery wall of transformed functions in one frame",
    maths: ["Transformations of functions", "Parameters", "Domain/range insight"],
    minutes: 40,
    wow: "A portrait of y = a f(b(x−h)) + k with sliders — art that teaches transformations.",
    steps: [
      "Start with f(x) = x² or f(x) = |x| or f(x) = sin(x).",
      "Sliders: a, b, h, k with sensible ranges.",
      "Graph g(x) = a f(b(x−h)) + k.",
      "Add a second family (e.g. absolute value) in another colour.",
      "Create a “museum label” text box explaining one transformation in words.",
      "Export / screenshot high-res for portfolio: FunctionFamily-Y11.",
    ],
    inputs: ["a, b, h, k sliders", "g(x) = a sin(b (x - h)) + k"],
    stretch: [
      "Match a mystery graph by only changing sliders (teacher challenge).",
      "Explain which parameter flips the graph upside down.",
    ],
    quiz: [
      {
        id: "gg9q1",
        prompt: "In y = f(x − h), positive h usually:",
        options: [
          "Shifts the graph left",
          "Shifts the graph right",
          "Only changes amplitude",
          "Deletes the graph",
        ],
        correctIndex: 1,
        explanation: "y = f(x − h) shifts right by h for h > 0.",
      },
    ],
  },
  {
    id: "gg-3d-crystal",
    level: "expert",
    yearMin: 11,
    title: "3D crystal (GeoGebra 3D)",
    vibe: "Rotating crystal / polyhedron sculpture",
    maths: ["3D coordinates", "Planes", "Polyhedra", "Spatial reasoning"],
    minutes: 45,
    wow: "A translucent crystal you can spin — geometry you can feel in 3D.",
    steps: [
      "Open GeoGebra 3D Calculator (web or app).",
      "Plot points for a tetrahedron or octahedron vertices.",
      "Create faces with Polygon tools in 3D.",
      "Use Pyramid or Prism tools if available for speed.",
      "Colour faces with transparency; add a circumsphere optional.",
      "Rotate the view and record a short screen capture if allowed.",
    ],
    stretch: [
      "Compute or estimate surface features (edges, faces, vertices — Euler check).",
      "Link to chemistry: crystal lattice as geometric packing (discussion).",
    ],
    quiz: [
      {
        id: "gg10q1",
        prompt: "A tetrahedron has how many triangular faces?",
        options: ["3", "4", "6", "8"],
        correctIndex: 1,
        explanation: "Tetra- = four faces, each a triangle.",
      },
    ],
  },
  {
    id: "gg-param-galaxy",
    level: "expert",
    yearMin: 12,
    title: "Parametric galaxy",
    vibe: "Spiral galaxy from parametric curves",
    maths: ["Parametric equations", "Polar/spiral ideas", "Parameters"],
    minutes: 40,
    wow: "A spiral galaxy of curves — senior maths that looks like space art.",
    steps: [
      "Use Curve[(t cos(t), t sin(t)), t, 0, 8π] for an Archimedean spiral.",
      "Add a second spiral with a phase shift or scale.",
      "Scatter random-looking points with sequences if comfortable.",
      "Slider s to scale: Curve[(s t cos(t), s t sin(t)), t, 0, 8π].",
      "Style thin bright strokes on dark feel.",
      "Write a 3-sentence artist statement: which equation made the spiral?",
    ],
    inputs: ["Curve[(t cos(t), t sin(t)), t, 0, 8 pi]"],
    stretch: [
      "Compare to logarithmic spiral ideas (research extension).",
      "Export for cross-curricular poster with Physics (galaxies) or Art.",
    ],
    quiz: [
      {
        id: "gg11q1",
        prompt: "Parametric curves define x and y in terms of:",
        options: [
          "Only one fixed number forever",
          "A parameter (often t)",
          "Colours only",
          "File size",
        ],
        correctIndex: 1,
        explanation: "Parameter t drives both x(t) and y(t) along the curve.",
      },
    ],
  },
];

export function designsForLevel(level: GeoGebraLevel): GeoGebraDesign[] {
  return GEOGEBRA_DESIGNS.filter((d) => d.level === level);
}

export function designsForYear(year: YearLevel): GeoGebraDesign[] {
  return GEOGEBRA_DESIGNS.filter((d) => d.yearMin <= year);
}

export function designToContentBlocks(d: GeoGebraDesign): ContentBlock[] {
  const blocks: ContentBlock[] = [
    { type: "heading", text: `${d.title} · ${d.vibe}` },
    {
      type: "callout",
      tone: "tip",
      text: `GeoGebra design lab (${d.level}). ${d.wow} Open GeoGebra Classic / 3D and build this for fun — it still teaches real maths: ${d.maths.join(", ")}.`,
    },
    {
      type: "paragraph",
      text: d.wow,
    },
    {
      type: "list",
      ordered: true,
      items: d.steps,
    },
  ];
  if (d.inputs && d.inputs.length > 0) {
    blocks.push({
      type: "example",
      title: "Try these inputs",
      body: d.inputs.join("\n"),
    });
  }
  blocks.push({
    type: "list",
    items: d.stretch.map((s) => `Stretch: ${s}`),
  });
  if (d.youtube) {
    blocks.push({
      type: "video",
      youtubeId: d.youtube.youtubeId,
      title: d.youtube.title,
      channel: d.youtube.channel,
      note: d.youtube.why,
      minutes: d.youtube.minutes,
    });
  }
  return blocks;
}
