# Reproduction Results

Foundation model: `amazon/chronos-bolt-small` (zero-shot, no fine-tuning).

## Metrics (lower is better)

| dataset       | method                 |      MAE |     RMSE |   sMAPE |   MASE |
|:--------------|:-----------------------|---------:|---------:|--------:|-------:|
| AirPassengers | Naive                  |  115.25  |  137.329 |  27.751 | 4.0334 |
| AirPassengers | SeasonalNaive          |   71.25  |   76.995 |  17.013 | 2.4935 |
| AirPassengers | ExpSmoothing           |   31.08  |   35.762 |   6.922 | 1.0877 |
| AirPassengers | Chronos (zero-shot FM) |   29.563 |   38.607 |   6.274 | 1.0346 |
| CarSales      | Naive                  | 4599     | 5865.37  |  26.596 | 2.9806 |
| CarSales      | SeasonalNaive          | 1959.5   | 2290.83  |  11.667 | 1.27   |
| CarSales      | ExpSmoothing           | 1325.01  | 1691.01  |   7.494 | 0.8587 |
| CarSales      | Chronos (zero-shot FM) | 1449.17  | 2092.01  |   8.056 | 0.9392 |
| Sunspots      | Naive                  |   33.565 |   39.571 |  28.946 | 1.476  |
| Sunspots      | SeasonalNaive          |   48.723 |   56.608 |  45.601 | 2.1426 |
| Sunspots      | ExpSmoothing           |   35.494 |   41.123 |  30.639 | 1.5608 |
| Sunspots      | Chronos (zero-shot FM) |   22.885 |   27.608 |  19.686 | 1.0064 |
| MinTemp       | Naive                  |    1.877 |    2.727 |  12.837 | 0.6366 |
| MinTemp       | SeasonalNaive          |    2.187 |    3.294 |  15.962 | 0.7418 |
| MinTemp       | ExpSmoothing           |    1.907 |    2.745 |  13.066 | 0.6468 |
| MinTemp       | Chronos (zero-shot FM) |    2.044 |    2.702 |  13.965 | 0.6934 |

## Per-dataset winner (by MASE)

- **AirPassengers**: Chronos (zero-shot FM) (MASE=1.0346)
- **CarSales**: ExpSmoothing (MASE=0.8587)
- **Sunspots**: Chronos (zero-shot FM) (MASE=1.0064)
- **MinTemp**: Naive (MASE=0.6366)

## Win count

- Chronos (zero-shot FM): 2
- ExpSmoothing: 1
- Naive: 1

## Mean MASE across datasets
- Chronos (zero-shot FM): 0.918
- ExpSmoothing (fit per series): 1.038
- SeasonalNaive: 1.662
