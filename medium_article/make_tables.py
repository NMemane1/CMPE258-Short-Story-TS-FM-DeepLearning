"""Renders the article's two markdown tables as clean PNG images, so they
survive being pasted into Medium (which has no table support).
Run: python make_tables.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT, exist_ok=True)
NAVY, TEAL, INK = "#0B2545", "#0FB5A8", "#1B2A3A"


def auto_widths(headers, rows, fontsize):
    """Column widths (inches) sized to the longest string in each column."""
    per_char = 0.098 * (fontsize / 11.0)  # generous: cells use bold text
    widths = []
    for ci, h in enumerate(headers):
        longest = max([len(h)] + [len(str(r[ci])) for r in rows])
        widths.append(0.34 + per_char * longest)
    return widths


def draw_table(headers, rows, fname, highlight_last=False, fontsize=11):
    colw = auto_widths(headers, rows, fontsize)
    n = len(rows) + 1
    total_w = sum(colw)
    row_h = 0.56
    fig, ax = plt.subplots(figsize=(total_w, n * row_h))
    ax.set_xlim(0, total_w)
    ax.set_ylim(0, n * row_h)
    ax.axis("off")

    def cell(cx, cy, cw, text, fc, tc, bold=False, fs=fontsize):
        ax.add_patch(plt.Rectangle((cx, cy), cw, row_h, facecolor=fc,
                                   edgecolor="#D6DEE6", lw=1.0))
        ax.text(cx + 0.12, cy + row_h / 2, text, ha="left", va="center",
                fontsize=fs, color=tc, fontweight="bold" if bold else "normal")

    # header row (top)
    x = 0
    for h, w in zip(headers, colw):
        cell(x, (n - 1) * row_h, w, h, NAVY, "white", bold=True, fs=fontsize)
        x += w
    # body rows
    for ri, row in enumerate(rows):
        y = (n - 2 - ri) * row_h
        last = highlight_last and ri == len(rows) - 1
        x = 0
        for ci, (val, w) in enumerate(zip(row, colw)):
            if last:
                fc, tc = NAVY, TEAL if ci > 0 else "white"
            else:
                fc = "#FFFFFF" if ri % 2 == 0 else "#EAF0F5"
                tc = NAVY if ci == 0 else INK
            cell(x, y, w, val, fc, tc, bold=(ci == 0) or last)
            x += w
    plt.tight_layout(pad=0.2)
    fig.savefig(os.path.join(OUT, fname), dpi=160, bbox_inches="tight")
    plt.close()
    print("wrote", fname)


# Table 1 -- headline TSFMs (article section 5)
draw_table(
    ["Model", "Builder", "Architecture", "Tokenization", "Scale", "Pre-training corpus"],
    [
        ["TimesFM", "Google", "Decoder-only", "Patch-wise", "200M", "~100B points"],
        ["Chronos", "Amazon", "Encoder-decoder (T5)", "Quantization-wise", "710M", "~84B points"],
        ["Moirai", "Salesforce", "Encoder-only", "Patch-wise", "311M", "LOTSA, 27B points"],
        ["MOMENT", "CMU Auton Lab", "Encoder-only", "Patch-wise", "385M", "Time Series Pile, 1.2B"],
        ["Time-MoE", "Time-MoE team", "Decoder-only + MoE", "Point-wise", "2.4B", "Time-300B, 300B points"],
        ["Lag-Llama", "ServiceNow et al.", "Decoder-only", "Point-wise + lags", "200M", "~352M points"],
        ["Timer", "Tsinghua THUML", "Decoder-only", "Patch-wise", "67M", "UTSD, ~1B points"],
    ],
    fname="table1_models.png",
    fontsize=11,
)

# Table 2 -- reproduction result (article section 7)
draw_table(
    ["Method", "Mean MASE (lower is better)", "Outright wins"],
    [
        ["Seasonal Naive", "~1.66", "0 / 4"],
        ["Exponential Smoothing (fit per series)", "~1.04", "1 / 4"],
        ["Chronos - zero-shot foundation model", "~0.92", "2 / 4"],
    ],
    fname="table2_results.png",
    highlight_last=True,
    fontsize=11.5,
)
print("done")
