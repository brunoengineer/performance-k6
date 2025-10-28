// Custom metrics example (optional)
import { Trend, Rate, Counter } from 'k6/metrics';

export const httpRetries = new Counter('custom_http_retries');
export const httpErrors = new Counter('custom_http_errors');
export const httpDuration = new Trend('custom_http_duration');
export const businessFailures = new Rate('custom_business_failures');
