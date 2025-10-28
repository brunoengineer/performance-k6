import { sampleFlow } from '../flows/sampleFlow.js';
import { config } from '../modules/config.js';
import { log } from '../modules/logger.js';
import { handleSummary } from '../modules/summary.js';

const isSmoke = __ENV.SMOKE === '1';

export const options = isSmoke
  ? {
      vus: 1,
      duration: '10s',
      tags: { test_type: 'load', scenario: 'smoke' },
      thresholds: { checks: ['rate>0.95'] },
    }
  : {
      tags: { test_type: 'load' },
      scenarios: {
        load_test: {
          executor: 'ramping-arrival-rate',
          startRate: 10,
          timeUnit: '1s',
          preAllocatedVUs: 20,
          maxVUs: 200,
          stages: [
            { duration: '2m', target: 50 },
            { duration: '5m', target: 50 },
            { duration: '2m', target: 0 }
          ],
          tags: { scenario: 'load' },
        },
      },
      thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
      },
    };

export default function () {
  if (__ITER === 0) {
    log.info(`Starting LOAD test against ${config.baseUrl}`);
  }
  sampleFlow();
}

export { handleSummary };
