// Minimal handleSummary to export JSON and plaintext summaries
export function handleSummary(data) {
  const txt = [
    'k6 test summary',
    `scenarios: ${Object.keys((data && data.metadata && data.metadata.scenarios) || {}).length}`,
    `thresholds: ${Object.keys(data.thresholds || {}).length}`,
    '',
  ].join('\n');

  return {
    'summary.json': JSON.stringify(data, null, 2),
    'summary.txt': txt,
  };
}
