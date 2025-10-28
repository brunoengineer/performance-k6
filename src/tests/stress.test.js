import { sampleFlow } from '../flows/sampleFlow.js';
import { config } from '../modules/config.js';
import { log } from '../modules/logger.js';
import { handleSummary } from '../modules/summary.js';

const isSmoke = __ENV.SMOKE === '1';

export const options = isSmoke
  ? {
      vus: 1,
      duration: '10s',
      tags: { test_type: 'stress', scenario: 'smoke' },
      thresholds: { checks: ['rate>0.95'] },
    }
  : {
      tags: { test_type: 'stress' },
      scenarios: {
        stress_test: {
          executor: 'ramping-arrival-rate',
          startRate: 5,
          timeUnit: '1s',
          preAllocatedVUs: 50,
          maxVUs: 500,
          stages: [
            { duration: '2m', target: 20 },
            { duration: '2m', target: 40 },
            { duration: '2m', target: 80 },
            { duration: '2m', target: 120 },
            { duration: '2m', target: 160 },
            { duration: '2m', target: 0 }
          ],
          tags: { scenario: 'stress' },
        },
      },
      thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05'],
        checks: ['rate>0.97'],
      },
    };

export default function () {
  if (__ITER === 0) {
    log.info(`Starting STRESS test against ${config.baseUrl}`);
  }
  sampleFlow();
}

export { handleSummary };
