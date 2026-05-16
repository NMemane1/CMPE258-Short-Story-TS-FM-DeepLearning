"""
Autoresearch reproduction: Zero-shot forecasting with a Time-Series Foundation Model.

Short Story / CMPE 258 -- reproduces the central claim of the survey
"Empowering Time Series Analysis with Foundation Models: A Comprehensive Survey"
(Ye et al., arXiv:2405.02358v3): a model pre-trained once on a large, diverse
time-series corpus can forecast a brand-new series *zero-shot* -- with no
training, fine-tuning, or hyper-parameter search on the target data -- and stay
competitive with classical task-specific models.

We use Chronos / Chronos-Bolt (Amazon Science) as the foundation model and
benchmark it against three classical baselines (Naive, Seasonal Naive,
Exponential Smoothing) on four classic public datasets.

Run:  python run_reproduction.py
Output: results/metrics.csv, results/summary.md, results/forecast_*.png,
        results/skill_score.png
"""

import os
import time
import urllib.request
import warnings

import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

warnings.filterwarnings("ignore")

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(HERE, "data")
RESULTS_DIR = os.path.join(HERE, "results")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# The pre-trained foundation model. chronos-bolt-small (~48M params) runs on CPU
# in seconds. It was pre-trained by Amazon on ~100B time points and never saw
# any of the four datasets used as our "target" tasks below.
MODEL_NAME = "amazon/chronos-bolt-small"

# ---------------------------------------------------------------------------
# 1. DATASETS  --  four classic, public, single-series benchmarks.
#    Each is held out: the model forecasts the final `horizon` points using
#    only the points before them as context.
# ---------------------------------------------------------------------------
BASE = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/"
DATASETS = {
    "AirPassengers": dict(
        file="airline-passengers.csv", value_col="Passengers",
        season=12, horizon=24, label="Monthly airline passengers (1949-1960)"),
    "CarSales": dict(
        file="monthly-car-sales.csv", value_col="Sales",
        season=12, horizon=12, label="Monthly car sales (1960-1968)"),
    "Sunspots": dict(
        file="monthly-sunspots.csv", value_col="Sunspots",
        season=12, horizon=60, label="Monthly sunspot counts (1749-1983)"),
    "MinTemp": dict(
        file="daily-min-temperatures.csv", value_col="Temp",
        season=7, horizon=30, label="Daily minimum temperature, Melbourne (1981-1990)"),
}


def load_series(name, cfg):
    """Download once into data/, then load the value column as a numpy array."""
    path = os.path.join(DATA_DIR, cfg["file"])
    if not os.path.exists(path):
        print(f"  downloading {cfg['file']} ...")
        urllib.request.urlretrieve(BASE + cfg["file"], path)
    df = pd.read_csv(path)
    series = pd.to_numeric(df[cfg["value_col"]], errors="coerce").dropna().values
    return series.astype(np.float32)


# ---------------------------------------------------------------------------
# 2. METRICS
# ---------------------------------------------------------------------------
def mae(y, f):
    return float(np.mean(np.abs(y - f)))


def rmse(y, f):
    return float(np.sqrt(np.mean((y - f) ** 2)))


def smape(y, f):
    denom = np.abs(y) + np.abs(f)
    denom[denom == 0] = 1e-8
    return float(200.0 * np.mean(np.abs(y - f) / denom))


def mase(y, f, train, season):
    """Mean Absolute Scaled Error: MAE scaled by the in-sample seasonal-naive MAE.
    MASE < 1 means the forecast beats a seasonal-naive forecast on the history."""
    if len(train) > season:
        scale = np.mean(np.abs(train[season:] - train[:-season]))
    else:
        scale = np.mean(np.abs(np.diff(train)))
    scale = scale if scale > 0 else 1e-8
    return float(mae(y, f) / scale)


# ---------------------------------------------------------------------------
# 3. CLASSICAL BASELINES (each is "trained" only on the target series' history)
# ---------------------------------------------------------------------------
def naive_forecast(train, h):
    return np.repeat(train[-1], h)


def seasonal_naive_forecast(train, h, season):
    reps = int(np.ceil(h / season))
    return np.tile(train[-season:], reps)[:h]


def ets_forecast(train, h, season):
    from statsmodels.tsa.holtwinters import ExponentialSmoothing
    try:
        seasonal = "add" if len(train) > 2 * season else None
        model = ExponentialSmoothing(
            train, trend="add", seasonal=seasonal,
            seasonal_periods=season if seasonal else None,
        ).fit()
        return np.asarray(model.forecast(h), dtype=np.float32)
    except Exception:
        return seasonal_naive_forecast(train, h, season)


# ---------------------------------------------------------------------------
# 4. THE FOUNDATION MODEL  --  zero-shot, no training on the target series
# ---------------------------------------------------------------------------
def load_foundation_model():
    import torch
    from chronos import BaseChronosPipeline

    print(f"Loading foundation model: {MODEL_NAME}")
    pipe = BaseChronosPipeline.from_pretrained(
        MODEL_NAME, device_map="cpu", torch_dtype=torch.float32,
    )
    return pipe


def fm_forecast(pipe, train, h):
    """Zero-shot forecast: feed history as context, read out the prediction.
    Returns (median, low_10, high_90) so we can also draw uncertainty bands."""
    import torch

    context = torch.tensor(train, dtype=torch.float32)
    quantiles, _ = pipe.predict_quantiles(
        context=context, prediction_length=h,
        quantile_levels=[0.1, 0.5, 0.9],
    )
    q = quantiles[0].numpy()  # shape (h, 3)
    return q[:, 1], q[:, 0], q[:, 2]


# ---------------------------------------------------------------------------
# 5. EXPERIMENT
# ---------------------------------------------------------------------------
def main():
    pipe = load_foundation_model()
    rows = []
    fm_bands = {}

    for name, cfg in DATASETS.items():
        print(f"\n=== {name} ===")
        series = load_series(name, cfg)
        h, season = cfg["horizon"], cfg["season"]
        train, test = series[:-h], series[-h:]
        print(f"  length={len(series)}  train={len(train)}  test/horizon={h}")

        methods = {}
        methods["Naive"] = naive_forecast(train, h)
        methods["SeasonalNaive"] = seasonal_naive_forecast(train, h, season)
        methods["ExpSmoothing"] = ets_forecast(train, h, season)

        t0 = time.time()
        fm_median, fm_lo, fm_hi = fm_forecast(pipe, train, h)
        fm_time = time.time() - t0
        methods["Chronos (zero-shot FM)"] = fm_median
        fm_bands[name] = (fm_lo, fm_hi)
        print(f"  Chronos zero-shot inference: {fm_time:.2f}s")

        for method, fc in methods.items():
            fc = np.asarray(fc, dtype=np.float32)
            rows.append(dict(
                dataset=name, method=method,
                MAE=round(mae(test, fc), 3),
                RMSE=round(rmse(test, fc), 3),
                sMAPE=round(smape(test, fc), 3),
                MASE=round(mase(test, fc, train, season), 4),
            ))

        plot_forecast(name, cfg, train, test, methods, fm_bands[name])

    df = pd.DataFrame(rows)
    df.to_csv(os.path.join(RESULTS_DIR, "metrics.csv"), index=False)
    print("\n===== METRICS =====")
    print(df.to_string(index=False))

    plot_skill_scores(df)
    write_summary(df)
    print(f"\nAll artifacts written to {RESULTS_DIR}/")


# ---------------------------------------------------------------------------
# 6. PLOTS
# ---------------------------------------------------------------------------
def plot_forecast(name, cfg, train, test, methods, fm_band):
    h = cfg["horizon"]
    ctx = min(len(train), max(3 * h, 60))
    x_train = np.arange(len(train))
    x_test = np.arange(len(train), len(train) + h)

    plt.figure(figsize=(11, 4.5))
    plt.plot(x_train[-ctx:], train[-ctx:], color="#444", lw=1.2, label="History")
    plt.plot(x_test, test, color="black", lw=2.4, label="Actual (held out)")

    fm_lo, fm_hi = fm_band
    plt.fill_between(x_test, fm_lo, fm_hi, color="#1f77b4", alpha=0.20,
                     label="Chronos 80% interval")
    styles = {"Naive": ("#999999", "--"), "SeasonalNaive": ("#2ca02c", "--"),
              "ExpSmoothing": ("#ff7f0e", "-."), "Chronos (zero-shot FM)": ("#1f77b4", "-")}
    for method, fc in methods.items():
        c, ls = styles[method]
        lw = 2.4 if "Chronos" in method else 1.5
        plt.plot(x_test, fc, color=c, ls=ls, lw=lw, label=method)

    plt.axvline(len(train) - 0.5, color="red", ls=":", alpha=0.6)
    plt.title(f"{name} -- {cfg['label']}\nZero-shot foundation model vs classical baselines")
    plt.xlabel("Time index")
    plt.ylabel(cfg["value_col"])
    plt.legend(fontsize=8, ncol=2)
    plt.tight_layout()
    out = os.path.join(RESULTS_DIR, f"forecast_{name}.png")
    plt.savefig(out, dpi=130)
    plt.close()
    print(f"  saved {out}")


def plot_skill_scores(df):
    """Skill score = 1 - MASE_method / MASE_seasonalnaive. >0 beats seasonal naive."""
    datasets = list(df["dataset"].unique())
    methods = ["ExpSmoothing", "Chronos (zero-shot FM)"]
    width = 0.35
    x = np.arange(len(datasets))
    plt.figure(figsize=(9, 4.5))
    for i, method in enumerate(methods):
        scores = []
        for d in datasets:
            sub = df[df["dataset"] == d]
            base = sub[sub["method"] == "SeasonalNaive"]["MASE"].values[0]
            m = sub[sub["method"] == method]["MASE"].values[0]
            scores.append(1 - m / base)
        color = "#1f77b4" if "Chronos" in method else "#ff7f0e"
        plt.bar(x + i * width, scores, width, label=method, color=color)
    plt.axhline(0, color="black", lw=0.8)
    plt.xticks(x + width / 2, datasets)
    plt.ylabel("Skill score vs Seasonal Naive\n(higher is better, >0 = wins)")
    plt.title("Zero-shot foundation model vs tuned Exponential Smoothing")
    plt.legend()
    plt.tight_layout()
    out = os.path.join(RESULTS_DIR, "skill_score.png")
    plt.savefig(out, dpi=130)
    plt.close()
    print(f"saved {out}")


def write_summary(df):
    lines = ["# Reproduction Results\n",
             f"Foundation model: `{MODEL_NAME}` (zero-shot, no fine-tuning).\n",
             "## Metrics (lower is better)\n",
             df.to_markdown(index=False), "\n## Per-dataset winner (by MASE)\n"]
    wins = {}
    for d in df["dataset"].unique():
        sub = df[df["dataset"] == d].sort_values("MASE")
        best = sub.iloc[0]
        wins[best["method"]] = wins.get(best["method"], 0) + 1
        lines.append(f"- **{d}**: {best['method']} (MASE={best['MASE']})")
    lines.append("\n## Win count\n")
    for m, c in sorted(wins.items(), key=lambda kv: -kv[1]):
        lines.append(f"- {m}: {c}")
    fm = df[df["method"] == "Chronos (zero-shot FM)"]["MASE"].mean()
    ets = df[df["method"] == "ExpSmoothing"]["MASE"].mean()
    sn = df[df["method"] == "SeasonalNaive"]["MASE"].mean()
    lines.append(
        f"\n## Mean MASE across datasets\n"
        f"- Chronos (zero-shot FM): {fm:.3f}\n"
        f"- ExpSmoothing (fit per series): {ets:.3f}\n"
        f"- SeasonalNaive: {sn:.3f}\n")
    with open(os.path.join(RESULTS_DIR, "summary.md"), "w") as f:
        f.write("\n".join(lines))
    print(f"saved {os.path.join(RESULTS_DIR, 'summary.md')}")


if __name__ == "__main__":
    main()
