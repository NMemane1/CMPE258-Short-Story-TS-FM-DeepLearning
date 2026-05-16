# Papers Reviewed

This short story reviews **time-series foundation models**, built primarily on
one comprehensive survey and supported by two further 2025 papers. PDFs are
included here for convenience; all are openly available on arXiv.

## Primary paper

**Empowering Time Series Analysis with Foundation Models: A Comprehensive Survey**
Jiexia Ye, Yongzi Yu, Weiqi Zhang, Le Wang, Jia Li, Fugee Tsung.
arXiv:2405.02358, **v3 (2025)** — HKUST (Guangzhou) / HKUST / SUFE.
File: `Ye2025_TS-FM-Survey_arXiv2405.02358v3.pdf` — https://arxiv.org/abs/2405.02358

Covers 88 papers. The only survey to treat all three build pathways — time-series,
language-based, and vision-based foundation models — under one modality-aware,
challenge-oriented taxonomy. This is the paper the article and slides summarize.

## Supplementary papers

**Foundation Models for Time Series: A Survey**
Siva Rama Krishna Kottapalli et al. arXiv:2504.04011 (April 2025).
File: `Kottapalli2025_FM-for-TS-Survey_arXiv2504.04011.pdf` — https://arxiv.org/abs/2504.04011

Contributes a clean six-dimensional taxonomy (architecture, patching, objective,
univariate/multivariate, probabilistic/deterministic, scale).

**Rethinking Evaluation in the Era of Time Series Foundation Models: (Un)Known
Information Leakage Challenges**
Marcel Meyer, Sascha Kaltenpoth, Kevin Zalipski, Oliver Müller.
arXiv:2510.13654 (October 2025) — Paderborn University.
File: `Meyer2025_TSFM-Benchmarking_arXiv2510.13654.pdf` — https://arxiv.org/abs/2510.13654

Documents the test-set contamination crisis in TSFM benchmarking — the basis for
the article's closing section.

## How these are used

- The **Medium article** (`../medium_article/article.md`) rewrites and synthesizes
  these papers in original prose, with original diagrams.
- The **reproduction** (`../reproduction/`) tests the primary survey's central
  zero-shot claim with code.
- The **slide deck** and **video** (`../slides/`, `../video/`) present the story.
