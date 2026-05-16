# Video Narration Script — Time-Series Foundation Models Short Story

**Target length:** 15–25 minutes (this script runs ~20 min at a natural pace).
**Setup:** Screen-share the slide deck (`slides/TS-FM-Short-Story.pdf` or `.pptx`),
advance one slide per section. Speak conversationally — this is a script, not a
text to read word-for-word. Timings are guides.

Record with QuickTime / OBS / Zoom, export MP4, and place the file in this
`video/` folder (or paste a YouTube link in the main README).

---

## Slide 1 — Title  *(0:00 – 0:50)*

Hi, I'm Nikita Memane, and this is my CMPE 258 short story: "One Model to
Forecast Them All — The Rise of Time-Series Foundation Models."

It's a review of a 2025 survey by Ye and colleagues, called "Empowering Time
Series Analysis with Foundation Models." Over the next twenty minutes I'll do
three things. First, explain what time-series foundation models are and how
they're built. Second — and this is the part I'm most excited about — I'll
reproduce the survey's central claim myself, with real code and real data.
And third, I'll end on an honest note: why the impressive numbers you see in
2025 papers can't be fully trusted yet. Let's get into it.

## Slide 2 — The last holdout  *(0:50 – 2:10)*

Here's the motivation. For about a decade now, every kind of data has had its
"foundation model" moment. Text got GPT and Llama. Images got CLIP and SAM.
Audio got Whisper. The recipe is always the same: pre-train one big model on a
huge, broad dataset, and then reuse it everywhere.

But one modality was left behind — time series. The numeric streams that run
power grids, hospitals, supply chains, and stock markets. And it was left
behind for three concrete reasons.

One: the data is scarce and siloed. There's no internet-scale firehose of time
series — useful data hides inside private hospital, factory, and bank systems.

Two: every dataset has a different shape. Text is always tokens. But time
series come at different sampling rates, with different channel counts, and
the same shape can mean different things in different domains. The survey calls
that "semantic variability."

Three: classical methods were already really good. ARIMA, exponential
smoothing — decades old, fast, and genuinely hard to beat on one clean series.

The breakthrough of 2024 and 2025 was realizing none of these were
deal-breakers. They were just engineering problems.

## Slide 3 — The core idea  *(2:10 – 3:20)*

So let's be precise. A foundation model is a large network, pre-trained on a
huge broad dataset, that you then reuse — often with no further training — on
many different tasks. For time series, those tasks are forecasting, imputation
(which means filling in gaps), classification, and anomaly detection.

The survey I'm reviewing maps 88 papers, and it's the only survey that covers
all three ways of building such a model under one consistent lens.

And the whole talk really comes down to one question, the one in the dark box:
can a model that was pre-trained once forecast a series it has never seen —
with zero training on that series — and still beat models that were carefully
tuned to it? That "zero-shot" promise is the heart of the field. And later in
this video, I test it myself.

## Slide 4 — Three pathways  *(3:20 – 4:40)*

This diagram is the survey's central idea, so spend a moment here.

There are three pathways to a time-series foundation model.

Pathway one: build a dedicated time-series model, pre-trained from scratch on
billions of real time points. That's TimesFM, Chronos, Moirai, and others.

Pathway two: don't build anything new — take an existing large language model,
and teach it to read numbers. That's GPT4TS, Time-LLM.

Pathway three, and this is the strangest: render the time series as an image —
literally a line plot — and feed it to a vision model. That's VisionTS.

Most of the headline progress is pathway one, so that's where I'll focus next.
But I'll come back to two and three, because they're genuinely clever.

## Slide 5 — Four design challenges  *(4:40 – 6:10)*

If you want to pre-train a time-series model from scratch, the survey says you
have to solve four design challenges. Almost every model you've heard of is
just one particular set of answers to these four.

Challenge one: where does the data come from? Since there's no time-series
firehose, teams build their own corpora. They integrate every public dataset
they can find — corpora with names like LOTSA and the Time Series Pile — and
then they synthesize even more artificial data. One model, Sundial, trained on
a corpus of a trillion time points.

Challenge two: encoding — how do you turn a continuous signal into tokens.

Challenge three: which Transformer architecture.

Challenge four: how to serve many tasks — forecasting, imputation,
classification, anomaly detection — with one model.

Let's look at challenges two and three more closely.

## Slide 6 — Tokenization  *(6:10 – 7:30)*

Challenge two — encoding. A Transformer eats discrete tokens, but a time series
is a stream of floating-point numbers. There are three recurring answers.

Point-wise: every single timestamp becomes one token. Simple, used by Time-MoE.

Patch-wise: you slice the series into short fixed-length windows, and each
window becomes a token. This is the most popular choice — TimesFM, Moirai,
MOMENT all do this. It shortens the sequence and captures local shape.

And quantization-wise: you scale the values and bin them into a fixed
vocabulary — exactly like words in a language. That's Chronos's signature move.
Chronos literally turns forecasting into language modeling.

There's also a hidden second choice: with multiple channels, do you treat them
independently, or let them interact? Moirai's "any-variate attention" is a neat
answer that handles any number of channels.

## Slide 7 — Architecture families  *(7:30 – 8:50)*

Challenge three — architecture. Strip away the branding, and every one of these
models is one of three Transformer shapes.

Encoder-only models, like MOMENT and Moirai, are trained by masking out chunks
and reconstructing them — that's the BERT recipe. They build rich
representations, so they're great for multi-task work.

Decoder-only models, like TimesFM, Time-MoE, and Lag-Llama, are trained to
predict the next patch autoregressively — the GPT recipe. They dominate pure
forecasting.

And encoder-decoder models, like Chronos, translate a history sequence into a
future sequence. Chronos sits here because it reuses Google's T5 text model
almost unchanged.

If you remember one thing about architecture, remember the line at the bottom:
decoder-only for forecasting, encoder-only for representation and multi-task
work. That pattern holds across all three surveys I read.

## Slide 8 — The model boom  *(8:50 – 10:00)*

This chart shows how fast this field moved. Every bubble is a model, plotted by
release date and parameter count.

Three things jump out. First, the scale jump: from Timer at 67 million
parameters to Time-MoE at 2.4 billion, in under a year. Second, the vendor
land-grab — Google, Amazon, Salesforce, Nixtla, IBM, and Tsinghua all shipped
models. And third, the survey's quiet counter-point: bigger is not
automatically better. IBM's Tiny Time Mixers is about a million parameters —
three orders of magnitude smaller — and it still competes. Lightweight design
is a real research direction, not an afterthought.

## Slide 9 — Reference table  *(10:00 – 11:00)*

Here's a compact reference of the headline models — keep this slide as a
cheat-sheet. Notice how the architecture column lines up with what I said
earlier: TimesFM and Time-MoE, the forecasting-focused models, are decoder-only.
Moirai and MOMENT, the multi-task models, are encoder-only. Chronos is the
odd one out — encoder-decoder, because it reuses T5.

And look at the last column: pre-training corpus sizes span six orders of
magnitude, from 350 million points up to 300 billion. Data scale is the real
battleground.

## Slide 10 — Pathways 2 and 3  *(11:00 – 12:30)*

Quickly, the other two pathways.

Language-based models ask a provocative question: can a model trained only on
text forecast numbers? Surprisingly often, yes. The crudest version, LLMTime,
just writes the numbers out as digit strings and lets GPT continue the sequence.
More refined ones, like Time-LLM, keep the language model completely frozen and
"reprogram" the series through a cross-attention layer. GPT4TS freezes most of
GPT-2 and tunes only the embedding and normalization layers. The theme is
parameter-efficient tuning — touch as little of the giant model as possible.

Vision-based models are the survey's most surprising chapter. You render the
series as a picture, and a vision model — pre-trained only on natural images —
"inpaints" the missing future. It sounds like a hack, but it works, because the
visual patterns of trend and seasonality aren't so different from image
textures. My personal take: this pathway is underrated.

## Slide 11 — My reproduction: setup  *(12:30 – 14:00)*

Now the part I built myself. The surveys map the field, but they don't contain a
head-to-head accuracy table — so I ran my own experiment to test that one core
claim: a model pre-trained once, used zero-shot, can match models fit
individually to each series.

My setup: I used Chronos — the bolt-small model, about 48 million parameters,
from Amazon. I never call dot-fit on it. Pure zero-shot.

I forecast the held-out tail of four classic public datasets the model had
never seen — airline passengers, monthly car sales, monthly sunspots, and daily
minimum temperatures.

I compared it against three classical baselines — Naive, Seasonal Naive, and
Exponential Smoothing — and here's the key point: each baseline is fit
individually to the very series it predicts. So the baselines have an unfair
advantage, and the foundation model gets nothing.

The metric is MASE — Mean Absolute Scaled Error. Below 1.0 means you beat a
seasonal-naive forecast, and it's comparable across datasets of different scale.
The whole thing runs on a laptop CPU in about a minute.

## Slide 12 — My reproduction: result  *(14:00 – 15:20)*

And here's the result.

Seasonal Naive averaged a MASE of about 1.66. Exponential Smoothing — remember,
fit individually to each series — averaged about 1.04. And Chronos, zero-shot,
averaged about 0.92. It won outright on two of the four datasets.

Let that sink in. A 48-million-parameter model that did zero training on these
series achieved a lower average error than Exponential Smoothing models that
were each tuned to their own data. It did it in about a second of CPU inference,
with no training loop at all. And — as you'll see on the next slide — it gave
calibrated uncertainty bands for free.

The hypothesis holds.

## Slide 13 — My reproduction: evidence  *(15:20 – 16:30)*

This is the clearest single win. It's the monthly sunspots dataset, forecasting
a long 60-step horizon.

Look at the classical baselines — the orange and gray dashed lines. They just
revert to a flat line; they have nothing to say about the future shape.

Now look at the blue line — that's Chronos, zero-shot. It actually anticipates
the falling solar cycle. It learned, during pre-training, what a declining
oscillation looks like, and it applied that to a series it had never seen.

And the shaded blue band is its 80% prediction interval — it's telling you how
confident it is. That MASE of 1.01 was the single best score in my entire
experiment.

## Slide 14 — My reproduction: honest read  *(16:30 – 17:40)*

But I want to be honest, because a good review is honest. It's strong, but it's
not magic.

This skill-score chart shows the zero-shot model winning on three of four
datasets. But on the fourth one — the daily-temperature series — the dumb Naive
forecast actually won. That series is short-horizon and nearly stationary, and
in that regime a one-line heuristic is extremely hard to beat. A foundation
model adds almost nothing there.

That's the survey's own "no free lunch" caveat, and I saw it directly in my own
results. Foundation models shine on long horizons and rich structure — and you
should not expect them to win everywhere.

## Slide 15 — The catch  *(17:40 – 19:10)*

And now the most uncomfortable part of the whole story, from a third survey
published in October 2025.

Here's the problem. If a model is pre-trained on "every public dataset we could
find," and you then evaluate it on a public benchmark — how do you know that
benchmark wasn't in the training data? That's test-set contamination, and it's
the same crisis that haunts large language model evaluation.

The numbers are alarming. That survey found only 7% of datasets were never used
for training by some model. One model's training set is routinely another
model's test set.

In a controlled study, researchers added just 0.1% of deliberate leakage to
Moirai's pre-training data — and its accuracy improved by up to 32 percentage
points of MAPE. And bigger models memorized more, not less. On the left, you
can see leaked datasets showed 47 to 184% better scores, versus under 14% on
clean data.

The proposed fix is elegant: a continuously advancing temporal split, where the
test set is always genuine, unseen future data — so it cannot have leaked.

## Slide 16 — My two cents  *(19:10 – 20:40)*

So after reading three surveys, running the reproduction, and staring at those
contamination numbers — here's what I actually think.

One: the zero-shot result is real, and it's a big deal. I went in skeptical —
"fit per series" sounds like it should always win. It didn't. A foundation
model is now a strong default baseline you can call in one line of code.

Two: but the field's headline numbers are softer than they look. After that
contamination data, I don't fully trust any leaderboard score I haven't checked
myself. Accuracy is solved enough; evaluation is not.

Three: the vision pathway is underrated — turning a forecast into image
inpainting quietly reuses the biggest pre-trained models on Earth.

And four: the real frontier isn't scale. The next milestone isn't a
10-billion-parameter model. It's a model you can audit and trust.

## Slide 17 — Conclusion  *(20:40 – 21:40)*

To wrap up. The survey gives us the map: three pathways, four design challenges,
three architecture families, and roughly a hundred models in two years.

My own reproduction gives the proof: a zero-shot foundation model really did
match models tuned per series — I saw it on real data.

And the 2025 benchmarking survey gives the necessary cold shower: the open
problem now is trustworthy evaluation. Until benchmarks are contamination-proof,
every impressive number deserves a second look.

"Pre-train once, predict anything" has finally reached the messiest data
modality of all. The work that remains is making sure we can believe the
predictions.

## Slide 18 — References & links  *(21:40 – 22:30)*

These are my references — the primary paper is the Ye et al. 2025 survey,
supported by two more 2025 surveys and the Chronos and TimesFM model papers.

Everything I showed today — the reproduction code, the executed notebook, the
Medium article, these slides, and this video — is in the public GitHub
repository on screen.

Thanks for watching.

---

### Recording checklist
- [ ] Slides exported and visible full-screen
- [ ] Mic tested, quiet room
- [ ] Run length between 15 and 25 minutes
- [ ] Export as MP4, upload to YouTube (unlisted is fine) **and/or** place the file in this `video/` folder
- [ ] Put the final video link in the main `README.md`
