/**
 * Test suite demonstrating advanced CSS selectors in a realistic HTML structure.
 */
describe('Realistic DOM - Advanced CSS Selectors in Cypress', () => {
  /**
   * Visit the test HTML file before each test.
   */
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/Cypress/Tests/UI/Css%20Selectors/htmls/advanced_css.html');
  });

  /**
   * Fill out a login form using descendant and positional selectors.
   */
  it('Fills login form using descendant selectors', () => {
    // Select the first input-group's input field (email) and type a value
    cy.get('.login-wrapper .auth-form .input-group:first-of-type input')
      .type('user@example.com');

    // Select the second input-group's input field (password) using .eq()
    cy.get('.auth-form .input-group')
      .eq(1)
      .find('input')
      .type('supersecret');

    // Check the "Remember Me" checkbox using class and attribute selector
    cy.get('.auth-form .remember-block input[type="checkbox"]')
      .check();

    // Click the primary Sign In button inside the auth-form
    cy.get('.auth-form .row-item button.btn.primary-btn')
      .click();
  });

  /**
   * Interact with a settings list using structural and index-based selectors.
   */
  it('Interacts with preferences list using structural selectors', () => {
    // Select the first setting row and change the language to 'FR'
    cy.get('.dashboard-container .settings-list li')
      .eq(0)
      .find('select')
      .select('FR');

    // Select the second setting row and change timezone to 'UTC'
    cy.get('.settings-list li')
      .eq(1)
      .find('select')
      .select('UTC');

    // Uncheck the Email Notifications checkbox in the third row
    cy.get('.settings-list li')
      .eq(2)
      .find('input[type="checkbox"]')
      .uncheck();

    // Check the Push Notifications checkbox in the fourth row
    cy.get('.settings-list li')
      .eq(3)
      .find('input[type="checkbox"]')
      .check();

    // Click the Save Settings button located inside .actions div
    cy.get('.dashboard-container .actions > .save-btn')
      .click();
  });

  /**
   * Assert specific sibling and child element relationships in the DOM.
   */
  it('Verifies sibling and child relationships', () => {
    // Verify that the second input-group input has type="password"
    cy.get('.input-group')
      .eq(1)
      .find('input')
      .should('have.attr', 'type', 'password');

    // Validate that the third setting-row's notification label contains expected text
    cy.get('.setting-row:nth-child(3) .notifications > span')
      .should('contain', 'Email Notifications');
  });

  /**
   * Count checkboxes and verify how many are checked by default.
   */
  it('Counts and verifies checkboxes', () => {
    // Assert that 3 checkboxes exist on the page
    cy.get('input[type="checkbox"]')
      .should('have.length', 3);

    // Assert that exactly 1 checkbox is checked by default
    cy.get('input[type="checkbox"]:checked')
      .should('have.length', 1);
  });
});

/*
| Feature / Action                        | CSS Selector(s) Used                                               | Assertion / Action                   |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| Fill login form – email input           | `.login-wrapper .auth-form .input-group:first-of-type input`       | Type value into first input field    |
| Fill login form – password input        | `.auth-form .input-group` → `.eq(1).find('input')`                 | Type value into second input field   |
| Check “Remember Me” checkbox            | `.auth-form .remember-block input[type="checkbox"]`                | Check checkbox                       |
| Click submit button                     | `.auth-form .row-item button.btn.primary-btn`                      | Click button                         |
| Change language to French               | `.dashboard-container .settings-list li` → `.eq(0).find('select')` | Select 'FR' option                   |
| Change timezone to UTC                  | `.settings-list li` → `.eq(1).find('select')`                      | Select 'UTC' option                  |
| Uncheck Email Notifications             | `.settings-list li` → `.eq(2).find('input[type="checkbox"]')`      | Uncheck checkbox                     |
| Check Push Notifications                | `.settings-list li` → `.eq(3).find('input[type="checkbox"]')`      | Check checkbox                       |
| Click “Save Settings” button            | `.dashboard-container .actions > .save-btn`                        | Click button                         |
| Verify password input type              | `.input-group` → `.eq(1).find('input')`                            | Should have `type="password"`        |
| Validate label inside third setting-row | `.setting-row:nth-child(3) .notifications > span`                  | Should contain 'Email Notifications' |
| Count all checkboxes                    | `input[type="checkbox"]`                                           | Should be 3                          |
| Count checked checkboxes                | `input[type="checkbox"]:checked`                                   | Should be 1 (initial state)          |
 */