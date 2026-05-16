# Reproduction — Zero-Shot Forecasting with a Time-Series Foundation Model

This folder reproduces the **central claim** of the survey *Empowering Time
Series Analysis with Foundation Models* (Ye et al., arXiv:2405.02358v3): a model
pre-trained once on a large, diverse time-series corpus can forecast a
**brand-new series zero-shot** — with no training or tuning on the target data —
and stay competitive with classical task-specific models.

It follows the **autoresearch** template: research question → hypothesis →
controlled experiment → honest results with figures.

## What is compared

| Method | Trained on the target series? |
|---|---|
| Naive (last value) | only its own history |
| Seasonal Naive | only its own history |
| Exponential Smoothing (Holt-Winters) | fit per series |
| **Chronos `chronos-bolt-small`** (foundation model) | **no — zero-shot** |

Four classic public datasets: AirPassengers, Monthly Car Sales, Monthly
Sunspots, Daily Minimum Temperatures. For each, the final `horizon` points are
held out and forecast from the history alone.

## How to run

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python run_reproduction.py         # CLI version
# or open autoresearch_tsfm_reproduction.ipynb  (notebook version)
```

Runs on CPU in ~1 minute. Datasets download once into `data/`; the foundation
model (~48M params) is cached by Hugging Face on first use.

## Result (CPU run, headline metric: MASE — lower is better, <1 beats seasonal-naive)

| Method | Mean MASE | Outright wins |
|---|---|---|
| Seasonal Naive | ~1.66 | 0 / 4 |
| Exponential Smoothing (fit per series) | ~1.04 | 1 / 4 |
| **Chronos (zero-shot foundation model)** | **~0.92** | **2 / 4** |

**The hypothesis holds:** a foundation model that did *zero* training on these
series achieved a lower mean MASE than Exponential Smoothing models fit
individually to each one, and produced calibrated uncertainty bands for free.
Biggest win: Sunspots (long 60-step horizon). It does *not* win on the
near-stationary MinTemp series, matching the survey's "no free lunch" caveat.

See `results/summary.md` and `results/metrics.csv` for full numbers, and
`results/forecast_*.png` / `results/skill_score.png` for the figures.

## Files

| File | Purpose |
|---|---|
| `run_reproduction.py` | End-to-end experiment (CLI) |
| `autoresearch_tsfm_reproduction.ipynb` | Notebook version with narrative + executed outputs |
| `_build_notebook.py` | Generator that builds the notebook (for reproducibility) |
| `requirements.txt` | Pinned dependencies |
| `data/` | Datasets (downloaded on first run) |
| `results/` | Generated metrics, summary, and figures |
