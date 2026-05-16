"""Generates original diagrams for the Medium article into images/.
All figures are drawn from scratch (no copyrighted figures reused).
Run: python make_figures.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT, exist_ok=True)
BLUE, ORANGE, GREEN, GREY = "#1f77b4", "#ff7f0e", "#2ca02c", "#555555"


def box(ax, x, y, w, h, text, fc, fs=10, tc="white"):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.012",
                 fc=fc, ec="black", lw=1.1))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fs, color=tc, wrap=True)


def arrow(ax, x1, y1, x2, y2, color="black"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>",
                 mutation_scale=16, lw=1.6, color=color))


# ---------------------------------------------------------------------------
# FIG 1 -- Three pathways to a time-series foundation model
# ---------------------------------------------------------------------------
def fig_pathways():
    fig, ax = plt.subplots(figsize=(11, 5.2))
    ax.set_xlim(0, 12); ax.set_ylim(0, 6.6); ax.axis("off")
    ax.text(6, 6.25, "Three Pathways to a Time-Series Foundation Model",
            ha="center", fontsize=14, fontweight="bold")

    box(ax, 4.4, 5.1, 3.2, 0.7, "A new time series\nto forecast / classify", "#333333", 10)

    cols = [
        (0.4, BLUE, "PATHWAY 1\nTime-Series FM (TSFM)",
         "Pre-train from scratch\non billions of time points",
         "TimesFM  ·  Chronos\nMoirai  ·  MOMENT\nTime-MoE  ·  Lag-Llama"),
        (4.4, ORANGE, "PATHWAY 2\nLanguage-based FM (LFM)",
         "Reuse a pre-trained LLM,\nbridge text <-> signal",
         "GPT4TS  ·  Time-LLM\nLLMTime  ·  TEMPO\nPromptCast  ·  CALF"),
        (8.4, GREEN, "PATHWAY 3\nVision-based FM (VFM)",
         "Turn series into images,\nreuse a vision model",
         "VisionTS  ·  ViTST\nViTime  ·  Time-VLM\nITF-TAD"),
    ]
    for x, c, head, mid, models in cols:
        box(ax, x, 3.7, 3.2, 0.95, head, c, 10)
        box(ax, x, 2.35, 3.2, 1.0, mid, "white", 9, tc="black")
        box(ax, x, 0.55, 3.2, 1.45, models, "#f0f0f0", 9, tc="black")
        arrow(ax, 6, 5.1, x + 1.6, 4.68, c)
        arrow(ax, x + 1.6, 3.7, x + 1.6, 3.37, c)
        arrow(ax, x + 1.6, 2.35, x + 1.6, 2.02, c)
    ax.text(6, 0.12, "Survey: Ye et al., 'Empowering Time Series Analysis with "
            "Foundation Models' (arXiv:2405.02358v3, 2025)",
            ha="center", fontsize=8, style="italic", color=GREY)
    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "fig1_three_pathways.png"), dpi=140)
    plt.close()


# ---------------------------------------------------------------------------
# FIG 2 -- The four design challenges of a TSFM
# ---------------------------------------------------------------------------
def fig_tsfm_challenges():
    fig, ax = plt.subplots(figsize=(11, 5.4))
    ax.set_xlim(0, 12); ax.set_ylim(0, 6.4); ax.axis("off")
    ax.text(6, 6.05, "Building a Time-Series Foundation Model: Four Design Challenges",
            ha="center", fontsize=13, fontweight="bold")
    items = [
        ("1. Pre-training corpus", BLUE,
         "Time series are scarce &\nfragmented vs text/images.\nFix: integrate (LOTSA, Time\nSeries Pile) + synthesize\n(KernelSynth, Freq-Mix)"),
        ("2. Input encoding", ORANGE,
         "How to tokenize a signal?\n- point-wise\n- patch-wise (windows)\n- quantization-wise (bins)\nChannels: mix vs independent"),
        ("3. Architecture", GREEN,
         "Transformer backbone:\nencoder / decoder / enc-dec.\nEfficiency add-ons:\nmixture-of-experts,\nfrequency decomposition"),
        ("4. Task configuration", "#9467bd",
         "Serve many tasks at once:\nforecasting, imputation,\nclassification, anomaly\ndetection -- via task heads\nor one generative format"),
    ]
    for i, (head, c, body) in enumerate(items):
        x = 0.4 + i * 2.95
        box(ax, x, 4.55, 2.7, 0.7, head, c, 9.5)
        box(ax, x, 1.05, 2.7, 3.25, body, "white", 8.6, tc="black")
        arrow(ax, x + 1.35, 4.55, x + 1.35, 4.32, c)
    ax.text(6, 0.45, "A TSFM must solve all four to forecast an unseen series "
            "zero-shot.", ha="center", fontsize=9, style="italic", color=GREY)
    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "fig2_tsfm_challenges.png"), dpi=140)
    plt.close()


# ---------------------------------------------------------------------------
# FIG 3 -- Model timeline / parameter-scale bubble chart
# ---------------------------------------------------------------------------
def fig_timeline():
    # (name, year-fraction, params in millions, family, label-offset in points)
    models = [
        ("PromptCast", 2022.8, 0.4, "LFM", (0, 16)),
        ("GPT4TS", 2023.12, 117, "LFM", (0, 17)),
        ("TimeGPT", 2023.78, 1000, "TSFM", (0, 19)),
        ("LLMTime", 2023.97, 7000, "LFM", (-6, 21)),
        ("Time-LLM", 2024.12, 7000, "LFM", (42, 6)),
        ("Lag-Llama", 2024.04, 200, "TSFM", (-34, -4)),
        ("Timer", 2024.13, 67, "TSFM", (0, -20)),
        ("MOMENT", 2024.19, 385, "TSFM", (-10, 21)),
        ("Moirai", 2024.24, 311, "TSFM", (30, 15)),
        ("Chronos", 2024.31, 710, "TSFM", (32, 2)),
        ("TimesFM", 2024.37, 200, "TSFM", (30, -13)),
        ("Time-MoE", 2024.72, 2400, "TSFM", (0, 24)),
        ("Moirai-MoE", 2024.83, 935, "TSFM", (38, -3)),
        ("Sundial", 2025.15, 444, "TSFM", (30, 5)),
    ]
    fig, ax = plt.subplots(figsize=(11, 5.4))
    for name, yr, p, fam, off in models:
        c = BLUE if fam == "TSFM" else ORANGE
        ax.scatter(yr, p, s=np.sqrt(p) * 12 + 45, color=c, alpha=0.55,
                   edgecolors="black", lw=0.8, zorder=3)
        ax.annotate(name, (yr, p), textcoords="offset points", xytext=off,
                    fontsize=8.6, ha="center", va="center", zorder=5,
                    bbox=dict(boxstyle="round,pad=0.15", fc="white",
                              ec="none", alpha=0.78))
    ax.set_yscale("log")
    ax.set_ylim(0.15, 22000)
    ax.set_xlim(2022.5, 2025.55)
    ax.set_xlabel("Public release (year)")
    ax.set_ylabel("Parameters (millions, log scale)")
    ax.set_title("The Time-Series Foundation Model Boom (2022-2025)",
                 fontsize=13, fontweight="bold")
    ax.grid(alpha=0.3, zorder=0)
    ax.scatter([], [], color=BLUE, label="Time-series FM (pre-trained on signals)")
    ax.scatter([], [], color=ORANGE, label="Language-based FM (reuses an LLM)")
    ax.legend(loc="lower right", fontsize=9)
    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "fig3_timeline.png"), dpi=140)
    plt.close()


# ---------------------------------------------------------------------------
# FIG 4 -- Architecture families
# ---------------------------------------------------------------------------
def fig_architectures():
    fig, axes = plt.subplots(1, 3, figsize=(12, 3.9))
    families = [
        ("Encoder-only", "Masked reconstruction.\nBest for representations\n& multi-task.",
         "MOMENT · Moirai", GREEN),
        ("Decoder-only", "Autoregressive next-patch\nprediction. Best for\nforecasting.",
         "TimesFM · Time-MoE\nLag-Llama · Timer", BLUE),
        ("Encoder-Decoder", "Sequence-to-sequence.\nTokenize values, translate\nhistory -> future.",
         "Chronos · TimeGPT", ORANGE),
    ]
    for ax, (name, desc, models, c) in zip(axes, families):
        ax.set_xlim(0, 10); ax.set_ylim(0, 10); ax.axis("off")
        ax.text(5, 9.3, name, ha="center", fontsize=12, fontweight="bold", color=c)
        for i in range(4):
            ax.add_patch(FancyBboxPatch((1.4 + i * 1.85, 6.2), 1.5, 1.2,
                         boxstyle="round,pad=0.04", fc=c, ec="black", alpha=0.8))
        ax.text(5, 5.3, desc, ha="center", va="center", fontsize=9)
        ax.text(5, 2.3, models, ha="center", va="center", fontsize=9.5,
                style="italic", color=c)
    fig.suptitle("Transformer Backbone Families for Time Series",
                 fontsize=13, fontweight="bold", y=1.02)
    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "fig4_architectures.png"), dpi=140,
                bbox_inches="tight")
    plt.close()


# ---------------------------------------------------------------------------
# FIG 5 -- Benchmark contamination (Paper 3 numbers)
# ---------------------------------------------------------------------------
def fig_contamination():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 4.4))

    # left: leaked vs non-leaked MSE improvement range (FoundTS finding)
    cats = ["Leaked\ndatasets", "Non-leaked\ndatasets"]
    lows = [47, 0.3]; highs = [184, 14]
    a1.bar(cats, highs, color=["#d62728", "#2ca02c"], alpha=0.45, label="upper bound")
    a1.bar(cats, lows, color=["#d62728", "#2ca02c"], alpha=0.95, label="lower bound")
    for i, (lo, hi) in enumerate(zip(lows, highs)):
        a1.text(i, hi + 6, f"{lo:g}-{hi:g}%", ha="center", fontsize=10, fontweight="bold")
    a1.set_ylabel("Apparent MSE improvement (%)")
    a1.set_title("Contamination inflates scores\n(FoundTS: TimesFM / UniTS / TTM)",
                 fontsize=10.5)
    a1.set_ylim(0, 210)

    # right: Moirai 0.1% leakage MAPE drop by horizon
    horizons = ["Short", "Medium", "Long"]
    drop = [7.6, 32, 29]
    a2.bar(horizons, drop, color="#d62728", alpha=0.8)
    for i, d in enumerate(drop):
        a2.text(i, d + 1, f"-{d} pts", ha="center", fontsize=10, fontweight="bold")
    a2.set_ylabel("MAPE reduction (percentage points)")
    a2.set_title("Just 0.1% deliberate leakage\nflatters Moirai's accuracy",
                 fontsize=10.5)
    a2.set_ylim(0, 40)
    fig.suptitle("Why Zero-Shot Numbers Must Be Read Carefully "
                 "(arXiv:2510.13654, 2025)", fontsize=12, fontweight="bold")
    plt.tight_layout()
    fig.savefig(os.path.join(OUT, "fig5_contamination.png"), dpi=140)
    plt.close()


if __name__ == "__main__":
    fig_pathways()
    fig_tsfm_challenges()
    fig_timeline()
    fig_architectures()
    fig_contamination()
    print("figures written to", OUT)
