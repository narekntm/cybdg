/**
 * Test suite demonstrating core CSS selectors in Cypress
 * against a structured HTML demo page.
 */
describe("CSS Selector Examples", () => {
  /**
   * Load the target HTML file before each test.
   */
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080/Resources/htmls/CSS/css.html"); // Adjust path as needed
  });

  /**
   * Select all input elements inside a form (descendant selector).
   */
  it("Selects inputs inside form", () => {
    // Selects all <input> elements that are inside any <form>
    cy.get("form input").should("have.length", 3);
  });

  /**
   * Select <li> elements that are direct children of <ul> (child combinator).
   */
  it("Selects direct children li of ul", () => {
    // Selects only <li> elements directly under <ul> (not nested in divs or other tags)
    cy.get("ul > li").should("have.length", 3);
  });

  /**
   * Select inputs that are adjacent siblings immediately following labels.
   */
  it("Selects input adjacent to label", () => {
    // Selects <input> elements that directly follow <label> elements
    cy.get("label + input").should("have.length", 2);
  });

  /**
   * Select all <p> elements that are siblings after an <h2>.
   */
  it("Selects paragraphs that follow h2", () => {
    // Selects all <p> elements that are general siblings of <h2> and appear after it
    cy.get("h2 ~ p").should("have.length", 2);
  });

  /**
   * Select the first and last <li> elements from a list.
   */
  it("Selects first and last li", () => {
    // First <li> in its parent list
    cy.get("li:first-child").should("contain", "First");

    // Last <li> in its parent list
    cy.get("li:last-child").should("contain", "Third");
  });

  /**
   * Select the second table row using nth-child selector.
   */
  it("Selects second table row", () => {
    // Selects the second <tr> among table rows (e.g. Row 2)
    cy.get("tr:nth-child(2)").should("contain", "Row 2");
  });

  /**
   * Select all inputs except those with type="submit".
   */
  it("Excludes submit input", () => {
    // Selects all <input> elements that are NOT type="submit"
    cy.get('input:not([type="submit"])').should("have.length", 4);
  });

  /**
   * Select all checked input elements (radio, checkbox, etc).
   */
  it("Selects checked inputs", () => {
    // Selects <input> elements that are currently checked
    cy.get("input:checked").should("have.length", 2);
  });

  /**
   * Select any disabled buttons on the page.
   */
  it("Selects disabled buttons", () => {
    // Selects <button> elements that have the disabled attribute
    cy.get("button:disabled").should("exist");
  });
});

/*
| Feature Tested                     | Selector Used                     | Assertion        |
| ---------------------------------- | --------------------------------- | ---------------- |
| Descendant form inputs             | `form input`                      | Count = 3        |
| Direct child `<li>` in `<ul>`      | `ul > li`                         | Count = 3        |
| Adjacent sibling input             | `label + input`                   | Count = 2        |
| General sibling `<p>` after `<h2>` | `h2 ~ p`                          | Count = 2        |
| First & last list items            | `li:first-child`, `li:last-child` | Text match       |
| Table row by order                 | `tr:nth-child(2)`                 | Contains 'Row 2' |
| Exclude input by type              | `input:not([type="submit"])`      | Count = 4        |
| Checked inputs                     | `input:checked`                   | Count = 2        |
| Disabled button                    | `button:disabled`                 | Exists           |
 */
