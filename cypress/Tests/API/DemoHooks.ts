describe("First Describe block", () => {
  // Runs once before all tests in this block
  before("Suite Before", () => {
    cy.log("🔧 Global setup: Create test user in DB");
  });

  // Runs once after all tests in this block
  after("Suite After", () => {
    cy.log("🧹 Global cleanup: Delete test user");
    // e.g., API call to clean up DB
  });

  // Runs before each test
  beforeEach("Suite level beforeEach", () => {
    cy.log("🔄 Resetting app state before each test");
  });

  // Runs after each test
  afterEach("Suite level afterEach", () => {
    cy.log("🧼 Clean up after each test");
  });

  context("Level 1 Nested Describe block 1", () => {
    it("First test in Level 1", () => {
      cy.log("first test in Level 1");
    });

    it.skip("Second test in Level 1 (skipped)", () => {
      // This test is skipped
      cy.log("This test is skipped");
    });

    it.only("Third test in Level 1 (only)", () => {
      cy.log("third test in Level 1 (only)");
    });
  });

  context("Level 1 Nested Describe block 2", () => {
    beforeEach("Level 2 beforeEach", () => {
      cy.log("🔄 Resetting state for Level 2 tests");
    });

    it("First test in Level 2", () => {
      cy.log("first test in Level 2");
    });

    it("Second test in Level 2", () => {
      cy.log("second test in Level 2");
    });

    afterEach("Level 2 afterEach", () => {
      cy.log("🧼 Clean up after each Level 2 test");
    });
  });
});
