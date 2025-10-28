import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';
import { log } from './logger.js';
import { httpRetries, httpErrors, httpDuration } from './metrics.js';

const defaultParams = () => ({
  headers: Object.assign(
    {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    config.defaultHeaders || {}
  ),
  tags: {},
});

function withBase(url) {
  if (!config.baseUrl) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}

function timed(fn) {
  const start = Date.now();
  const res = fn();
  const dur = Date.now() - start;
  httpDuration.add(dur);
  return res;
}

function doRequest(method, url, body = null, params = {}) {
  const mergedParams = Object.assign({}, defaultParams(), params);
  const fullUrl = withBase(url);
  const timeout = config.timeoutMs || 60000;

  const maxRetries = config.retries || 0;
  let attempts = 0;
  let res;

  while (attempts <= maxRetries) {
    attempts++;
    res = timed(() =>
      http.request(method, fullUrl, body, Object.assign({ timeout }, mergedParams))
    );

    if (res.status && res.status >= 200 && res.status < 500) {
      // Consider 5xx retryable by default
      if (res.status < 500) break;
    }

    if (attempts <= maxRetries) {
      httpRetries.add(1);
      const backoff = Math.min(1 * attempts, 3); // seconds
      log.warn(`Retrying ${method} ${fullUrl}`, { attempts, status: res.status });
      sleep(backoff);
    }
  }

  if (!res || res.status >= 400) {
    httpErrors.add(1);
  }

  return res;
}

export const client = {
  get: (url, params) => doRequest('GET', url, null, params),
  del: (url, params) => doRequest('DELETE', url, null, params),
  post: (url, body, params) => doRequest('POST', url, body && JSON.stringify(body), params),
  put: (url, body, params) => doRequest('PUT', url, body && JSON.stringify(body), params),
  patch: (url, body, params) => doRequest('PATCH', url, body && JSON.stringify(body), params),
  request: doRequest,
};

export { check };
