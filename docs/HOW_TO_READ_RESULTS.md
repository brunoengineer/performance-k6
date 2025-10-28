# How to Read k6 Results (Template)

This project writes two artifacts per run:
- `summary.json`: full structured output (best for reporting).
- `summary.txt`: short text header.

## CLI summary
You see min/avg/med/p(90)/p(95)/max for trends like `http_req_duration`, `checks` rate, `http_req_failed` rate, `http_reqs` counts/rate, VUs, etc. It prints only at the end of the run unless interrupted.

To include p99 in the CLI:
```
K6_SUMMARY_TREND_STATS="avg,min,med,max,p(90),p(95),p(99)" k6 run src/tests/load.test.js
```

## Key fields in summary.json
- `metrics.http_req_duration.values`: latency stats (avg, min, med, max, percentiles)
- `metrics.http_req_failed.values.rate`: error rate
- `metrics.http_reqs.values.count` and `rate`: throughput
- `metrics.checks.values.rate`: functional pass rate
- `thresholds`: configured limits and pass/fail
- Custom metrics (from `src/modules/metrics.js`):
  - `custom_http_retries`, `custom_http_errors`, `custom_business_failures`

## Export another summary file (optional)
```
k6 run --summary-export=run-summary.json src/tests/load.test.js
```

## Recommended report sections
See `docs/REPORT_TEMPLATE.md` for a concise checklist.
