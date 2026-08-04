import type { Lesson } from "@/lib/types";

// ENGLISH Y7-12 aligned to Victorian Curriculum F-10 v2.0 + VCE English 1-4
// Each lesson matches your schema: 30 mins, content + depthContent + 6-8 quiz Qs
export const ENGLISH_Y7_12_LESSONS: Lesson[] = [
  // YEAR 7
  {
    id: "y7-english-reading-comprehension",
    title: "Reading Comprehension: Main Idea & Evidence",
    summary: "30-min block: finding main idea, supporting evidence, and inference.",
    estimatedMinutes: 30,
    year: 7,
    subject: "english",
    strand: "Literacy · Reading",
    content: [
      { type: "heading", text: "What is the main idea?" },
      { type: "paragraph", text: "Every paragraph has a main idea — what it's mostly about — supported by details and evidence. Inferences combine what the text says with what you already know." },
      { type: "list", items: ["Main idea = most important point", "Evidence = quotes, facts, examples that support it", "Inference = reading between the lines", "Always ask: who, what, why does it matter?"] },
      { type: "example", title: "Example", body: "'Although it rained all day, Maya practised her violin for two hours because the eisteddfod was tomorrow.' Main idea: Maya is dedicated. Evidence: practised 2 hours despite rain. Inference: eisteddfod matters to her." },
    ],
    quiz: [
      { id: "q1", prompt: "Main idea is:", options: ["A small detail", "The most important point", "A spelling mistake", "The last sentence always"], correctIndex: 1, explanation: "Main idea = central point." },
      { id: "q2", prompt: "Inference needs:", options: ["Text only", "Your knowledge + text evidence", "Guessing", "Ignoring evidence"], correctIndex: 1, explanation: "Combine both." },
      { id: "q3", prompt: "Which is evidence?", options: ["I think it's good", "The text says 'two hours' in line 2", "Maybe", "I like it"], correctIndex: 1, explanation: "Evidence is textual." },
      { id: "q4", prompt: "Best question to find main idea?", options: ["What font is used?", "What is this mostly about?", "How many words?", "Who printed it?"], correctIndex: 1, explanation: "Main idea question." },
      { id: "q5", prompt: "'Despite the cold, they swam' — inference?", options: ["They hate swimming", "They are determined / cold doesn't stop them", "It was hot", "They didn't swim"], correctIndex: 1, explanation: "Despite signals determination." },
      { id: "q6", prompt: "Supporting details do:", options: ["Contradict main idea", "Support main idea", "Replace main idea", "Are irrelevant"], correctIndex: 1, explanation: "Details support main idea." },
    ],
  },
  {
    id: "y7-english-persuasive-structure",
    title: "Persuasive Writing: TEEL & Arguments",
    summary: "30-min block: thesis, TEEL paragraphs, persuasive devices.",
    estimatedMinutes: 30,
    year: 7,
    subject: "english",
    strand: "Writing · Persuasion",
    content: [
      { type: "heading", text: "TEEL structure" },
      { type: "paragraph", text: "Topic sentence, Evidence, Explanation, Link. Persuasive essays need a clear contention, 3 arguments, and rebuttal." },
      { type: "list", items: ["T: State your argument", "E: Quote / fact / example", "E: Explain why it proves your point", "L: Link back to contention"] },
      { type: "example", title: "Persuasive devices", body: "Emotive language, rhetorical questions, statistics, expert quotes, inclusive language (we, us). E.g. 'Should we really allow...?'" },
    ],
    quiz: [
      { id: "q1", prompt: "TEEL stands for:", options: ["Topic, Evidence, Explanation, Link", "Text, Edit, Essay, Learn", "Title, End, Etc, List", "Think, Explore, Evaluate, Learn"], correctIndex: 0, explanation: "Standard paragraph structure." },
      { id: "q2", prompt: "A contention is:", options: ["Your overall position", "A quote", "A spelling error", "A picture"], correctIndex: 0, explanation: "Your argument." },
      { id: "q3", prompt: "Which is a persuasive device?", options: ["Rhetorical question", "Random number", "Blank page", "Silence"], correctIndex: 0, explanation: "Engages reader." },
      { id: "q4", prompt: "Rebuttal means:", options: ["Ignoring opposite view", "Addressing and disproving opposite view", "Repeating intro", "Adding a picture"], correctIndex: 1, explanation: "Shows depth." },
      { id: "q5", prompt: "Evidence in English can be:", options: ["Quote from text, statistic, expert opinion", "Only your feeling", "Nothing", "Only emojis"], correctIndex: 0, explanation: "Needs support." },
      { id: "q6", prompt: "Inclusive language example:", options: ["We all benefit when...", "You are wrong", "I hate everyone", "Whatever"], correctIndex: 0, explanation: "'We' includes reader." },
    ],
  },
  // YEAR 8
  {
    id: "y8-english-text-analysis",
    title: "Text Analysis: Theme & Character",
    summary: "30-min block: analysing how authors construct theme and character.",
    estimatedMinutes: 30,
    year: 8,
    subject: "english",
    strand: "Literature",
    content: [
      { type: "heading", text: "Theme vs topic" },
      { type: "paragraph", text: "Topic = subject (friendship). Theme = message about topic (friendship requires sacrifice). Authors show theme via character change, symbols, motifs." },
      { type: "list", items: ["Character arc: how character changes", "Motif: recurring image/idea", "Symbol: object standing for idea", "Authorial choices: language, structure, perspective"] },
    ],
    quiz: [
      { id: "q1", prompt: "Theme is:", options: ["A message about the topic", "The same as topic", "The title", "The author name"], correctIndex: 0, explanation: "Theme = insight." },
      { id: "q2", prompt: "A symbol:", options: ["Stands for something else", "Is always literal", "Is a spelling mistake", "Is a chapter number"], correctIndex: 0, explanation: "E.g. dove = peace." },
      { id: "q3", prompt: "Character arc means:", options: ["Character's physical walk", "How character changes", "The book cover", "Number of pages"], correctIndex: 1, explanation: "Development." },
      { id: "q4", prompt: "Motif:", options: ["One-off detail", "Recurring element with meaning", "A type of car", "A font"], correctIndex: 1, explanation: "Repeated pattern." },
      { id: "q5", prompt: "To analyse, you should:", options: ["Use evidence + explain author's choice", "Just say you liked it", "Copy plot summary", "Ignore language"], correctIndex: 0, explanation: "Analysis = evidence + technique + effect." },
      { id: "q6", prompt: "'The green light' in Gatsby is an example of:", options: ["Symbol", "Fact", "Footnote", "Index"], correctIndex: 0, explanation: "Symbolises unattainable dream." },
    ],
  },
  // YEAR 9
  {
    id: "y9-english-media-literacy",
    title: "Media Literacy: Bias & Persuasion in News",
    summary: "30-min block: detecting bias, framing, and persuasive language in media — Vic Curriculum Critical & Creative Thinking.",
    estimatedMinutes: 30,
    year: 9,
    subject: "english",
    strand: "Media · Critical Literacy",
    content: [
      { type: "heading", text: "Framing & bias" },
      { type: "paragraph", text: "All media frames reality. Check: word choice, what is included/omitted, images, headlines, source funding. VCE Media Unit 1-2 foundation." },
      { type: "list", items: ["Loaded language: 'flood' vs 'arrival'", "Selection: which voices quoted?", "Omission: what is left out?", "Visuals: cropping, camera angle"] },
    ],
    quiz: [
      { id: "q1", prompt: "Media bias means:", options: ["A slant or perspective", "Always lying", "Only about sports", "No perspective"], correctIndex: 0, explanation: "Bias = perspective, not always intentional lie." },
      { id: "q2", prompt: "Framing is:", options: ["How story is presented to shape interpretation", "The picture frame", "Font size", "Page number"], correctIndex: 0, explanation: "Selection & emphasis." },
      { id: "q3", prompt: "To check reliability you should:", options: ["Check source, corroborate, look for evidence", "Believe first result", "Only read headlines", "Ignore author"], correctIndex: 0, explanation: "Cross-check." },
      { id: "q4", prompt: "'Migrants flood city' uses:", options: ["Neutral language", "Loaded/emotive language", "Scientific language", "No language"], correctIndex: 1, explanation: "'Flood' is metaphor with negative connotation." },
      { id: "q5", prompt: "Omission as bias means:", options: ["Leaving out key info", "Adding extra info", "Using big words", "Using images"], correctIndex: 0, explanation: "What is not said matters." },
      { id: "q6", prompt: "A primary source for a news event is:", options: ["Eyewitness / original data", "Someone retelling", "A meme about it", "A later summary"], correctIndex: 0, explanation: "Direct." },
    ],
  },
  // YEAR 10
  {
    id: "y10-english-argument-analysis",
    title: "Argument Analysis: VCE Foundation",
    summary: "30-min block: identifying contention, arguments, persuasive techniques — direct VCE Units 1-2 skill.",
    estimatedMinutes: 30,
    year: 10,
    subject: "english",
    strand: "VCE Prep · Argument",
    content: [
      { type: "heading", text: "Argument analysis framework" },
      { type: "paragraph", text: "VCE English requires: Identify contention, supporting arguments, persuasive language, visuals, and intended effect on audience. This is core to Units 1-4." },
      { type: "formula", latex: "\\text{Technique} + \\text{Example} + \\text{Effect on Audience} = \\text{Analysis}", note: "Never just list techniques — explain effect" },
    ],
    quiz: [
      { id: "q1", prompt: "Contention is:", options: ["Overall argument author wants you to accept", "A piece of evidence", "A photo caption", "A bibliography"], correctIndex: 0, explanation: "Central claim." },
      { id: "q2", prompt: "Good analysis includes:", options: ["Technique + example + effect", "Just technique name", "Copying text", "No examples"], correctIndex: 0, explanation: "Triple." },
      { id: "q3", prompt: "Intended effect on audience means:", options: ["How author wants audience to feel/think/act", "How you feel only", "Page layout", "Word count"], correctIndex: 0, explanation: "Audience response." },
      { id: "q4", prompt: "Which is persuasive technique?", options: ["Appeal to fear", "Listing ingredients", "Writing date", "Page number"], correctIndex: 0, explanation: "Emotional appeal." },
      { id: "q5", prompt: "Visual analysis should discuss:", options: ["Colour, framing, symbolism, effect", "Only if it's pretty", "Ignore visuals", "Only count people"], correctIndex: 0, explanation: "Visuals persuade too." },
      { id: "q6", prompt: "For VCE, you must:", options: ["Analyse how language persuades, not just what it says", "Only summarise", "Only list", "Write about unrelated topic"], correctIndex: 0, explanation: "How > what." },
    ],
  },
  // YEAR 11-12 VCE
  {
    id: "y11-english-text-response",
    title: "VCE English Units 1-2: Text Response Foundations",
    summary: "30-min block: building text response essays — theme, character, authorial choices, evidence.",
    estimatedMinutes: 35,
    year: 11,
    subject: "english",
    strand: "VCE · Text Response",
    content: [
      { type: "heading", text: "Text response structure" },
      { type: "paragraph", text: "Intro: author, text, contention, 3 arguments. Body: TEEL with embedded quotes. Conclusion: synthesise. Use authorial choices — not just plot." },
      { type: "list", items: ["Avoid retelling plot — analyse", "Embed quotes fluently", "Discuss author's construction", "Link to social/historical context where relevant"] },
    ],
    quiz: [
      { id: "q1", prompt: "Text response should focus on:", options: ["Analysis of ideas and construction", "Only plot summary", "Your life story", "Unrelated text"], correctIndex: 0, explanation: "Analysis over summary." },
      { id: "q2", prompt: "Embedding quotes means:", options: ["Weaving into your own sentence", "Dropping alone as paragraph", "Making up quotes", "No quotes"], correctIndex: 0, explanation: "Fluency." },
      { id: "q3", prompt: "Authorial choices include:", options: ["Symbolism, structure, language, perspective", "Only font", "Only cover colour", "Only price"], correctIndex: 0, explanation: "Craft." },
      { id: "q4", prompt: "A good contention is:", options: ["Clear, debatable, addresses prompt", "Just repeats prompt", "Vague", "Off-topic"], correctIndex: 0, explanation: "Needs own argument." },
      { id: "q5", prompt: "Conclusion should:", options: ["Synthesise arguments", "Introduce new text", "Repeat intro word-for-word", "Add unrelated info"], correctIndex: 0, explanation: "Pull together." },
      { id: "q6", prompt: "VCAA assesses:", options: ["Understanding, analysis, use of evidence, writing", "Only length", "Only handwriting", "Only opinion"], correctIndex: 0, explanation: "Rubric." },
    ],
  },
];
