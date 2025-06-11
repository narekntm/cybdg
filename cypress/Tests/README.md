# Cypress Test Suite Documentation

This README focuses on the specifics of the Cypress testing setup within this project. It covers test structure, data management, configuration, reporting, and CI/CD integration as they pertain to the tests located in the `cypress/Tests` directory. For general project setup, contribution guidelines, and an overview of the entire repository, please refer to the main [README.md](../../README.md) in the project root.

## Structuring Cypress Tests

Organizing your Cypress tests effectively is crucial for maintainability, readability, and collaboration, especially as your test suite grows. Structuring tests by feature or module is a common and highly recommended approach.

### Benefits of Organizing Tests by Feature or Module

- **Improved Maintainability:** When tests for a specific feature are grouped, any changes or updates to that feature can be quickly reflected in the corresponding tests. If a feature is removed or significantly altered, you know exactly which tests to update or delete.
- **Easier Navigation:** Finding specific tests becomes much simpler. If you need to debug an issue related to "User Profile" or "Product Checkout," you can directly navigate to that feature's test directory.
- **Clarity and Readability:** A well-organized structure makes the purpose and scope of tests clearer. New team members can understand the test suite's layout more intuitively.
- **Scalability:** As new features are added to the application, new test directories can be created for them, allowing the test suite to scale logically.
- **Focused Test Runs:** While Cypress offers various ways to run specific tests (e.g., by tag, by filename), a good directory structure can make it easier to run all tests related to a particular feature using file path patterns.

### Suggested Directory Structure Example

A common way to structure tests is by creating a top-level directory for each major feature or module within your application. Inside each feature directory, you can further categorize tests, for example, by type (UI, API) or by sub-feature.

Here's an example:

```
cypress/
├── fixtures/
├── integration/  <-- This might be your configured `integrationFolder`
│   ├── Tests/                 <-- Or your primary test root, e.g., "e2e/" if `integrationFolder` is `cypress/`
│   │   ├── FeatureA/
│   │   │   ├── ui/
│   │   │   │   ├── featureA_login_spec.js
│   │   │   │   └── featureA_dashboard_spec.js
│   │   │   ├── api/
│   │   │   │   └── featureA_user_api_spec.js
│   │   ├── FeatureB/
│   │   │   ├── ui/
│   │   │   │   └── featureB_settings_spec.js
│   │   │   ├── api/
│   │   │   │   └── featureB_data_api_spec.js
│   │   ├── common/              <-- For shared utilities or tests
│   │   │   └── common_navigation_spec.js
├── plugins/
├── support/
```

In this example:
- `cypress/integration/Tests/` (or `cypress/e2e/Tests/` depending on Cypress version and configuration) is the root for these organized tests.
- `FeatureA` and `FeatureB` are major features of the application.
- Inside each feature directory, `ui` and `api` subdirectories group tests by their type.

### Project-Specific Considerations

The best test structure ultimately depends on your project's specific needs:

- **Project Size and Complexity:** For very small projects, a flat structure or simple categorization might suffice. For large, complex applications, a more granular, multi-level feature-based structure is generally better.
- **Team Structure:** If different teams are responsible for different features, organizing tests by feature can align well with team responsibilities.
- **Nature of Tests:** If you have a mix of end-to-end, API, visual, and component tests, you might include those categories within your feature folders or as higher-level groupings.

Start with a structure that seems logical for your current project and be prepared to refactor it as the project evolves and your understanding of the application's testing needs grows. Consistency is key, so once a structure is chosen, ensure the team adheres to it.

## Selector Strategy

Choosing the right selectors is critical for writing robust and maintainable Cypress tests. Selectors that are tightly coupled to the DOM structure or volatile styles can lead to flaky tests that break easily with UI changes.

### Importance of Robust Selectors:

- **Resilience to Changes:** Good selectors are less likely to break when the application's UI is updated (e.g., CSS changes, element restructuring).
- **Readability:** Clear selectors make tests easier to understand by indicating what element is being targeted and why.
- **Maintainability:** When tests fail due to selector issues, debugging and fixing them is faster if the selectors are stable and descriptive.

### Recommended: Test-Specific Attributes (`data-cy`)

The **best practice** is to use dedicated test-specific attributes on your HTML elements. These attributes are added solely for testing purposes and are decoupled from styling or functional concerns. `data-cy` is a common convention, but `data-testid` or similar attributes work just as well.

**Example:**

**In your HTML:**
```html
<button data-cy="submit-button">Submit</button>
<input type="text" data-cy="username-input" />
```

**In your Cypress test:**
```javascript
cy.get('[data-cy="submit-button"]').click();
cy.get('[data-cy="username-input"]').type('jane.doe');
```

This approach ensures that even if class names, IDs, or element tags change, your tests will continue to find the correct elements as long as the `data-cy` attributes remain. It requires collaboration with developers to add these attributes to the application code.

### User-Centric Queries with `@testing-library/cypress`

`@testing-library/cypress` (which is already a dependency in this project) offers a more user-centric approach to selecting elements. It encourages you to query elements in a way that reflects how users interact with the page.

**Philosophy:**
The library promotes testing application behavior from the user's perspective. Instead of querying for implementation details (like CSS classes or specific DOM structures), you query for elements based on their accessibility attributes, text content, or role.

**Example Queries:**
```javascript
// Find an element by its visible text content
cy.findByText('Welcome, User!').should('exist');

// Find an input element by its associated label text
cy.findByLabelText('Username').type('testuser');

// Find an element by its ARIA role and accessible name
cy.findByRole('button', { name: /submit/i }).click(); // Case-insensitive regex for "submit"

// Other useful queries include findByPlaceholderText, findByAltText, findByTestId, etc.
```
Using `@testing-library/cypress` can lead to tests that are more resilient to implementation changes because they focus on user-observable characteristics.

### What to Avoid:

- **Highly Specific CSS Selectors:** Avoid selectors that are deeply nested or rely on many CSS classes, e.g., `div.container > section.main-content > ul.item-list > li:nth-child(3) button.primary-action`. These are very brittle.
- **Selectors Based on Volatile Styles:** Do not use selectors that depend on CSS attributes that are likely to change (e.g., `button[style*="color: red"]`).
- **Complex XPath Expressions:** While Cypress supports XPath, it's generally recommended to stick to CSS selectors or `data-*` attributes for better readability and maintainability within the Cypress ecosystem. XPath can be powerful but often leads to less clear and more brittle tests if not used carefully.
- **Over-reliance on `cy.contains()` for everything:** While `cy.contains()` is useful for finding elements by text, using it as the primary selector for interactive elements like buttons or inputs can be ambiguous if multiple elements contain the same text. Prefer `data-cy` or `@testing-library/cypress` queries for such elements.

By prioritizing test-specific attributes and user-centric queries, and by avoiding brittle selector patterns, you can create a more stable and maintainable Cypress test suite.

## Avoiding Code Duplication (DRY Principle)

Writing maintainable test code involves adhering to the "Don't Repeat Yourself" (DRY) principle. Code duplication in tests can lead to significant maintenance overhead: if a common user flow or setup step changes, you'll need to update it in multiple places, increasing the risk of errors and inconsistencies.

### Cypress Custom Commands

Cypress custom commands are the primary way to encapsulate reusable sequences of actions or logic that interact with your application. They extend the `cy` object and make your tests more readable and maintainable.

**Benefits:**
- **Reusability:** Define a common action once (e.g., login, filling a form, complex navigation) and reuse it in multiple tests.
- **Readability:** Tests become cleaner and easier to understand as complex operations are abstracted into well-named commands.
- **Maintainability:** If the underlying implementation of a reusable action changes, you only need to update the custom command's definition in one place.

**Defining a Custom Command (in `cypress/support/commands.ts`):**
```typescript
// cypress/support/commands.ts

// Add type definition for the new command to Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user through the UI.
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('[data-cy="username-input"]').type(username);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="login-button"]').click();
  cy.url().should('include', '/dashboard'); // Or some other post-login assertion
});

// Important: Make sure this file is imported in cypress/support/e2e.ts
// Example: import './commands';
```

**Using the Custom Command in a Test:**
```javascript
// In your test file
describe('User Dashboard', () => {
  beforeEach(() => {
    cy.login('testuser', 'testpassword123');
  });

  it('should display user information', () => {
    cy.get('[data-cy="user-profile"]').should('be.visible');
    // ... more assertions
  });
});
```

### Helper Functions

For more complex logic that might not fit neatly into a custom command structure, or for utility functions that are not directly Cypress-specific (e.g., data manipulation, complex calculations), regular TypeScript/JavaScript helper functions are a good choice.

- These can be organized into utility files (e.g., `cypress/support/utils.ts` or feature-specific utility files).
- Import these functions into your test files or custom commands as needed.

**Example (Conceptual):**
```typescript
// cypress/support/utils.ts
export function generateUniqueEmail(): string {
  const prefix = Math.random().toString(36).substring(2, 10);
  return `${prefix}@example.com`;
}

// In your test
import { generateUniqueEmail } from '../support/utils';

it('should register a new user', () => {
  const email = generateUniqueEmail();
  cy.get('[data-cy="email-input"]').type(email);
  // ...
});
```

### Page Object Model (POM) - A Note

The Page Object Model is a design pattern where you create an object for each page (or significant component) of your application. These objects encapsulate selectors and methods to interact with that page.

While POM can be beneficial for organizing selectors and actions, Cypress custom commands often provide a more idiomatic and streamlined way to achieve similar goals with less boilerplate. Many Cypress users find that custom commands, combined with `data-cy` attributes and potentially helper functions, offer a good balance of reusability and maintainability without the full overhead of a traditional POM structure.

However, for very large applications or teams accustomed to POM, it can still be a viable strategy. If using POM, ensure methods on page objects return `void` or `cy` chains appropriately to work well with Cypress's command queue.

By leveraging custom commands and helper functions, you can significantly reduce code duplication, making your Cypress test suite more robust, readable, and easier to maintain.

## Test Data Management

Managing test data effectively is essential for creating robust, readable, and maintainable automated tests. Cypress provides fixtures as a primary mechanism for this, but other techniques can also be employed.

### Benefits of Using Fixtures:

- **Separation of Data from Tests:** Fixtures allow you to keep your test data in separate JSON files (located in `cypress/fixtures` by default). This makes your test scripts cleaner and more focused on test logic rather than embedded data.
- **Reusability:** The same fixture data can be easily reused across multiple tests and test files. If data needs to be updated, you only need to change it in one place (the fixture file).
- **Readability:** Tests become easier to read and understand when data is loaded from a fixture with a descriptive name (e.g., `cy.fixture('userCredentials').then(...)`).
- **Static Data Mocking:** Fixtures are excellent for providing consistent, static data for API mocks (as seen in `cy.intercept()`) or for form inputs.

### Dynamic Data Generation:

While fixtures are great for static data, sometimes you need dynamically generated data (e.g., unique usernames, random email addresses, future dates). For such scenarios, you can use data generation libraries.
- **`chance` (or similar libraries like Faker.js):** This project already includes `chance` as a dependency. Such libraries can generate various types of random yet plausible data (names, emails, addresses, numbers, etc.) directly within your tests or custom commands. This helps in creating more varied test scenarios without hardcoding extensive datasets.

Example usage with a library like `chance` (conceptual):
```javascript
// In your test file or a custom command
const chance = new Chance(); // Assuming Chance is imported or available via require
const randomEmail = chance.email();
const randomName = chance.name();

cy.get('input[name="email"]').type(randomEmail);
cy.get('input[name="name"]').type(randomName);
```

Choosing between fixtures and dynamic data generation depends on whether you need consistent, predictable data (fixtures) or varied, unique data (data generation libraries) for your test scenarios. Often, a combination of both is used.

## Configuration Management

Proper configuration management is vital for security and for ensuring tests can run correctly across different environments (local, staging, production).

### Avoid Hardcoding Sensitive Information:

**Never hardcode sensitive information** such as API keys, database credentials, usernames, or passwords directly in your test files, `cypress.json`, or other configuration files that might be committed to version control. This poses a significant security risk.

### Using Environment Variables:

Cypress provides robust support for environment variables, which is the recommended way to handle sensitive or environment-specific data.

- **Accessing in Tests:** You can access environment variables within your Cypress tests using `Cypress.env('VARIABLE_NAME')`.
  ```javascript
  const apiKey = Cypress.env('API_KEY');
  const username = Cypress.env('USERNAME');
  // Use apiKey or username in your tests, e.g., for API requests or logging in.
  ```

- **Setting Environment Variables:**
    - **Via CLI:** `cypress run --env API_KEY=your_key,USERNAME=your_user`
    - **Via `cypress.env.json`:** Create a `cypress.env.json` file (this file *should typically be in .gitignore* if it contains sensitive data).
      ```json
      {
        "API_KEY": "your_actual_api_key_for_local_dev",
        "USERNAME": "local_dev_user"
      }
      ```
    - **Via OS Environment Variables:** Cypress automatically picks up environment variables prefixed with `CYPRESS_` (e.g., `CYPRESS_API_KEY` will be available as `Cypress.env('API_KEY')`). This is common for CI/CD environments.

### Local Development with `.env` Files:

For managing environment variables during local development, the `dotenv` library is very useful (and is already a dependency in this project).
- It allows you to create a `.env` file in your project root to store key-value pairs.
- `dotenv` loads these variables into `process.env`, making them accessible to your Cypress configuration (e.g., in `cypress/plugins/index.js`) and potentially to `Cypress.env()` if you pass them through.

**Recommendations:**
1.  **Create a `.env.example` file:** This file should list all the environment variables your project needs to run, but with placeholder or example values. Commit this file to your repository.
    Example `.env.example`:
    ```
    API_KEY=your_api_key_here
    USERNAME=your_username_here
    PASSWORD=your_password_here
    ```
2.  **Create your actual `.env` file:** Copy `.env.example` to `.env` and fill in the actual sensitive values.
3.  **Add `.env` to `.gitignore`:** Ensure your `.env` file (which contains actual secrets) is **never committed** to version control. Your `.gitignore` file should include:
    ```
    .env
    ```

By using environment variables, you keep sensitive data out of your codebase, making your tests more secure and configurable for different environments.

## Reporting

Effective test reporting is crucial for understanding test outcomes, debugging failures, and communicating test results to stakeholders. While Cypress provides command-line output and video recordings, dedicated HTML reporters offer a much richer visualization.

### Benefits of HTML Reporters:

- **Enhanced Visualization:** HTML reports provide a user-friendly interface to view test results, including summaries, individual test details, and execution times.
- **Screenshots and Videos:** Many reporters automatically embed screenshots taken by Cypress on failure, and even videos of the test runs, directly into the report, making debugging much easier.
- **Stack Traces:** Detailed error messages and stack traces for failed tests are usually well-formatted and easily accessible.
- **Historical Data (sometimes):** Some reporting solutions can store and compare results over time, helping to track test stability and performance.
- **Shareability:** HTML reports are easy to share with team members, managers, or clients.

### Recommended Reporter: Mochawesome

Mochawesome is a popular and feature-rich HTML reporter for Mocha-based test frameworks, including Cypress.

**Basic Integration Steps:**

1.  **Installation:**
    Add Mochawesome and related packages as development dependencies:
    ```bash
    npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
    # or
    yarn add --dev mochawesome mochawesome-merge mochawesome-report-generator
    ```

2.  **Cypress Configuration:**
    Configure Cypress to use Mochawesome as its reporter. In your Cypress configuration file (e.g., `cypress.config.ts` or, in this project, potentially `test.config.ts` if it handles Cypress setup):

    ```typescript
    // Example for cypress.config.ts
    import { defineConfig } from 'cypress';

    export default defineConfig({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: 'cypress/reports/mochawesome', // Output directory for Mochawesome JSON files
        overwrite: false, // Do not overwrite existing JSON reports, useful for merging
        html: false, // Generate HTML report after each spec run (set to true if not merging)
        json: true, // Generate JSON file after each spec run
        charts: true, // Display charts in the HTML report
        reportPageTitle: 'My Test Report', // Title for the HTML report page
        embeddedScreenshots: true, // Embed screenshots in the HTML report
        inlineAssets: true, // Inline all assets (CSS, JS) into the HTML file for portability
      },
      video: false, // Disable video recording if not needed or handled by reporter
      e2e: {
        setupNodeEvents(on, config) {
          // implement node event listeners here
        },
        // ... other e2e options
      },
    });
    ```
    *Note: If your project uses a `test.config.ts` or similar for Cypress configuration, adapt the above snippet accordingly. The key is setting the `reporter` and `reporterOptions` properties.*

3.  **Package.json Scripts:**
    Add scripts to your `package.json` to run tests with the reporter and then merge the individual JSON reports into a single HTML report.

    ```json
    // In your package.json
    "scripts": {
      "cy:run-tests": "cypress run", // Your existing script to run tests
      "cy:run-tests-reporter": "cypress run --reporter mochawesome", // Or rely on config
      "report:merge": "mochawesome-merge cypress/reports/mochawesome/*.json > cypress/reports/mochawesome.json",
      "report:generate": "marge cypress/reports/mochawesome.json -f report -o cypress/reports --inline",
      "cy:report": "npm run report:merge && npm run report:generate"
    }
    ```
    - `cy:run-tests-reporter`: Runs Cypress tests. If `reporter: 'mochawesome'` is in `cypress.config.ts`, just `cypress run` is often enough.
    - `report:merge`: Merges all Mochawesome JSON outputs (one per spec file) into a single JSON file.
    - `report:generate`: Generates the final HTML report from the merged JSON file.
    - `cy:report`: A convenience script to run both merging and generation.

    **Workflow:**
    1. Run your tests: `npm run cy:run-tests` (or `cy:run-tests-reporter`)
    2. Generate the report: `npm run cy:report`
    The HTML report will typically be found in `cypress/reports/report.html`.

### Alternative Reporter: Allure

Allure Report is another powerful, multi-language test reporting tool that provides rich features, including detailed test execution views, history, and integrations with CI/CD systems. It often requires a bit more setup (installing Allure command-line tools and specific adapters) but offers very comprehensive reporting capabilities.

Choosing a reporter depends on your project's needs for detail, visualization, and integration with other tools. Mochawesome is a great starting point for most Cypress projects.

## CI/CD Integration

Integrating your Cypress tests into a Continuous Integration/Continuous Deployment (CI/CD) pipeline is crucial for ensuring code quality and stability. Automated tests that run on every code change provide rapid feedback, helping to catch regressions early.

### Benefits of CI/CD for Testing:

- **Early Bug Detection:** Automatically running tests on every push or pull request helps identify bugs and regressions much earlier in the development cycle.
- **Consistent Test Environment:** CI environments are typically standardized, ensuring tests run in a consistent and reproducible manner.
- **Improved Code Quality:** Knowing that all changes will be automatically tested encourages developers to write better, more testable code.
- **Faster Feedback Loop:** Developers get quick feedback on their changes without needing to manually run the entire test suite.
- **Automated Deployments (with Confidence):** When tests pass in CI, you can have greater confidence in deploying your application.

### GitHub Actions Workflow Update:

This project uses GitHub Actions for CI. The workflow file `.github/workflows/ci.yml` (renamed from `lint.yml`) has been updated to incorporate Cypress test execution alongside the existing linting jobs.

**Key changes in the workflow:**
- **Trigger:** The workflow is triggered on `push` and `pull_request` events to the `main` branch.
- **Jobs:**
    - **Linting:** The existing jobs for `TSC-Check`, `ESLint-Check`, and `Prettier-Check` remain, ensuring code quality and style.
    - **Cypress Tests (`Cypress-Run`):**
        - A new job has been added specifically for running Cypress tests.
        - It runs after the linting jobs complete successfully.
        - It uses the official `cypress-io/github-action@v6` to execute the tests. This action simplifies setting up the environment for Cypress.
        - It's configured to run all Cypress tests found in the project using a Chrome browser.
        - **Artifact Upload on Failure:** If any Cypress tests fail, the workflow will automatically upload artifacts (screenshots and videos recorded by Cypress during the test run) to GitHub. This is extremely helpful for debugging failed tests in the CI environment, as you can download and inspect these artifacts. The artifacts are retained for 7 days.

This setup ensures that every proposed change to the `main` branch is automatically checked for both code style/quality and for passing end-to-end tests, significantly improving the reliability of the development process.

## Accessibility Testing

Ensuring your application is accessible to people with disabilities is not only a good practice but also a legal and ethical requirement in many contexts. Accessibility testing (often abbreviated as a11y) helps identify and fix issues that might prevent users with disabilities from using your application effectively. This typically involves checking against standards like the Web Content Accessibility Guidelines (WCAG).

### Why is Accessibility Testing Important?

- **Inclusivity:** Makes your application usable by a wider range of people, including those with visual, auditory, motor, or cognitive impairments.
- **Legal Compliance:** Many countries have laws requiring digital accessibility (e.g., ADA in the US).
- **Improved User Experience:** Accessibility best practices often lead to better design and usability for all users.
- **Brand Reputation:** Demonstrates a commitment to inclusivity and social responsibility.

### Recommended Tool: `cypress-axe`

`cypress-axe` is a library that integrates Axe, a powerful accessibility testing engine by Deque Systems, directly into your Cypress tests. This allows you to automatically scan pages for accessibility violations as part of your regular test runs.

**Basic Integration Steps:**

1.  **Installation:**
    Add `cypress-axe` and its peer dependency `axe-core` as development dependencies:
    ```bash
    npm install --save-dev cypress-axe axe-core
    # or
    yarn add --dev cypress-axe axe-core
    ```

2.  **Import in Support File:**
    Import `cypress-axe` into your Cypress support file (typically `cypress/support/e2e.ts`) to make its commands available in all your tests:
    ```typescript
    // cypress/support/e2e.ts
    import './commands'; // Assuming you have this for other custom commands
    import 'cypress-axe';

    // You might also configure global Axe rules here if needed
    ```

3.  **Usage in Tests:**
    In your Cypress tests, you can inject Axe onto the page and then check for accessibility violations at any point in your test flow.

    **Example Test:**
    ```javascript
    describe('Homepage Accessibility', () => {
      beforeEach(() => {
        cy.visit('/'); // Visit the page you want to test
        cy.injectAxe(); // Inject the Axe script onto the page
      });

      it('should have no detectable a11y violations on page load', () => {
        // Basic check for the entire page
        cy.checkA11y();
      });

      it('should have no detectable a11y violations in the main content', () => {
        // Check a specific element (and its descendants)
        cy.checkA11y('main');
      });

      it('should have no violations after interacting with a modal', () => {
        cy.get('[data-cy="open-modal-button"]').click();
        cy.get('[data-cy="modal-dialog"]').should('be.visible');
        // Check only the modal content, excluding other parts of the page
        cy.checkA11y('[data-cy="modal-dialog"]', {
          // Optional: configure rules, e.g., disable a specific rule
          // rules: {
          //   'color-contrast': { enabled: false }
          // }
        });
      });
    });
    ```

### Key `cypress-axe` Commands:

-   `cy.injectAxe()`: Injects the Axe accessibility testing engine into the current page. This should typically be done after a page visit.
-   `cy.checkA11y(context?, options?, violationCallback?, skipFailures?)`:
    -   `context` (optional): A selector string to specify a part of the page to scan (e.g., `'main'`, `'#my-form'`). If omitted, the entire document is scanned.
    -   `options` (optional): An object to configure Axe rules (e.g., disable certain rules, set impact levels to check).
    -   `violationCallback` (optional): A function to be called if violations are found.
    -   `skipFailures` (optional): Boolean, if true, violations will be logged to the console but will not fail the test.

### Further Configuration:

The `cypress-axe` library offers more advanced configuration options, such as:
-   Setting global Axe rules.
-   Excluding specific elements from scans.
-   Defining custom rule sets.

It's highly recommended to consult the official **`cypress-axe` documentation** on NPM or GitHub for detailed information on these advanced configurations and to understand the full capabilities of the library.

Integrating accessibility scans into your automated tests with `cypress-axe` is a significant step towards building more inclusive web applications. Remember that automated tools can catch many issues, but manual accessibility testing and user feedback are also essential components of a comprehensive accessibility strategy.
