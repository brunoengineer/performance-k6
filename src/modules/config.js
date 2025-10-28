// Config loader for k6 using open() to load JSON at init time
// Env selection via ENV, override BASE_URL and TIMEOUT_MS via env vars.

import { log } from './logger.js';

function loadJson(path) {
  try {
    return JSON.parse(open(path));
  } catch (e) {
    log.warn(`Could not load config file: ${path}`, { error: String(e) });
    return {};
  }
}

const env = (__ENV.ENV || 'dev').toLowerCase();
// Paths are relative to this module file location
const defaults = loadJson('../config/default.json');
const overrides = loadJson(`../config/${env}.json`);

// Merge shallowly (simple template). You can expand to deep merge if needed.
const merged = Object.assign({}, defaults, overrides);

// Env var one-off overrides
if (__ENV.BASE_URL) merged.baseUrl = __ENV.BASE_URL;
if (__ENV.TIMEOUT_MS) merged.timeoutMs = Number(__ENV.TIMEOUT_MS);

export const config = merged;
