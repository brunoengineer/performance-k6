import { sampleFlow } from '../flows/sampleFlow.js';
import { config } from '../modules/config.js';
import { log } from '../modules/logger.js';
import { handleSummary } from '../modules/summary.js';

const isSmoke = __ENV.SMOKE === '1';

export const options = isSmoke
  ? {
      vus: 1,
      duration: '10s',
      tags: { test_type: 'spike', scenario: 'smoke' },
      thresholds: { checks: ['rate>0.95'] },
    }
  : {
      tags: { test_type: 'spike' },
      scenarios: {
        spike_test: {
          executor: 'ramping-vus',
          startVUs: 0,
          stages: [
            { duration: '30s', target: 10 },   // warm-up
            { duration: '10s', target: 200 },  // spike
            { duration: '1m', target: 200 },   // sustain spike briefly
            { duration: '2m', target: 10 },    // scale down
            { duration: '30s', target: 0 }     // cool off
          ],
          gracefulRampDown: '10s',
          tags: { scenario: 'spike' },
        },
      },
      thresholds: {
        http_req_duration: ['p(95)<800'],
        http_req_failed: ['rate<0.02'],
        checks: ['rate>0.98'],
      },
    };

export default function () {
  if (__ITER === 0) {
    log.info(`Starting SPIKE test against ${config.baseUrl}`);
  }
  sampleFlow();
}

export { handleSummary };
