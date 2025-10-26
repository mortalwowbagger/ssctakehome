# SauceDemo Playwright TS E2E (with TestRail mock)

A small, maintainable Playwright end-to-end suite for https://www.saucedemo.com/ showcasing:
- Clear Page-Object Model (POM)
- Fixtures/factories for reusable test data
- Repeatable setup/teardown
- Basic TestRail reporting via a custom reporter (mock by default, real supported)

## ✨ Tech
- Playwright Test + TypeScript
- Custom reporter that reads TestRail case IDs from annotations or titles (`C123`)
- Mock TestRail client (console logs); real API optional via env vars

## 📦 Install & Run
```bash
# node 18+ recommended
npm i
npm run install:pw

# execute tests (headless)
npm test

# run headed
npm run test:headed

# view HTML report
npm run report
```

## 🔧 Project Structure
```
src/
  fixtures/         # test data factories
  pages/            # page objects
  reporters/        # custom TestRail reporter
  utils/            # TestRail client (mock/real)
tests/
  e2e.purchase.spec.ts
playwright.config.ts
```

## 🧱 Design Decisions
- Stable selectors: prefer ids/roles over structure selectors.
- POMs read like tasks (e.g., `addProductByName`) instead of click-by-click scripts.
- Factories keep test intent clear and data in one place.
- Repeatability: every test starts fresh and logs out on the way out.
- Reporter is intentionally small; timedOut/interrupted → failed for cleaner dashboards.

## TODO (next pass)
- Attach Playwright trace/screenshot to TestRail on failure (real mode).
- Matrix run for WebKit/Firefox.
- Smoke tag + CI job to run smoke on PR, full on `main`.

## 🧪 Referencing TestRail Cases
In tests you can do either (explicit is preferred):
```ts
test('My test', async ({}, testInfo) => {
  testInfo.annotations.push({ type: 'testrail', description: '1001' });
});
```
or include an ID in the title: `test('E2E purchase happy path C1001', ...)`

## 📝 TestRail Reporting (Mock vs Real)
- **Mock (default)**: set `TESTRAIL_MODE=mock` (or leave unset). Results are logged, e.g.:
```
[TestRail MOCK] case=1001 status=passed title="E2E purchase happy path @C1001" duration=1234ms
```
- **Real**:
  1. Copy `.env.example` to `.env` and set:
     - `TESTRAIL_MODE=real`
     - `TESTRAIL_HOST=https://yourcompany.testrail.io`
     - `TESTRAIL_USER=you@example.com`
     - `TESTRAIL_API_KEY=XXXX`
     - `TESTRAIL_RUN_ID=1234`
  2. Run `npm test`. The reporter will POST to `add_result_for_case/{RUN_ID}/{CASE_ID}`.

> **Note:** This project uses a TestRail Cloud trial (`ssctakehome.testrail.io`), which doesn’t support persistent API keys. Keys disappear after creation, and API calls return `401 Unauthorized`. Because of that, the suite runs in mock mode by default. The reporter logs simulated results instead of sending them to TestRail. When connected to a licensed instance with valid API access, switching `TESTRAIL_MODE=real` enables live reporting without code changes.

### Example `.env` for mock mode:
```bash
TESTRAIL_MODE=mock
TESTRAIL_HOST=https://ssctakehome.testrail.io
TESTRAIL_USER=mock_user@example.com
TESTRAIL_API_KEY=dummy
TESTRAIL_RUN_ID=13
TESTRAIL_DEBUG=1
```

> This is a simple demo integration. A production setup would add retries, richer status mapping, attachments, and batching.

## 🧩 Assumptions
- A single “happy path” purchase test checks the main workflow. Additional tests would cover negative paths (locked_out_user, sorting, etc.).
- Network conditions are stable. Playwright’s waits handle most timing.
- The TestRail integration can switch between mock and real modes without any code changes.

## 🚀 Next Steps / Improvements
- Add API-level helpers (like intercepting cart API calls).
- Use data-driven tests for different product sets.
- Attach Playwright trace or screenshots to TestRail in real mode.
- Expand to parallel browser/device testing.
- Add a GitHub Actions workflow to run on each PR and upload reports.

---

**Credentials used:** `standard_user` / `secret_sauce` (public demo creds from SauceDemo)
