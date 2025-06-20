# Cypress Automation Training – Sandbox Project

Welcome to the **Cypress Sandbox Automation Project** — a hands-on training ground for mastering Cypress using local HTML/CSS/JS applications, Node.js servers, and TypeScript-based test suites.

---

## 🎯 Project Purpose

This project is designed to:

- 🧱 Build **local web pages** (HTML/CSS/JS) and mock backend servers using Node.js
- 🧪 Enable Cypress-based testing practice through realistic UI/API scenarios
- 🧑‍🏫 Provide **assignments and test examples** for learners to understand best practices
- 📚 Serve as a comprehensive reference for structuring, writing, and executing Cypress tests in TypeScript

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (static pages)
- **Backend**: Node.js + Express (local API servers)
- **Test Automation**: Cypress + TypeScript
- **Dev Tools**: ESLint, Prettier, GitHub Actions

---

## 📂 Project Structure

```

Cypress/
├─ Fixtures/Pages/           # Page Object Models
├─ Support/                  # Commands, plugins, global setup
├─ Tests/                    # API, UI, and E2E Cypress test suites

Resources/
├─ htmls/                    # Sandbox HTML files
│  ├─ user\_management/       # Includes HTML + JS + server.js
├─ Homework/                 # Markdown assignments
├─ LectureCheatSheets/      # Study materials & slide links

config/
├─ test.config.ts           # Cypress configuration file

```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+** (any current LTS version will work)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Servers

- Static HTML:

  ```bash
  npm run serve:UI
  ```

- Express Server (e.g. user_management):

  ```bash
  npm run serve:Server
  ```

### 3. Launch Cypress

```bash
npm run test         # Opens Cypress GUI
npm run test:run     # Runs headless Cypress on a specific spec
```

---

## 🧪 Cypress Test Organization

- `UI/`: Tests against HTML forms, tables, modals, CSS selectors
- `API/`: Backend/API validation with mocked responses
- `E2E/`: Full-flow scenarios across UI and backend logic
- `Fixtures/Pages/`: Page Object Model helpers
- Supports:

  - [@cypress/grep](https://github.com/cypress-io/cypress-grep) for test filtering
  - [cypress-terminal-report](https://github.com/archfz/cypress-terminal-report) for logs
  - [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) for real input simulation
  - [cypress-file-upload](https://github.com/abramenal/cypress-file-upload) for file tests

---

## ✅ Linting & Formatting

```bash
npm run prettier:local:linux   # Format codebase (LF)
npm run eslint:local           # Fix lint errors
npm run tsc:local              # Run TypeScript checks
```

These run automatically in GitHub Actions via `.github/workflows/lint.yml`.

---

## 🔗 Configuring Path Aliases

TypeScript path aliases are defined in `tsconfig.json` under `compilerOptions.paths`.
Each alias maps to a folder inside the project, e.g.:

```json
"Plugins/*": ["cypress/Support/Plugins/*"]
```

Ensure the case of the folder names matches the actual directory structure (Linux is case sensitive).
Update the paths if files are moved so imports like `import helper from 'Plugins/index'` resolve correctly.

---

## 📚 Learning Resources

- `Resources/Homework/`: Practice exercises in markdown
- `Resources/htmls/`: Static UI sandboxes (tables, forms, etc.)
- `LectureCheatSheets/`: Lecture summaries and quick references
