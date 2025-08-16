# Insight E2E (Playwright)

Browser e2e tests for the Insight frontend. By default, tests stub the BFF endpoints; set `BFF_E2E=1` to hit a real BFF at `BFF_URL`.

## Setup

1. Install deps:
   - From this folder, run: npm install
2. Start the frontend dev server in another terminal:
   - cd ../Insight-frontend && npm install && npm run dev
   - Frontend default URL is http://localhost:5173; override with FE_URL.
3. (Optional) start BFF and set BFF_URL:
   - export BFF_URL=http://localhost:4000
   - export BFF_E2E=1

## Run tests

- npm test
- npm run test:ui (interactive)
- npm run report (open last HTML report)

## Notes

- Tests will intercept /feed, /cluster/:id, and /config when BFF is not reachable.
- Keep stubs minimal and representative.
