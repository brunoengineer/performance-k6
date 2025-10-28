# Performance Test Report (Template)

Use this template to document each k6 run so results are comparable.

## 1. Metadata
- Date/Time: <YYYY-MM-DD HH:mm TZ>
- Tester: <name>
- Git commit: `<hash>` / Branch: `<name>`
- k6 version: `k6 version`
- Environment (ENV): dev | staging | prod
- Base URL: <https://your.host>
- Scenario: Load | Spike | Stress
- Command used:
  ```
  <exact command>
  ```

## 2. Workload Profile
- Executor: ramping-arrival-rate | ramping-vus | constant-vus | etc.
- Stages/Options:
  - <duration/target> (e.g., 2m to 50 iters/s, 5m hold, 2m down)
- Notes: <warm-up, spike peak, step size, etc.>

## 3. Key Results
- Throughput
  - http_reqs: <count> | rate: <req/s>
- Latency (http_req_duration)
  - p50: <ms> | p90: <ms> | p95: <ms> | p99: <ms> | max: <ms>
- Reliability
  - http_req_failed rate: <percent>
  - checks pass rate: <percent>
  - retries (custom_http_retries): <count>
  - http errors (custom_http_errors): <count>
- Data
  - data_received: <bytes> (<rate>) | data_sent: <bytes> (<rate>)

## 4. Thresholds
- List thresholds and outcome:
  - http_req_duration p95 < 500ms — PASS/FAIL (actual: <value>)
  - http_req_failed rate < 1% — PASS/FAIL (actual: <value>)
  - checks rate > 99% — PASS/FAIL (actual: <value>)

## 5. Observations
- Errors/timeouts spikes, lat spikes, recovery behavior
- Any external system issues (DB, cache, network)

## 6. Conclusion & Next Actions
- SLO met? YES/NO
- If NO: probable bottleneck and proposed follow-up (test or fix)

## 7. Artifacts
- Attach or link: `summary.json`, `summary.txt`, dashboards, logs
