# End-to-End (E2E) Testing Guide

This document provides instructions for running Playwright End-to-End (E2E) tests against the isolated `identity-platform-login-ui-frontend` stack.

---

## 🛠️ Prerequisites

Ensure the following tools are installed on your host machine:

- **Docker** & **Docker Compose** (v2.x+)
- **Node.js** (v20+) & **npm**
- **curl**
- **jq**

---

## 🏗️ Stack Architecture

The E2E test setup spins up a complete, local identity stack in Docker containers connected via the `intranet` network:

- **Postgres** (`postgres:16-alpine`): Database for Kratos, Hydra, and OpenFGA.
- **Ory Kratos** (`oryd/kratos:v1.1.0`): Identity and user management server.
- **Ory Hydra** (`oryd/hydra:v2.2.0`): OAuth2 and OpenID Connect provider.
- **OpenFGA** (`openfga/openfga:v1.5.0`): Fine-grained authorization service.
- **MailSlurper** (`oryd/mailslurper:latest-smtps`): Local SMTP server for testing email flows (password reset, email verification).
- **Traefik** (`traefik:v3.0`): Reverse proxy routing `/ui/*` to the frontend and `/api/*` / `/self-service/*` to the Go backend.
- **Go Backend** (`identity-platform-login-ui`): Public API server handling login, consent, and session flows.
- **Frontend UI** (`frontend-ui`): Next.js static export served via Nginx.

---

## 🚀 Step-by-Step Instructions

### 1. Install Node.js Dependencies & Playwright Browsers

```bash
# Install npm dependencies
npm ci

# Install Playwright browser binaries
npx playwright install chromium --with-deps
```

### 2. Start the Infrastructure Services

Start MailSlurper, Postgres, Kratos, Hydra, OpenFGA, and Traefik:

```bash
./tests/scripts/01-start-cluster.sh
```

### 3. Start the Backend & Frontend UI Containers

Build and launch the `identity-platform-login-ui` backend and `frontend-ui` containers:

```bash
./tests/scripts/02-start-ui.sh
```

### 4. Register the Test OIDC Application

Register the test OAuth2/OIDC application with Hydra and start the mock consumer app on `http://127.0.0.1:4446`:

```bash
./tests/scripts/03-start-oidc-app.sh
```

### 5. Run the Playwright E2E Tests

Execute all Playwright E2E test suites in headless mode:

```bash
npx playwright test
```

---

## 💡 Useful Testing Commands

- **Run a specific test file:**
  ```bash
  npx playwright test tests/login-first-time.spec.ts
  ```

- **Run tests with interactive UI mode:**
  ```bash
  npx playwright test --ui
  ```

- **Run tests in headed mode (visible browser):**
  ```bash
  npx playwright test --headed
  ```

- **View HTML test report after a run:**
  ```bash
  npx playwright show-report
  ```

- **Tear down the test stack and remove volumes:**
  ```bash
  docker-compose down -v
  ```

---

## 🔍 Troubleshooting & Common Issues

- **`Sign in failed: An error occurred` during login:**
    - Verify Traefik routing in `docker/traefik/login-ui-routes.yml`. Traefik must include `PathPrefix('/api/kratos')` routed to `http://identity-platform-login-ui:4455`.
    - Ensure `IDENTIFIER_FIRST_ENABLED=true` is set in `docker-compose.yml` to match Kratos's `style: identifier_first`.

- **Stale Kratos identities causing test failures:**
    - Tests automatically reset Kratos identities before running via `tests/helpers/kratosIdentities.ts`. You can manually clear identities with:
      ```bash
      curl --silent -H "Content-Type: application/json" -X GET "http://localhost:4434/admin/identities" | jq -r ".[].id // empty" | xargs -r -I {} curl --silent -H "Accept: application/json" -X DELETE "http://localhost:4434/admin/identities/{}"
      ```
