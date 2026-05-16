// Builds the short-story slide deck: Time-Series Foundation Models.
// Run: node build_deck.js   ->   TS-FM-Short-Story.pptx
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 in
pres.author = "Nikita Memane";
pres.title = "Time-Series Foundation Models — Short Story";

// ---- palette -------------------------------------------------------------
const NAVY = "0B2545";
const NAVY2 = "13315C";
const TEAL = "0FB5A8";
const CORAL = "EF6F6C";
const LIGHT = "F4F7FA";
const CARD = "FFFFFF";
const INK = "1B2A3A";
const MUTED = "5A6B7B";
const W = 13.3, H = 7.5;
const IMG = "../medium_article/images/";

const HEAD = "Georgia";
const BODY = "Calibri";

const IMG_RATIO = {
  "fig1_three_pathways.png": 2.115, "fig2_tsfm_challenges.png": 2.037,
  "fig3_timeline.png": 2.037, "fig4_architectures.png": 2.957,
  "fig5_contamination.png": 2.727, "forecast_AirPassengers.png": 2.75,
  "forecast_Sunspots.png": 2.75, "skill_score.png": 2.25,
};

let pageNo = 1; // slide 1 (title) has no footer; first footer call lands on slide 2

// place an image centered inside a box, preserving aspect ratio
function fitImage(slide, file, bx, by, bw, bh) {
  const r = IMG_RATIO[file];
  let w = bw, h = bw / r;
  if (h > bh) { h = bh; w = bh * r; }
  slide.addImage({ path: IMG + file, x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h });
}

// standard content-slide header (light background)
function header(slide, kicker, title) {
  slide.background = { color: LIGHT };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 0.5, w: 0.22, h: 0.22, fill: { color: TEAL } });
  slide.addText(kicker.toUpperCase(), {
    x: 0.9, y: 0.4, w: 11.8, h: 0.32, fontFace: BODY, fontSize: 12,
    color: TEAL, bold: true, charSpacing: 3, margin: 0,
  });
  slide.addText(title, {
    x: 0.85, y: 0.66, w: 11.9, h: 0.85, fontFace: HEAD, fontSize: 30,
    color: NAVY, bold: true, margin: 0,
  });
  footer(slide);
}

function footer(slide) {
  pageNo += 1;
  slide.addText("Time-Series Foundation Models  ·  CMPE 258 Short Story", {
    x: 0.55, y: 7.04, w: 8, h: 0.3, fontFace: BODY, fontSize: 9, color: MUTED, margin: 0,
  });
  slide.addText(String(pageNo), {
    x: 12.4, y: 7.04, w: 0.4, h: 0.3, fontFace: BODY, fontSize: 9,
    color: MUTED, align: "right", margin: 0,
  });
}

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06, fill: { color: fill || CARD },
    line: { color: "E1E7EE", width: 1 },
    shadow: { type: "outer", color: "9AA7B4", blur: 7, offset: 3, angle: 135, opacity: 0.22 },
  });
}

function notes(slide, t) { slide.addNotes(t); }

// =========================================================================
// SLIDE 1 — TITLE
// =========================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.28, h: H, fill: { color: TEAL } });
  s.addText("CMPE 258  ·  DEEP LEARNING  ·  SHORT STORY", {
    x: 1.0, y: 1.15, w: 11, h: 0.4, fontFace: BODY, fontSize: 14,
    color: TEAL, bold: true, charSpacing: 3, margin: 0,
  });
  s.addText("One Model to Forecast Them All", {
    x: 1.0, y: 1.7, w: 11.6, h: 1.4, fontFace: HEAD, fontSize: 50,
    color: "FFFFFF", bold: true, margin: 0,
  });
  s.addText("The Rise of Time-Series Foundation Models", {
    x: 1.0, y: 3.05, w: 11.6, h: 0.7, fontFace: HEAD, fontSize: 27,
    color: "CADCFC", italic: true, margin: 0,
  });
  s.addText([
    { text: "A review of  ", options: { color: "9DB2C9" } },
    { text: "“Empowering Time Series Analysis with Foundation Models: A Comprehensive Survey”", options: { color: "FFFFFF", bold: true } },
  ], { x: 1.0, y: 4.15, w: 11.4, h: 0.5, fontFace: BODY, fontSize: 15, margin: 0 });
  s.addText("Ye, Yu, Zhang, Wang, Li & Tsung  —  arXiv:2405.02358v3 (2025)", {
    x: 1.0, y: 4.55, w: 11.4, h: 0.4, fontFace: BODY, fontSize: 13, color: "9DB2C9", margin: 0,
  });
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 5.45, w: 4.0, h: 0, line: { color: TEAL, width: 1.5 } });
  s.addText("Nikita Memane   ·   San José State University", {
    x: 1.0, y: 5.6, w: 11, h: 0.4, fontFace: BODY, fontSize: 15, color: "FFFFFF", bold: true, margin: 0,
  });
  s.addText("Plus a hands-on reproduction of the survey's core claim — and why 2025's benchmarks can't be fully trusted.", {
    x: 1.0, y: 6.05, w: 11.2, h: 0.5, fontFace: BODY, fontSize: 13, color: "9DB2C9", italic: true, margin: 0,
  });
  notes(s, "Welcome. This short story reviews a 2025 survey on time-series foundation models. I'll explain what these models are, how they're built, then reproduce the central claim myself, and end with an honest look at the benchmarking crisis. Roughly an 18-slide, 15-20 minute talk.");
}

// =========================================================================
// SLIDE 2 — THE LAST HOLDOUT
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Motivation", "Time series was the last modality to get a foundation model");
  const mods = [
    ["Text", "GPT, Llama", TEAL],
    ["Images", "CLIP, SAM", TEAL],
    ["Audio", "Whisper", TEAL],
    ["Time series", "??? until 2024", CORAL],
  ];
  mods.forEach((m, i) => {
    const x = 0.85 + i * 3.05;
    card(s, x, 1.7, 2.8, 1.35);
    s.addText(m[0], { x: x + 0.2, y: 1.85, w: 2.4, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: NAVY, margin: 0 });
    s.addText(m[1], { x: x + 0.2, y: 2.35, w: 2.4, h: 0.45, fontFace: BODY, fontSize: 13, color: i === 3 ? CORAL : MUTED, bold: i === 3, margin: 0 });
  });
  s.addText("Why time series resisted the “pre-train once, reuse everywhere” recipe:", {
    x: 0.85, y: 3.35, w: 11.6, h: 0.4, fontFace: BODY, fontSize: 16, bold: true, color: NAVY, margin: 0,
  });
  const reasons = [
    ["Data is scarce & siloed", "No internet-scale firehose of signals. Useful series hide in private hospital, factory and bank silos."],
    ["Every dataset has a different shape", "Different sampling rates, channel counts, and meanings — the survey calls it “semantic variability.”"],
    ["Classical methods were already strong", "ARIMA and exponential smoothing are fast and hard to beat on a single clean series."],
  ];
  reasons.forEach((r, i) => {
    const y = 3.85 + i * 1.0;
    s.addShape(pres.shapes.OVAL, { x: 0.9, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: NAVY } });
    s.addText(String(i + 1), { x: 0.9, y: y + 0.05, w: 0.5, h: 0.5, align: "center", fontFace: HEAD, fontSize: 18, bold: true, color: "FFFFFF", margin: 0 });
    s.addText([
      { text: r[0] + "  —  ", options: { bold: true, color: NAVY } },
      { text: r[1], options: { color: INK } },
    ], { x: 1.6, y: y, w: 11, h: 0.62, fontFace: BODY, fontSize: 14, valign: "middle", margin: 0 });
  });
  notes(s, "Text, images and audio all got their foundation-model moment years ago. Time series did not — for three concrete reasons: the data is scarce and fragmented, every dataset has a different shape, and classical methods were already very good. The 2024–25 breakthrough was realising these are engineering problems, not fundamental barriers.");
}

// =========================================================================
// SLIDE 3 — THE QUESTION
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "The Core Idea", "A foundation model: pre-train once, reuse everywhere");
  card(s, 0.85, 1.75, 6.0, 4.7);
  s.addText("What is a foundation model?", { x: 1.15, y: 1.95, w: 5.4, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: NAVY, margin: 0 });
  s.addText([
    { text: "A large network pre-trained on a huge, broad dataset, then reused — often with no further training — across many tasks.", options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: "For time series the tasks are: forecasting, imputation (gap-filling), classification, and anomaly detection.", options: {} },
  ], { x: 1.15, y: 2.5, w: 5.4, h: 1.7, fontFace: BODY, fontSize: 14, color: INK, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.15, y: 4.35, w: 5.4, h: 0.02, fill: { color: "E1E7EE" } });
  s.addText("THE SURVEY", { x: 1.15, y: 4.5, w: 5.4, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText("Ye et al. (2025) map 88 papers — the only survey covering all three build pathways under one “modality-aware, challenge-oriented” lens.", {
    x: 1.15, y: 4.8, w: 5.4, h: 1.4, fontFace: BODY, fontSize: 13, color: INK, margin: 0,
  });

  card(s, 7.1, 1.75, 5.35, 4.7, NAVY);
  s.addText("THE QUESTION THIS TALK ANSWERS", { x: 7.45, y: 2.05, w: 4.7, h: 0.35, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText("Can a model pre-trained once forecast a series it has never seen — with zero training on it — and still beat models tuned to that series?", {
    x: 7.45, y: 2.5, w: 4.7, h: 1.9, fontFace: HEAD, fontSize: 21, color: "FFFFFF", italic: true, margin: 0,
  });
  s.addText("This is the “zero-shot” promise. Slides 11–14 put it to the test on real data.", {
    x: 7.45, y: 5.35, w: 4.7, h: 0.9, fontFace: BODY, fontSize: 13, color: "CADCFC", margin: 0,
  });
  notes(s, "A foundation model is pre-trained once on broad data and reused across tasks. The survey maps 88 papers. The question driving this whole talk: can such a model forecast a series it never saw, zero-shot, and still beat models tuned to that series? I test exactly that later.");
}

// =========================================================================
// SLIDE 4 — THREE PATHWAYS (fig1)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Taxonomy", "Three pathways to a time-series foundation model");
  fitImage(s, "fig1_three_pathways.png", 0.85, 1.5, 8.1, 5.0);
  card(s, 9.2, 1.65, 3.4, 4.85, NAVY);
  const path = [
    ["1 · TSFM", "Pre-train from scratch on billions of real time points."],
    ["2 · LFM", "Reuse a pre-trained LLM; bridge text and signal."],
    ["3 · VFM", "Render the series as an image; reuse a vision model."],
  ];
  path.forEach((p, i) => {
    const y = 1.95 + i * 1.5;
    s.addText(p[0], { x: 9.5, y, w: 2.9, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: TEAL, margin: 0 });
    s.addText(p[1], { x: 9.5, y: y + 0.42, w: 2.85, h: 1.0, fontFace: BODY, fontSize: 12.5, color: "FFFFFF", margin: 0 });
  });
  notes(s, "The survey's central insight: you can reach a time-series foundation model from three starting points. Pathway 1 — pre-train from scratch on raw signals. Pathway 2 — reuse an existing LLM and teach it to read numbers. Pathway 3 — render the series as an image and feed a vision model. Most headline progress is Pathway 1, which the next slides focus on.");
}

// =========================================================================
// SLIDE 5 — FOUR DESIGN CHALLENGES (fig2)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Pathway 1 · TSFM", "Building a TSFM means solving four design challenges");
  fitImage(s, "fig2_tsfm_challenges.png", 0.85, 1.55, 11.6, 3.7);
  const ch = [
    ["Corpus", "Integrate + synthesize data"],
    ["Encoding", "Turn a signal into tokens"],
    ["Architecture", "Pick a Transformer backbone"],
    ["Tasks", "Serve many tasks at once"],
  ];
  ch.forEach((c, i) => {
    const x = 0.85 + i * 2.95;
    card(s, x, 5.4, 2.75, 1.25);
    s.addText(c[0], { x: x + 0.15, y: 5.52, w: 2.45, h: 0.38, fontFace: HEAD, fontSize: 15, bold: true, color: TEAL, margin: 0 });
    s.addText(c[1], { x: x + 0.15, y: 5.9, w: 2.45, h: 0.65, fontFace: BODY, fontSize: 12, color: INK, margin: 0 });
  });
  notes(s, "Pre-training from scratch decomposes into four challenges. One: build a corpus, since no time-series firehose exists — teams integrate every public dataset (LOTSA, Time Series Pile, Time-300B, even a trillion-point corpus) and synthesize more. Two: encoding. Three: architecture. Four: serve forecasting, imputation, classification and anomaly detection together. Almost every TSFM you've heard of is just one set of answers to these four.");
}

// =========================================================================
// SLIDE 6 — TOKENIZATION
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Challenge 2 · Encoding", "How do you turn a continuous signal into tokens?");
  const tok = [
    ["Point-wise", "Each timestamp is one token.", "Time-MoE", NAVY2],
    ["Patch-wise", "Slice into short fixed windows; each window is a token. Most popular choice.", "TimesFM · Moirai · MOMENT", TEAL],
    ["Quantization-wise", "Scale values and bin them into a fixed vocabulary — like words.", "Chronos", CORAL],
  ];
  tok.forEach((t, i) => {
    const x = 0.85 + i * 3.95;
    card(s, x, 1.8, 3.65, 3.5);
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.8, w: 3.65, h: 0.12, fill: { color: t[3] } });
    s.addText(t[0], { x: x + 0.25, y: 2.05, w: 3.2, h: 0.5, fontFace: HEAD, fontSize: 18, bold: true, color: NAVY, margin: 0 });
    s.addText(t[1], { x: x + 0.25, y: 2.6, w: 3.2, h: 1.7, fontFace: BODY, fontSize: 13.5, color: INK, margin: 0 });
    s.addText([{ text: "USED BY  ", options: { color: MUTED, bold: true } }, { text: t[2], options: { color: t[3], bold: true } }],
      { x: x + 0.25, y: 4.55, w: 3.2, h: 0.55, fontFace: BODY, fontSize: 11.5, margin: 0 });
  });
  s.addText("A second hidden choice:  channel independence  vs  channel mixing  — Moirai's “any-variate attention” handles any number of channels.", {
    x: 0.85, y: 5.65, w: 11.6, h: 0.7, fontFace: BODY, fontSize: 14, italic: true, color: NAVY, margin: 0,
  });
  notes(s, "A Transformer eats tokens; a signal is floats. Three recurring answers: point-wise (one token per timestamp), patch-wise (short windows as tokens — the most popular), and quantization-wise, where Chronos bins scaled values into a vocabulary and literally treats forecasting as language modeling. A second choice: treat channels independently or let them mix.");
}

// =========================================================================
// SLIDE 7 — ARCHITECTURE FAMILIES (fig4)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Challenge 3 · Architecture", "Three Transformer backbone families");
  fitImage(s, "fig4_architectures.png", 0.85, 1.55, 11.6, 3.35);
  card(s, 0.85, 5.05, 11.6, 1.55, NAVY);
  s.addText([
    { text: "The pattern across all three surveys:  ", options: { color: "CADCFC" } },
    { text: "decoder-only for forecasting,  encoder-only for representation & multi-task work.", options: { color: "FFFFFF", bold: true } },
  ], { x: 1.15, y: 5.25, w: 11.0, h: 0.55, fontFace: BODY, fontSize: 15, margin: 0 });
  s.addText("It is no accident that the largest TSFMs — Time-MoE, TimesFM — are decoder-only. Chronos is encoder-decoder because it reuses Google's T5 text model almost unchanged.", {
    x: 1.15, y: 5.8, w: 11.0, h: 0.7, fontFace: BODY, fontSize: 12.5, color: "9DB2C9", margin: 0,
  });
  notes(s, "Strip the branding and every TSFM is one of three Transformer shapes. Encoder-only (MOMENT, Moirai) — masked reconstruction, the BERT recipe, great for representations and multi-task. Decoder-only (TimesFM, Time-MoE, Lag-Llama, Timer) — autoregressive next-patch, the GPT recipe, dominates forecasting. Encoder-decoder (Chronos, TimeGPT) — sequence-to-sequence; Chronos reuses T5. Remember: decoder-only for forecasting, encoder-only for multi-task.");
}

// =========================================================================
// SLIDE 8 — THE BOOM (fig3)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Landscape", "The model boom: ~100 models in two years");
  fitImage(s, "fig3_timeline.png", 0.85, 1.5, 8.3, 5.0);
  card(s, 9.4, 1.65, 3.25, 4.85);
  s.addText("What stands out", { x: 9.65, y: 1.85, w: 2.8, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: NAVY, margin: 0 });
  const pts = [
    ["Scale jump", "67M → 2.4B parameters in under a year."],
    ["Vendor land-grab", "Google, Amazon, Salesforce, Nixtla, IBM, Tsinghua."],
    ["Bigger ≠ better", "IBM's Tiny Time Mixers (~1M params) competes — lightweight design is a real research track."],
  ];
  pts.forEach((p, i) => {
    const y = 2.35 + i * 1.35;
    s.addShape(pres.shapes.RECTANGLE, { x: 9.65, y: y + 0.04, w: 0.14, h: 0.14, fill: { color: TEAL } });
    s.addText(p[0], { x: 9.9, y: y - 0.05, w: 2.55, h: 0.35, fontFace: BODY, fontSize: 13, bold: true, color: NAVY, margin: 0 });
    s.addText(p[1], { x: 9.65, y: y + 0.3, w: 2.8, h: 0.95, fontFace: BODY, fontSize: 11.5, color: INK, margin: 0 });
  });
  notes(s, "The pace of 2024–25 is hard to overstate. Parameter counts jumped from 67 million to 2.4 billion in under a year. Every major vendor shipped a model. But the survey's quiet counter-point: bigger is not automatically better — IBM's Tiny Time Mixers, around a million parameters, competes, and lightweight design is a first-class research direction.");
}

// =========================================================================
// SLIDE 9 — MODEL REFERENCE TABLE
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Reference", "The headline TSFMs at a glance");
  const th = (t) => ({ text: t, options: { fill: { color: NAVY }, color: "FFFFFF", bold: true, fontSize: 13, fontFace: BODY } });
  const rows = [
    [th("Model"), th("Builder"), th("Architecture"), th("Tokenization"), th("Scale"), th("Pre-training corpus")],
    ["TimesFM", "Google", "Decoder-only", "Patch-wise", "200M", "~100B points"],
    ["Chronos", "Amazon", "Encoder-decoder (T5)", "Quantization-wise", "710M", "~84B points"],
    ["Moirai", "Salesforce", "Encoder-only", "Patch-wise", "311M", "LOTSA, 27B points"],
    ["MOMENT", "CMU Auton Lab", "Encoder-only", "Patch-wise", "385M", "Time Series Pile, 1.2B"],
    ["Time-MoE", "Time-MoE team", "Decoder-only + MoE", "Point-wise", "2.4B", "Time-300B, 300B points"],
    ["Lag-Llama", "ServiceNow et al.", "Decoder-only", "Point-wise + lags", "200M", "~352M points"],
    ["Timer", "Tsinghua THUML", "Decoder-only", "Patch-wise", "67M", "UTSD, ~1B points"],
  ];
  const body = rows.map((r, ri) => r.map((c) =>
    typeof c === "string"
      ? { text: c, options: { fontSize: 12, fontFace: BODY, color: INK, bold: ri > 0 && false, fill: { color: ri % 2 ? "FFFFFF" : "EAF0F5" } } }
      : c));
  body.forEach((r, ri) => { if (ri > 0) r[0].options.bold = true, r[0].options.color = NAVY; });
  s.addTable(body, {
    x: 0.85, y: 1.75, w: 11.6, colW: [1.7, 1.95, 2.5, 2.15, 1.0, 2.3],
    rowH: 0.6, border: { pt: 1, color: "D6DEE6" }, valign: "middle", align: "left",
    margin: 6,
  });
  s.addText("Decoder-only models dominate pure forecasting; encoder-only models dominate representation and multi-task use. Corpus sizes span six orders of magnitude.", {
    x: 0.85, y: 6.45, w: 11.6, h: 0.5, fontFace: BODY, fontSize: 12.5, italic: true, color: MUTED, margin: 0,
  });
  notes(s, "A compact reference. Note the spread: Google's TimesFM at 200 million parameters, Amazon's Chronos at 710 million reusing T5, Salesforce's Moirai trained on the 27-billion-point LOTSA corpus, and Time-MoE at 2.4 billion parameters on a 300-billion-point corpus. Decoder-only for forecasting, encoder-only for multi-task — the table makes the pattern visible.");
}

// =========================================================================
// SLIDE 10 — PATHWAYS 2 & 3
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "Pathways 2 & 3", "Borrowing brains from language and vision");
  card(s, 0.85, 1.8, 5.7, 4.6);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 1.8, w: 5.7, h: 0.13, fill: { color: "FF7F0E" } });
  s.addText("Language-based models (LFMs)", { x: 1.15, y: 2.05, w: 5.1, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: NAVY, margin: 0 });
  s.addText("Can a model trained only on text forecast numbers? Surprisingly often, yes. Organized by how they bridge signal and language:", {
    x: 1.15, y: 2.55, w: 5.2, h: 0.95, fontFace: BODY, fontSize: 13, color: INK, margin: 0 });
  s.addText([
    { text: "LLMTime — write numbers as digit strings, let GPT continue them.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "Time-LLM — keep the LLM frozen, “reprogram” the series via cross-attention to word embeddings.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "GPT4TS — freeze most of GPT-2, tune only embeddings & norms; still handles 4 tasks.", options: { bullet: true } },
  ], { x: 1.2, y: 3.5, w: 5.15, h: 2.0, fontFace: BODY, fontSize: 12.5, color: INK, margin: 0 });
  s.addText("Recurring theme: parameter-efficient tuning.", { x: 1.15, y: 5.85, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 12, italic: true, color: "FF7F0E", bold: true, margin: 0 });

  card(s, 6.75, 1.8, 5.7, 4.6);
  s.addShape(pres.shapes.RECTANGLE, { x: 6.75, y: 1.8, w: 5.7, h: 0.13, fill: { color: TEAL } });
  s.addText("Vision-based models (VFMs)", { x: 7.05, y: 2.05, w: 5.1, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: NAVY, margin: 0 });
  s.addText("The survey's most surprising chapter: forecasting becomes image completion.", {
    x: 7.05, y: 2.55, w: 5.2, h: 0.7, fontFace: BODY, fontSize: 13, color: INK, margin: 0 });
  s.addText([
    { text: "Render the series as a line plot, heatmap or scalogram.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "VisionTS feeds it to a masked autoencoder pre-trained only on natural images.", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
    { text: "The model “inpaints” the missing future — and it works.", options: { bullet: true } },
  ], { x: 7.1, y: 3.35, w: 5.15, h: 2.0, fontFace: BODY, fontSize: 12.5, color: INK, margin: 0 });
  s.addText("My take: underrated — it quietly reuses the largest pre-trained models on Earth.", {
    x: 7.05, y: 5.7, w: 5.2, h: 0.6, fontFace: BODY, fontSize: 12, italic: true, color: TEAL, bold: true, margin: 0 });
  notes(s, "Pathway 2: language models. The crude LLMTime just writes numbers as digit strings. Time-LLM keeps the LLM frozen and reprograms the series through cross-attention. GPT4TS freezes most of GPT-2. The theme is parameter-efficient tuning. Pathway 3: vision. Render the series as a picture and let a vision model inpaint the future — VisionTS does exactly this with a masked autoencoder trained only on natural images. I think the vision route is underrated.");
}

// =========================================================================
// SLIDE 11 — REPRODUCTION SETUP
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "My Reproduction", "Putting the zero-shot claim to the test");
  card(s, 0.85, 1.8, 6.05, 4.65, NAVY);
  s.addText("THE EXPERIMENT", { x: 1.15, y: 2.05, w: 5.4, h: 0.32, fontFace: BODY, fontSize: 12, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "Model:  ", options: { bold: true, color: TEAL } },
    { text: "Chronos (chronos-bolt-small, ~48M params). Never call .fit() — pure zero-shot.", options: { color: "FFFFFF" } },
  ], { x: 1.15, y: 2.42, w: 5.45, h: 0.85, fontFace: BODY, fontSize: 13.5, margin: 0 });
  s.addText([
    { text: "Data:  ", options: { bold: true, color: TEAL } },
    { text: "4 classic public datasets the model never saw — airline passengers, car sales, sunspots, daily temperatures.", options: { color: "FFFFFF" } },
  ], { x: 1.15, y: 3.3, w: 5.45, h: 1.05, fontFace: BODY, fontSize: 13.5, margin: 0 });
  s.addText([
    { text: "Baselines:  ", options: { bold: true, color: TEAL } },
    { text: "Naive, Seasonal Naive, Exponential Smoothing — each fit individually to its own series.", options: { color: "FFFFFF" } },
  ], { x: 1.15, y: 4.4, w: 5.45, h: 1.0, fontFace: BODY, fontSize: 13.5, margin: 0 });
  s.addText([
    { text: "Metric:  ", options: { bold: true, color: TEAL } },
    { text: "MASE — below 1.0 beats a seasonal-naive forecast; comparable across datasets.", options: { color: "FFFFFF" } },
  ], { x: 1.15, y: 5.4, w: 5.45, h: 0.9, fontFace: BODY, fontSize: 13.5, margin: 0 });

  card(s, 7.15, 1.8, 5.3, 4.65);
  s.addText("The fair fight", { x: 7.45, y: 2.0, w: 4.7, h: 0.42, fontFace: HEAD, fontSize: 17, bold: true, color: NAVY, margin: 0 });
  s.addText("Classical baselines get an unfair advantage — they are trained on the very series they predict. The foundation model gets nothing.", {
    x: 7.45, y: 2.5, w: 4.7, h: 1.1, fontFace: BODY, fontSize: 13, color: INK, margin: 0 });
  card(s, 7.45, 3.65, 4.7, 1.2, "EAF0F5");
  s.addText("Baselines:  fit per series", { x: 7.65, y: 3.8, w: 4.3, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: NAVY2, margin: 0 });
  s.addText("Chronos:  zero training, zero tuning", { x: 7.65, y: 4.2, w: 4.3, h: 0.5, fontFace: BODY, fontSize: 13, bold: true, color: TEAL, margin: 0 });
  s.addText("Runs on a laptop CPU in about one minute. Code + executed notebook in the repo's reproduction/ folder.", {
    x: 7.45, y: 5.0, w: 4.7, h: 1.1, fontFace: BODY, fontSize: 12, italic: true, color: MUTED, margin: 0 });
  notes(s, "Now my own experiment. I used Chronos — the bolt-small model, 48 million parameters — never calling fit, pure zero-shot. I forecast the held-out tail of four classic public datasets the model never saw, against three classical baselines each fit individually to its target series. The baselines get an unfair advantage; the foundation model gets nothing. Headline metric is MASE — below 1 beats seasonal naive.");
}

// =========================================================================
// SLIDE 12 — REPRODUCTION RESULTS (numbers)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "My Reproduction · Result", "Zero-shot beat models tuned to each series");
  const stats = [
    ["~1.66", "Seasonal Naive\nmean MASE", "0 / 4 wins", MUTED],
    ["~1.04", "Exp. Smoothing\nmean MASE  (fit per series)", "1 / 4 wins", NAVY2],
    ["~0.92", "Chronos zero-shot\nmean MASE", "2 / 4 wins", TEAL],
  ];
  stats.forEach((st, i) => {
    const x = 0.85 + i * 3.95;
    const dark = i === 2;
    card(s, x, 1.8, 3.65, 2.6, dark ? NAVY : CARD);
    s.addText(st[0], { x: x + 0.15, y: 1.95, w: 3.35, h: 1.0, fontFace: HEAD, fontSize: 46, bold: true, color: st[3], align: "center", margin: 0 });
    s.addText(st[1], { x: x + 0.15, y: 3.0, w: 3.35, h: 0.85, fontFace: BODY, fontSize: 12.5, color: dark ? "CADCFC" : INK, align: "center", margin: 0 });
    s.addText(st[2], { x: x + 0.15, y: 3.85, w: 3.35, h: 0.4, fontFace: BODY, fontSize: 12, bold: true, color: st[3], align: "center", margin: 0 });
  });
  card(s, 0.85, 4.65, 11.6, 1.9, NAVY2);
  s.addText("The hypothesis holds.", { x: 1.2, y: 4.85, w: 11, h: 0.5, fontFace: HEAD, fontSize: 21, bold: true, color: TEAL, margin: 0 });
  s.addText("A 48M-parameter model that did zero training on these series achieved a lower average error than Exponential Smoothing models each tuned to their own data — in about a second of CPU inference, with no training loop at all. It also produced calibrated uncertainty bands for free.", {
    x: 1.2, y: 5.3, w: 11.0, h: 1.1, fontFace: BODY, fontSize: 14, color: "FFFFFF", margin: 0,
  });
  notes(s, "The result. Seasonal Naive averaged a MASE of 1.66. Exponential Smoothing, fit per series, averaged 1.04. Chronos, zero-shot, averaged 0.92 — and won outright on two of four datasets. A 48-million-parameter model that did zero training on these series beat models tuned to each one, in a second of CPU inference. The hypothesis holds.");
}

// =========================================================================
// SLIDE 13 — SUNSPOTS PLOT
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "My Reproduction · Evidence", "The clearest win: a long-horizon forecast");
  fitImage(s, "forecast_Sunspots.png", 0.85, 1.55, 8.4, 5.0);
  card(s, 9.5, 1.7, 3.1, 4.8, NAVY);
  s.addText("Sunspots", { x: 9.75, y: 1.9, w: 2.6, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: TEAL, margin: 0 });
  s.addText("60-step horizon", { x: 9.75, y: 2.3, w: 2.6, h: 0.35, fontFace: BODY, fontSize: 12, color: "9DB2C9", margin: 0 });
  s.addText([
    { text: "Chronos (blue) anticipates the falling solar cycle.", options: { breakLine: true, paraSpaceAfter: 11 } },
    { text: "Classical baselines collapse to a flat line.", options: { breakLine: true, paraSpaceAfter: 11 } },
    { text: "The shaded band is its 80% prediction interval — uncertainty for free.", options: {} },
  ], { x: 9.75, y: 2.85, w: 2.65, h: 2.6, fontFace: BODY, fontSize: 13, color: "FFFFFF", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 9.75, y: 5.55, w: 2.55, h: 0, line: { color: TEAL, width: 1 } });
  s.addText("MASE 1.01 — the single best score in the whole experiment.", {
    x: 9.75, y: 5.7, w: 2.6, h: 0.7, fontFace: HEAD, fontSize: 12.5, italic: true, color: TEAL, margin: 0 });
  notes(s, "The clearest win. On monthly sunspots over a long 60-step horizon, the classical models simply reverted to a flat mean. Chronos — drawing on broad temporal patterns absorbed during pre-training — anticipated the shape of the declining solar cycle. And the shaded band is its 80% prediction interval: it tells you how confident it is, for free.");
}

// =========================================================================
// SLIDE 14 — SKILL SCORE + HONESTY
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "My Reproduction · Honest Read", "Strong — but not magic");
  fitImage(s, "skill_score.png", 0.85, 1.6, 7.0, 4.9);
  card(s, 8.1, 1.75, 4.4, 2.25);
  s.addText("Where it wins", { x: 8.35, y: 1.9, w: 3.9, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: TEAL, margin: 0 });
  s.addText("Long horizons and rich structure — sunspots, airline passengers. Broad pre-training pays off exactly where classical methods struggle.", {
    x: 8.35, y: 2.3, w: 3.9, h: 1.6, fontFace: BODY, fontSize: 12.5, color: INK, margin: 0 });
  card(s, 8.1, 4.2, 4.4, 2.3, NAVY);
  s.addText("Where it doesn't", { x: 8.35, y: 4.35, w: 3.9, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: CORAL, margin: 0 });
  s.addText("On the near-stationary daily-temperature series, the plain Naive forecast won. The survey's “no free lunch” caveat in miniature — an honest review must say so.", {
    x: 8.35, y: 4.75, w: 3.9, h: 1.7, fontFace: BODY, fontSize: 12.5, color: "FFFFFF", margin: 0 });
  notes(s, "An honest read. The skill score shows the zero-shot model winning on three of four datasets. But it is not magic: on the daily-temperature series — short horizon, near-stationary — the dumb Naive forecast won. Foundation models shine on long horizons and rich structure, and add little where a one-line heuristic already nails it. A good review says that out loud.");
}

// =========================================================================
// SLIDE 15 — CONTAMINATION (fig5)
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "The Catch", "Can we even trust the benchmarks?");
  fitImage(s, "fig5_contamination.png", 0.85, 1.5, 7.5, 5.0);
  card(s, 8.65, 1.65, 3.95, 4.85, NAVY);
  s.addText("Test-set contamination", { x: 8.95, y: 1.85, w: 3.4, h: 0.7, fontFace: HEAD, fontSize: 17, bold: true, color: CORAL, margin: 0 });
  s.addText([
    { text: "If a model pre-trains on “every public dataset,” the benchmark may already be in its training data.", options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: "Only 7% of datasets were never used for pre-training or fine-tuning by some model.", options: { breakLine: true, paraSpaceAfter: 10, bold: true } },
    { text: "0.1% deliberate leakage flattered Moirai by up to 32 MAPE points — and bigger models memorized more.", options: {} },
  ], { x: 8.95, y: 2.62, w: 3.45, h: 2.65, fontFace: BODY, fontSize: 12.5, color: "FFFFFF", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 8.95, y: 5.35, w: 3.4, h: 0, line: { color: CORAL, width: 1 } });
  s.addText("THE FIX", { x: 8.95, y: 5.5, w: 3.4, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true, color: CORAL, charSpacing: 2, margin: 0 });
  s.addText("A continuously advancing temporal split — the test set is always genuine, unseen future.", {
    x: 8.95, y: 5.8, w: 3.45, h: 0.65, fontFace: BODY, fontSize: 12, italic: true, color: "FFFFFF", margin: 0 });
  notes(s, "Now the catch. If a model is pre-trained on every public dataset, how do you know the benchmark wasn't in the training data? That's test-set contamination — the same crisis that haunts LLM evaluation. The Meyer 2025 survey found only 7% of datasets were never used for training by some model. A controlled study showed just 0.1% deliberate leakage flattered Moirai by up to 32 MAPE points — and larger models memorized more, not less. Leaked datasets showed 47 to 184% better scores versus under 14% on clean data.");
}

// =========================================================================
// SLIDE 16 — MY TWO CENTS
// =========================================================================
{
  const s = pres.addSlide();
  header(s, "My Two Cents", "What I actually think after reading three surveys");
  const takes = [
    ["The zero-shot result is real", "I went in skeptical — “fit per series” should win. It didn't. A TSFM is now a strong default baseline you call in one line of code."],
    ["Headline numbers are softer than they look", "After the contamination data, I don't fully trust any leaderboard MASE I haven't checked myself. Accuracy is solved enough; evaluation is not."],
    ["The vision pathway is underrated", "“Render as an image, inpaint the future” sounds like a hack — but it reuses the biggest pre-trained models on Earth."],
    ["The frontier is trust, not scale", "The next milestone isn't a 10B-parameter model. It's one you can audit: clean benchmarks, calibrated uncertainty, interpretability."],
  ];
  takes.forEach((t, i) => {
    const x = 0.85 + (i % 2) * 5.9;
    const y = 1.85 + Math.floor(i / 2) * 2.4;
    card(s, x, y, 5.6, 2.15);
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.45, h: 0.45, fill: { color: TEAL } });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.25, w: 0.45, h: 0.45, align: "center", fontFace: HEAD, fontSize: 15, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(t[0], { x: x + 0.85, y: y + 0.22, w: 4.6, h: 0.7, fontFace: HEAD, fontSize: 15.5, bold: true, color: NAVY, margin: 0 });
    s.addText(t[1], { x: x + 0.3, y: y + 0.95, w: 5.0, h: 1.05, fontFace: BODY, fontSize: 12, color: INK, margin: 0 });
  });
  notes(s, "My two cents. One: the zero-shot result is real — I was skeptical and was wrong; a TSFM is now a strong one-line default baseline. Two: the field's headline numbers are softer than they look — accuracy is solved enough, evaluation is not. Three: the vision pathway is underrated. Four: the real frontier is trust, not scale — a model you can audit, not a bigger one.");
}

// =========================================================================
// SLIDE 17 — CONCLUSION
// =========================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.28, fill: { color: TEAL } });
  s.addText("CONCLUSION", { x: 1.0, y: 0.95, w: 11, h: 0.4, fontFace: BODY, fontSize: 14, bold: true, color: TEAL, charSpacing: 3, margin: 0 });
  s.addText("Pre-train once, predict anything —\nfinally, for time series too.", {
    x: 1.0, y: 1.4, w: 11.3, h: 1.5, fontFace: HEAD, fontSize: 33, bold: true, color: "FFFFFF", margin: 0,
  });
  const c = [
    ["The map", "Three pathways, four design challenges, three architecture families — ~100 models in two years."],
    ["The proof", "My reproduction confirmed the core claim: a zero-shot foundation model matched models tuned per series."],
    ["The open problem", "Trustworthy evaluation. Until benchmarks are contamination-proof, every impressive number deserves a second look."],
  ];
  c.forEach((t, i) => {
    const y = 3.05 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: y + 0.05, w: 0.16, h: 0.16, fill: { color: TEAL } });
    s.addText([
      { text: t[0] + "  —  ", options: { bold: true, color: TEAL } },
      { text: t[1], options: { color: "FFFFFF" } },
    ], { x: 1.35, y: y - 0.08, w: 11.0, h: 0.9, fontFace: BODY, fontSize: 15, valign: "middle", margin: 0 });
  });
  s.addText("The work that remains is making sure we can believe the predictions.", {
    x: 1.0, y: 6.55, w: 11.3, h: 0.5, fontFace: HEAD, fontSize: 16, italic: true, color: "CADCFC", margin: 0,
  });
  notes(s, "To conclude. The survey gives us the map: three pathways, four challenges, three architectures, a hundred models. My reproduction gives the proof: zero-shot really works. And the 2025 benchmarking survey gives the cold shower: the open problem is trustworthy evaluation. Pre-train once, predict anything has finally reached time series — the work that remains is making sure we can believe the predictions.");
}

// =========================================================================
// SLIDE 18 — REFERENCES / THANK YOU
// =========================================================================
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.28, h: H, fill: { color: TEAL } });
  s.addText("References & Links", { x: 0.95, y: 0.7, w: 11, h: 0.7, fontFace: HEAD, fontSize: 30, bold: true, color: NAVY, margin: 0 });
  const refs = [
    "1.  Ye, Yu, Zhang, Wang, Li, Tsung. “Empowering Time Series Analysis with Foundation Models: A Comprehensive Survey.” arXiv:2405.02358v3, 2025.  (primary paper reviewed)",
    "2.  Kottapalli et al. “Foundation Models for Time Series: A Survey.” arXiv:2504.04011, 2025.",
    "3.  Meyer, Kaltenpoth, Zalipski, Müller. “Rethinking Evaluation in the Era of Time Series Foundation Models: (Un)Known Information Leakage Challenges.” arXiv:2510.13654, 2025.",
    "4.  Ansari et al. “Chronos: Learning the Language of Time Series.” TMLR, 2024.",
    "5.  Das, Kong, Sen, Zhou. “A Decoder-Only Foundation Model for Time-Series Forecasting” (TimesFM). ICML, 2024.",
  ];
  s.addText(refs.map((r) => ({ text: r, options: { breakLine: true, paraSpaceAfter: 9 } })), {
    x: 0.95, y: 1.6, w: 11.6, h: 2.7, fontFace: BODY, fontSize: 12.5, color: INK, margin: 0,
  });
  card(s, 0.95, 4.5, 11.5, 1.5, NAVY);
  s.addText("GitHub repository — code, executed notebook, article, slides & video", {
    x: 1.25, y: 4.7, w: 10.9, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: TEAL, margin: 0 });
  s.addText("github.com/NMemane1/CMPE258-Short-Story-TS-FM-DeepLearning", {
    x: 1.25, y: 5.1, w: 10.9, h: 0.45, fontFace: "Consolas", fontSize: 15, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Medium article + reproduction figures linked in the repository README.", {
    x: 1.25, y: 5.5, w: 10.9, h: 0.4, fontFace: BODY, fontSize: 11.5, color: "9DB2C9", margin: 0 });
  s.addText("Thank you  —  Nikita Memane  ·  CMPE 258, San José State University", {
    x: 0.95, y: 6.35, w: 11.5, h: 0.5, fontFace: HEAD, fontSize: 15, bold: true, color: NAVY, margin: 0 });
  notes(s, "References and links. The primary paper reviewed is the Ye et al. 2025 survey, supported by two further 2025 surveys. All code, the executed notebook, the article, these slides and the video are in the GitHub repository shown. Thank you.");
}

pres.writeFile({ fileName: "TS-FM-Short-Story.pptx" }).then(() => console.log("deck written: TS-FM-Short-Story.pptx"));
