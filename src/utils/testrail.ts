const fetch = globalThis.fetch;
type Status = 'passed' | 'failed' | 'skipped';

type ReportPayload = {
  caseId: string;
  status: Status;
  title: string;
  durationMs: number;
  error?: string;
};

const mode = (process.env.TESTRAIL_MODE || 'mock').toLowerCase();

export async function reportToTestRail(payload: ReportPayload) {
  if (mode === 'mock') {
    // Mock mode: log instead of calling TestRail
    // eslint-disable-next-line no-console
    console.log(`[TestRail MOCK] case=${payload.caseId} status=${payload.status} title="${payload.title}" duration=${payload.durationMs}ms${payload.error ? ' error=' + payload.error : ''}`);
    return;
  }

  // Real mode: minimal implementation targeting add_result_for_case
  const host = process.env.TESTRAIL_HOST;
  const user = process.env.TESTRAIL_USER;
  const apiKey = process.env.TESTRAIL_API_KEY;
  const runId = process.env.TESTRAIL_RUN_ID;

  if (!host || !user || !apiKey || !runId) {
    throw new Error('Missing TESTRAIL_* env vars (HOST/USER/API_KEY/RUN_ID).');
  }

  const url = `${host}/index.php?/api/v2/add_result_for_case/${runId}/${payload.caseId}`;
  const statusId = payload.status === 'passed' ? 1 : payload.status === 'failed' ? 5 : 2; // 1=passed,5=failed,2=blocked/skipped
  const body = {
    status_id: statusId,
    comment: `Playwright: ${payload.title}. Duration: ${payload.durationMs}ms${payload.error ? '\nError: ' + payload.error : ''}`
  };

  const auth = Buffer.from(`${user}:${apiKey}`).toString('base64');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TestRail API error ${res.status}: ${text}`);
  }
}
