# cybdg - Cypress Automation Project

This project provides a comprehensive setup for Cypress end-to-end testing, including linting, formatting, and TypeScript support.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   **Node.js:** Version 18+ (any current LTS version is recommended). You can download it from [nodejs.org](https://nodejs.org/).
-   **npm** or **yarn:** npm is included with Node.js. Yarn can be installed separately if preferred.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cybdg
    ```
    (Replace `<repository-url>` with the actual URL of your Git repository)

2.  **Install dependencies:**
    Navigate to the project root and run:
    ```bash
    npm install
    ```
    This command installs all the necessary packages defined in `package.json`.

### Running Tests

-   **Open Cypress Test Runner UI:**
    ```bash
    npm test
    ```
    This command opens the Cypress interactive Test Runner, allowing you to pick and run tests, view results, and debug.

-   **Run Tests Headlessly:**
    ```bash
    npm run test:run
    ```
    This command runs a specific set of Cypress tests (currently configured for `Cypress/Tests/API/DemoApi.ts`) in headless mode (without the UI). This is typically used for CI environments.

Both test commands use the configuration specified in `config/test.config.ts`.

## Project Structure

The project is organized as follows:

-   **`.github/`**: Contains GitHub Actions workflow configurations.
    -   `workflows/ci.yml`: Defines the CI/CD pipeline, including linting and running Cypress tests.
-   **`config/`**: Holds project-specific configurations.
    -   `test.config.ts`: Custom Cypress configuration file, used to override default Cypress settings and define environment-specific parameters.
-   **`cypress/`**: The main directory for all Cypress-related files.
    -   `fixtures/`: Stores static data files (e.g., JSON) that can be used as test data or to mock API responses.
    -   `support/`: Contains reusable custom commands, global hooks, and plugin configurations.
    -   `Tests/`: Houses all the test spec files, organized by feature or type (e.g., API, UI, E2E).
        - `README.md`: Provides detailed documentation specific to the testing setup, strategies, and conventions used within the `cypress/Tests` directory.
-   **`Resources/`**: Contains supplementary materials for the project, such as HTML files for testing, homework assignments, and lecture cheat sheets. See `Resources/README.md` for more details.
-   **`node_modules/`**: (Not version controlled) Contains all installed npm packages.
-   **`.eslintignore`, `.eslintrc.json`**: ESLint configuration and files to ignore.
-   **`.gitignore`**: Specifies intentionally untracked files that Git should ignore.
-   **`.prettierignore`, `.prettierrc`**: Prettier configuration and files to ignore.
-   **`package.json`, `package-lock.json`**: Define project metadata, dependencies, and scripts. `package-lock.json` ensures reproducible installs.
-   **`README.md`**: This file - the main entry point for project documentation.
-   **`tsconfig.json`**: TypeScript compiler configuration.

## Available Scripts

The `package.json` file defines several scripts for common tasks:

-   **`npm test`**:
    -   `npx cypress open --config-file config/test.config.ts --e2e -b electron`
    -   Opens the Cypress Test Runner UI for interactive testing.
-   **`npm run test:run`**:
    -   `npx cypress run --config-file config/test.config.ts --e2e -b electron --spec Cypress/Tests/API/DemoApi.ts`
    -   Runs a specific Cypress test file (`DemoApi.ts`) headlessly. Useful for quick checks or CI.
-   **`npm run serve`**:
    -   `http-server -p 8080`
    -   Starts a simple HTTP server on port 8080 to serve static files, primarily for accessing HTML examples in the `Resources/htmls` directory.
-   **`npm run prettier`**: (Base script, typically not run directly)
    -   `prettier --config .prettierrc --ignore-path .prettierignore`
    -   Foundation for Prettier formatting tasks.
-   **`npm run eslint`**: (Base script, typically not run directly)
    -   `eslint --config .eslintrc.json --ignore-path .eslintignore`
    -   Foundation for ESLint linting tasks.
-   **`npm run tsc`**: (Base script, typically not run directly)
    -   `tsc --project ./tsconfig.json --noEmit`
    -   Foundation for TypeScript compilation checks.
-   **`npm run prettier:local:windows`**:
    -   `npm run prettier -- --write . --end-of-line crlf`
    -   Formats all supported files in the project using Prettier, enforcing Windows-style line endings (CRLF), and writes changes to disk.
-   **`npm run prettier:local:linux`**:
    -   `npm run prettier -- --write .`
    -   Formats all supported files in the project using Prettier (default line endings, usually LF for Linux/macOS) and writes changes to disk.
-   **`npm run eslint:local`**:
    -   `npm run eslint -- --ext .ts ./ --fix`
    -   Lints all TypeScript files in the project and attempts to automatically fix any linting errors.
-   **`npm run tsc:local`**:
    -   `npm run tsc`
    -   Runs the TypeScript compiler to check for type errors in the project (does not emit JavaScript files).

## Resources

The `Resources/` directory contains various supplementary materials for this testing project. This includes:
-   HTML files used as targets for UI tests.
-   Homework assignments related to learning Cypress and test automation.
-   Cheat sheets and notes from lectures.

For a more detailed breakdown, please see the `Resources/README.md` file.
You can access the HTML files locally by running `npm run serve` and navigating to `http://localhost:8080/Resources/htmls/`.

## Contributing

Contributions are welcome! If you plan to contribute, please ensure:
1.  You have set up the project and installed all dependencies.
2.  Your code adheres to the linting and formatting rules. Run `npm run eslint:local` and `npm run prettier:local:linux` (or `prettier:local:windows`) before committing.
3.  All tests pass. Run `npm test` or `npm run test:run` to verify.
4.  If adding new features, include corresponding tests.
5.  For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
