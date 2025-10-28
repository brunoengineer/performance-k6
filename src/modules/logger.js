// Simple structured logger for k6
// Usage: import { log } from '../modules/logger.js'; log.info('message');

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const levelName = (__ENV.LOG_LEVEL || 'info').toLowerCase();
const levelNum = LEVELS[levelName] || LEVELS.info;

function ts() {
  try {
    return new Date().toISOString();
  } catch (_) {
    return '';
  }
}

function ctx() {
  // __VU and __ITER exist at runtime; guard for init context
  const vu = typeof __VU !== 'undefined' ? __VU : '-';
  const iter = typeof __ITER !== 'undefined' ? __ITER : '-';
  return `vu=${vu} iter=${iter}`;
}

function out(lvl, msg, extra) {
  if (LEVELS[lvl] < levelNum) return;
  const prefix = `${ts()} [${lvl.toUpperCase()}] ${ctx()}`;
  const tail = extra ? ` ${JSON.stringify(extra)}` : '';
  console.log(`${prefix} ${String(msg)}${tail}`);
}

export const log = {
  debug: (msg, extra) => out('debug', msg, extra),
  info: (msg, extra) => out('info', msg, extra),
  warn: (msg, extra) => out('warn', msg, extra),
  error: (msg, extra) => out('error', msg, extra),
};
