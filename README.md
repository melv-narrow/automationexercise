[![Playwright Tests](https://github.com/melv-narrow/automationexercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/melv-narrow/automationexercise/actions/workflows/playwright.yml)

# Automation Exercise Playwright Showcase

This repository showcases an end-to-end Playwright + TypeScript test suite against [Automation Exercise](https://automationexercise.com). It focuses on reliable UI automation, typed fixtures, resilient selectors, and CI-ready cross-browser execution.

## What This Covers

- User registration, login, logout, and duplicate-email validation
- Product search, product details, category browsing, and cart persistence
- Cart add, quantity update, and remove workflows
- Checkout flows for register-during-checkout, register-before-checkout, and login-before-checkout
- Contact Us and email subscription coverage
- Cross-browser execution in Chromium, Firefox, and WebKit

## Suite Highlights

- Typed Playwright fixtures for isolated user data
- No shared `.env` state or file-backed credential coupling between tests
- Page objects with clearer separation between navigation, actions, and assertions
- Assertion-driven negative coverage aligned with ISTQB-style expectations
- CI workflows that lint, typecheck, run the blocking browser matrix, and publish artifacts

## Tech Stack

- Playwright
- TypeScript
- ESLint
- Faker
- GitHub Actions
- Allure reporting

## Project Structure

```text
pages/   Page objects and reusable UI flow helpers
tests/   Playwright specs and typed fixtures
utils/   Test data builders and helper types
.github/workflows/   CI pipelines
```

## Getting Started

```bash
npm ci
npx playwright install --with-deps
```

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run test:e2e
npm run test:e2e:ci
```

Run a single browser locally:

```bash
npm run test:e2e -- --project=Chromium --workers=1 --reporter=line
```

## CI

The blocking CI workflow runs:

- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e:ci`

Artifacts include the Playwright HTML report, traces, screenshots on failure, and test results. A separate master-only workflow generates and publishes Allure history to GitHub Pages after changes land on `master`.

## API Testing

[Automation Exercise Postman documentation](https://documenter.getpostman.com/view/31103252/2sAXjT1pSH)
