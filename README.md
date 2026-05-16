# Short Story — Time-Series Foundation Models

**CMPE 258 · Deep Learning · Individual Short-Story Assignment**
**Author:** Nikita Memane · San José State University

A deep-dive review of **time-series foundation models (TSFMs)** — the "pre-train
once, forecast anything" paradigm finally reaching the messiest data modality of
all. This repository contains the full short-story deliverable: a paper review,
an original Medium article, a slide deck, a recorded talk, and a **hands-on
reproduction** of the survey's central claim with real code and real results.

---

## 1. Topic & papers reviewed

**Primary survey (reviewed in depth):**
*Empowering Time Series Analysis with Foundation Models: A Comprehensive Survey* —
Jiexia Ye, Yongzi Yu, Weiqi Zhang, Le Wang, Jia Li, Fugee Tsung —
**arXiv:2405.02358v3 (2025)**. → https://arxiv.org/abs/2405.02358

**Supplementary surveys (woven in):**
- Kottapalli et al., *Foundation Models for Time Series: A Survey*, arXiv:2504.04011 (2025).
- Meyer et al., *Rethinking Evaluation in the Era of Time Series Foundation Models: (Un)Known Information Leakage Challenges*, arXiv:2510.13654 (2025).

PDFs and details: [`paper/`](paper/).

---

## 2. Deliverable links

| Deliverable | Link |
|---|---|
| 📝 Medium article | **_<paste your published Medium URL here>_** |
| 📊 Slides on SlideShare | **_<paste your SlideShare URL here>_** |
| 🎥 Video walkthrough (15–25 min) | **_<paste your YouTube URL here, or see `video/`>_** |
| 💻 GitHub repository (this repo, public) | https://github.com/NMemane1/CMPE258-Short-Story-TS-FM-DeepLearning |

> The Medium article, SlideShare deck, and video are published from the source
> files in this repo. Paste the live links above once published, and add the
> repo link to the class spreadsheet.

---

## 3. Repository structure

```
.
├── README.md                  ← you are here
├── paper/                      ← the 3 survey PDFs + notes
├── medium_article/
│   ├── article.md              ← the full Medium article (original writing)
│   ├── make_figures.py         ← generates all original diagrams
│   └── images/                 ← article figures + reproduction plots
├── slides/
│   ├── TS-FM-Short-Story.pptx  ← the slide deck (18 slides)
│   ├── TS-FM-Short-Story.pdf   ← PDF export (for the video / SlideShare)
│   ├── build_deck.js           ← PptxGenJS deck generator
│   └── slides.md               ← slide-by-slide outline
├── video/
│   └── video_script.md         ← full ~20-min narration script
└── reproduction/               ← the autoresearch-style reproduction
    ├── autoresearch_tsfm_reproduction.ipynb  ← main notebook (executed)
    ├── run_reproduction.py     ← CLI version of the experiment
    ├── requirements.txt
    ├── data/                   ← datasets (downloaded on first run)
    └── results/                ← metrics.csv, summary.md, forecast plots
```

---

## 4. The story in three lines

1. **The map** — Time series was the last modality to get a foundation model.
   The survey shows three build pathways (time-series / language / vision),
   four design challenges, and three architecture families behind ~100 models.
2. **The proof** — I reproduced the core claim: a model pre-trained *once*,
   used **zero-shot**, matches or beats classical models tuned to each series.
3. **The catch** — A 2025 benchmarking study shows test-set contamination can
   inflate scores by 47–184%. The open problem is *trustworthy evaluation*.

---

## 5. The reproduction (autoresearch template)

**Claim tested:** a pre-trained TSFM can forecast an unseen series zero-shot —
no training or tuning on it — and stay competitive with task-specific models.

**Method:** Chronos (`chronos-bolt-small`, ~48M params) used zero-shot vs three
classical baselines (Naive, Seasonal Naive, Exponential Smoothing) — each
*fit per series* — on four classic public datasets.

**Result** (headline metric MASE — lower is better; <1 beats seasonal-naive):

| Method | Mean MASE | Outright wins |
|---|---|---|
| Seasonal Naive | ~1.66 | 0 / 4 |
| Exponential Smoothing *(fit per series)* | ~1.04 | 1 / 4 |
| **Chronos — zero-shot foundation model** | **~0.92** | **2 / 4** |

The zero-shot foundation model achieved a **lower average error than classical
models tuned individually to each series**, in ~1 second of CPU inference, and
produced calibrated uncertainty intervals for free. It does *not* win on a
near-stationary daily series — the survey's "no free lunch" caveat, confirmed.

Full numbers: [`reproduction/results/`](reproduction/results/). Walkthrough:
[`reproduction/README.md`](reproduction/README.md).

### Run it yourself

```bash
cd reproduction
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run_reproduction.py        # or open the notebook
```

Runs on CPU in about a minute.

---

## 6. Reproducing the article figures & slides

```bash
# Figures
cd medium_article && pip install matplotlib numpy pillow && python make_figures.py

# Slide deck
cd slides && npm install && node build_deck.js
```

---

## 7. Notes on originality

The Medium article is **written from scratch** — an original paraphrase and
synthesis of the cited surveys, not copied text. All diagrams in
`medium_article/images/` were created by the author: the conceptual figures
redraw ideas/data from the surveys, and the forecast plots are this project's
own experimental output. The survey papers are credited at the start and end of
the article and in [`paper/`](paper/).

---

*Individual short-story assignment — CMPE 258, San José State University.*
