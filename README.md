# Identity Platform Login UI Frontend

This repository contains the standalone React/Next.js frontend application for the Canonical Identity Platform Login UI, integrating with Ory Kratos and Ory Hydra identity services.

## Prerequisites

- **Node.js**: `v22` or higher
- **npm**: Standard Node package manager
- **Docker**: For running backend dependency services during testing
- System packages (for E2E testing): `oathtool` and Playwright browser dependencies

## Installation

Install dependencies using `npm` or `make`:

```bash
make install
# or
npm install
```

## Local Development

To run the application locally with hot module replacement (HMR) and backend proxying/rewrites enabled:

```bash
DEV=true npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Building for Production

To create an optimized production build:

```bash
make build
# or
npm run build
```

To start the built production application:

```bash
npm run start
```

## Code Quality & Linting

Run ESLint to check for code quality and style issues:

```bash
make lint
# or
npm run lint
```

To automatically fix linting errors where possible:

```bash
npm run fix-lint
```

## End-to-End Testing

End-to-end testing uses [Playwright](https://playwright.dev/).

### Setup E2E Test Prerequisites

Ensure test dependencies and system tools are installed:

```bash
sudo npx playwright install-deps
sudo apt install oathtool
```

### Running E2E Tests

1. Boot the backend service cluster:
   ```bash
   ./tests/scripts/01-start-cluster.sh
   ```

2. Start the login UI containers:
   ```bash
   ./tests/scripts/02-start-ui.sh
   ```

3. Register the OIDC client application:
   ```bash
   ./tests/scripts/03-start-oidc-app.sh
   ```

4. Execute Playwright E2E tests:
   ```bash
   make test-e2e
   # or
   npx playwright test
   ```

To run tests in interactive debug mode with the Playwright UI:

```bash
make test-e2e-debug
```
