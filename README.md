# GB UI Tests

This repository contains automated UI and API tests for the GB SaaS application using Playwright and TypeScript.

## Repository URL

- [https://github.com/SudoPumpkin/gb-ui-tests.git](https://github.com/SudoPumpkin/gb-ui-tests.git)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/SudoPumpkin/gb-ui-tests.git
   cd gb-ui-tests
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

   This will install all packages listed in `package.json`, including Playwright, TypeScript, ESLint, and Prettier.

3. **Install Playwright browsers:**
   ```sh
   npx playwright install
   ```
   This will download the necessary browser binaries for Playwright tests.

## Project Structure

- `tests/` - Contains all test files
  - `ui/` - UI tests (e.g., cart, navigation)
  - `api/` - API and asset tests
  - `setup-example-test/` - Example setup tests
- `playwright.config.ts` - Playwright configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

## Running Tests

### Run All Tests

```sh
npm test
```

### Run Only UI Tests

```sh
npm run test:ui
```

### Run Only API Tests

```sh
npm run test:api
```

### Run with Debugging (headed mode)

```sh
npm run test:debug
```

### Run a Specific Test File

```sh
npx playwright test tests/ui/cart-total.spec.ts
```

### Show Playwright HTML Report

```sh
npm run test:report
```

For more information, see the [Playwright documentation](https://playwright.dev/).

## Linting and Formatting

- **Lint code:**
  ```sh
  npx eslint .
  ```
- **Format code:**
  ```sh
  npx prettier --write .
  ```

## Notes

- Always run Playwright tests from the project root to ensure the config is picked up.
- The `baseURL` for tests is set in `playwright.config.ts`.
- For troubleshooting, see the comments in each test file and the Playwright documentation.

## Contributing

- Please follow the code style enforced by ESLint and Prettier.
- Add or update tests as needed and ensure all tests pass before submitting a PR.

## k6 Performance Testing

Performance tests are located in the `k6-tests/` directory.

### Install k6

- **Windows:**
  - Install via [Chocolatey](https://chocolatey.org/):
    ```sh
    choco install k6
    ```
- **Mac:**
  - Install [Homebrew](https://brew.sh/) if you don't have it already, following the instructions on the official site.
  - Then install k6:
    ```sh
    brew install k6
    ```
- **Linux and other platforms:**
  - See the [official k6 installation guide](https://k6.io/docs/getting-started/installation/).

### Run k6 Tests

From the project root, run:

```sh
k6 run k6-tests/asset-loads.js
```

## Continuous Integration (CI)

This project uses GitHub Actions to automatically run Playwright UI and API tests every night at 2:00 AM EST (7:00 AM UTC). After each run, the Playwright HTML report is generated and uploaded as a downloadable artifact for review.

You can find the workflow file at `.github/workflows/ci.yml`.

To manually trigger the workflow, go to the Actions tab in your GitHub repository and select "Nightly Playwright Tests" > "Run workflow".

To view the Playwright HTML report after a CI run:

1. Go to the Actions tab and select the workflow run.
2. Download the `playwright-html-report` artifact from the summary page.
3. Unzip the artifact and open `index.html` in the `playwright-gha-report` directory in your browser.

---
