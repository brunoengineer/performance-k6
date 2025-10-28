# k6 Performance Test Template

A modular template for k6 performance testing, covering Load, Spike, and Stress scenarios. Includes reusable logger, config loader, HTTP client, and metrics.

## Features
- Modularized test code (flows, modules)
- Centralized config with per-environment overrides (dev/staging/prod)
- Simple, structured logger with levels
- HTTP client wrapper with default headers, base URL, and tags
- Three ready-to-run scenarios: Load, Spike, Stress
- npm scripts for easy runs via cross-platform env variables

## Prerequisites
- Node.js 16+ (for scripts and tooling)
- k6 installed and available on PATH

### Install k6 (Windows)
- Using Chocolatey (recommended):
  - Install Chocolatey: https://chocolatey.org/install
  - `choco install k6`
- Using Scoop:
  - Install Scoop: https://scoop.sh/
  - `scoop install k6`
- Or download MSI: https://k6.io/docs/get-started/installation/#windows

Verify:
```
k6 version
```

## Install project dependencies
```
npm install
```

## Configuration
Configs live in `src/config`. Choose env via `ENV` (default: `dev`). You can override baseUrl, timeouts, thresholds, etc.

- `src/config/default.json`: base defaults
- `src/config/dev.json`, `staging.json`, `prod.json`: overrides

## Run scenarios
- Load:
```
npm run test:load
```
- Spike:
```
npm run test:spike
```
- Stress:
```
npm run test:stress
```

Quick smoke (10s) runs:
```
npm run test:load:smoke
npm run test:spike:smoke
npm run test:stress:smoke
```

You can tweak env vars on the fly, e.g.:
```
ENV=staging LOG_LEVEL=debug BASE_URL=https://test.k6.io npm run test:load
```

## Customize targets and verbosity

You can fully control the target environment, base URL, logging, and quick validation mode with environment variables.

- ENV: selects which config override to load from `src/config/*.json`. Defaults to `dev`.
- BASE_URL: overrides `baseUrl` from config without editing files.
- LOG_LEVEL: sets logger verbosity (`debug`, `info`, `warn`, `error`). Default `info`.
- TIMEOUT_MS: overrides HTTP timeout for requests.
- SMOKE=1: enables 10s/1-VU smoke mode for quick compilation and endpoint checks.

Examples:
```
# Run a fast validation (10s) against staging with verbose logs
ENV=staging LOG_LEVEL=debug SMOKE=1 npm run test:load:smoke

# Override base URL at runtime without touching files
BASE_URL=https://api.example.com SMOKE=1 npm run test:spike:smoke

# Increase HTTP timeout and run a full stress test
TIMEOUT_MS=90000 ENV=prod npm run test:stress
```

Tip: The config loader merges `src/config/default.json` with `src/config/${ENV}.json`. You can also provide additional overrides via env vars to avoid committing secrets or one-off changes.

## Project Structure
```
src/
  config/
    default.json
    dev.json
    staging.json
    prod.json
  flows/
    sampleFlow.js
  modules/
    config.js
    httpClient.js
    logger.js
    metrics.js
  tests/
    load.test.js
    spike.test.js
    stress.test.js
```

## Tips
- To change the target host, edit `src/config/*.json` or pass `BASE_URL` as env var.
- Adjust thresholds in each test file’s `options.thresholds`.
- Use `LOG_LEVEL=debug` for verbose logs.

## Install k6 from bash (Windows)

If you’re using a bash shell in VS Code on Windows, here are two common paths:

- WSL (Ubuntu/Debian):
```
sudo apt-get update
sudo apt-get install -y ca-certificates gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/k6.gpg
echo "deb [signed-by=/etc/apt/keyrings/k6.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install -y k6
k6 version
```

- Git Bash (no admin, portable):
```
K6_VERSION=v0.49.0
curl -L -o k6.zip "https://github.com/grafana/k6/releases/download/${K6_VERSION}/k6-${K6_VERSION}-windows-amd64.zip"
powershell.exe -NoProfile -Command "Expand-Archive -LiteralPath k6.zip -DestinationPath .\\k6-bin -Force"
export PATH="$PWD/k6-bin/k6-${K6_VERSION}-windows-amd64:$PATH"
k6 version
```

Alternatively, use Chocolatey or Scoop (PowerShell), or the MSI as listed above in Prerequisites.

## Troubleshooting

- Error: `unsupported protocol scheme ""` — Ensure `baseUrl` is set (via config file or `BASE_URL` env var). The tests build URLs like `baseUrl + "/"`.
- Config warnings about missing files — Paths are resolved relative to module files. Default paths are correct in this template; verify the repo layout if you moved files.

## License
MIT
