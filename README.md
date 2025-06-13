# cybdg

📁 Project Directory Structure

```
├── .eslintignore            # Files/folders to ignore during linting
├── .eslintrc.json           # ESLint configuration file
├── .github                  # GitHub-related config (e.g., workflows)
│   └── workflows
│       └── lint.yml         # GitHub Actions CI job for linting
├── .gitignore               # Files/folders to exclude from git version control
├── .prettierignore          # Files to ignore by Prettier
├── .prettierrc              # Prettier configuration file
├── config
│   └── test.config.ts       # Custom test configuration
├── Cypress                  # Main folder for Cypress test suite
│   ├── Fixtures             # Static test data (e.g., JSON files for mocking)
│   ├── Support              # Shared commands, setup files, and plugins
│   │   ├── commands.ts      # Custom Cypress commands
│   │   ├── e2e.ts           # E2E support file (runs before each test)
│   │   ├── index.d.ts       # Type definitions for Cypress enhancements
│   │   ├── index.js         # Optional support file for test setup
│   │   └── Plugins
│   │       ├── index.d.ts   # Type declarations for custom plugins
│   │       └── index.js     # Cypress plugin configuration
│   └── Tests
│       └── E2E
│           └── demo.ts      # Example E2E test case written in TypeScript
├── package-lock.json        # Exact versions of installed packages (auto-generated)
├── package.json             # Project metadata and dependencies
├── README.md                # Project documentation entry point
└── tsconfig.json            # TypeScript configuration file
```

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (any current LTS version will work)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Install Dependencies

Run `npm install` from the project root to install all required packages.

```bash
npm install
```

## Running Cypress Tests

- Open the Cypress UI: `npm run test`
- Run tests headlessly: `npm run test:run`

Both commands use the configuration located at `config/test.config.ts`.

## Serving the HTML Resources

HTML examples under `Resources/htmls` can be served locally with the built in
`http-server` dependency:

```bash
npm run serve
```

The above command starts a static server on
[http://localhost:8080](http://localhost:8080) or
[http://127.0.0.1:8080](http://127.0.0.1:8080).
Navigate to `http://localhost:8080/Resources/htmls` or
`http://127.0.0.1:8080/Resources/htmls` to access the HTML files.

