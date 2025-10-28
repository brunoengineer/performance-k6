import { group, sleep } from 'k6';
import { client, check } from '../modules/httpClient.js';
import { log } from '../modules/logger.js';

export function sampleFlow() {
  group('Home page', () => {
    const res = client.get('/');
    const ok = check(res, {
      'status is 200': (r) => r.status === 200,
      'body not empty': (r) => (r.body || '').length > 0,
    });

    if (!ok) {
      log.warn('Home page checks failed', { status: res && res.status });
    }

    sleep(1);
  });
}
