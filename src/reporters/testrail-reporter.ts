// src/reporters/testrail-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { reportToTestRail } from '../utils/testrail.js';

function getCaseIds(test: TestCase): string[] {
  // Prefer explicit annotation(s)
  const fromAnno = test.annotations
    .filter(a => a.type.toLowerCase() === 'testrail')
    .map(a => String(a.description || ''))
    .map(s => s.trim().replace(/^[^\d]+/, '')) // "C38" / "#38" / " 38 " → "38"
    .filter(s => /^\d+$/.test(s));             // keep only pure numbers
  if (fromAnno.length) return fromAnno;

  // Fallback: parse title
  const inline = test.title.match(/(?:C|#)(\d+)/gi);
  return inline ? inline.map(s => s.replace(/^[^\d]+/, '')) : [];
}

function mapStatus(result: TestResult): 'passed' | 'failed' | 'skipped' {
  if (result.status === 'passed') return 'passed';
  if (result.status === 'skipped') return 'skipped';
  return 'failed';
}

class TestRailReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    const caseIds = getCaseIds(test);
    if (!caseIds.length) return;

    const status = mapStatus(result);
    const durationMs = result.duration;
    const error = result.error ? (result.error.message || String(result.error)) : undefined;

    for (const id of caseIds) {
      await reportToTestRail({
        caseId: id,
        status,
        title: test.title,
        durationMs,
        error,
      });
    }
  }
}

export default TestRailReporter;
