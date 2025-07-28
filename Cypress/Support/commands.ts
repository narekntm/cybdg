import "@testing-library/cypress/add-commands";
import "cypress-file-upload";
import { setupTestUsers } from "../Support/QuizManagerSetup";

Cypress.Commands.add("safeFixture", (fixturePath, options) => {
  cy.task("checkFixtureExists", fixturePath).then((exists) => {
    if (exists) {
      return cy.fixture(fixturePath, options);
    } else {
      cy.log("Fixture not found: ", fixturePath);
      return null;
    }
  });
});

Cypress.Commands.add("clickOutside", () => {
  return cy.get("body").click("top");
});

Cypress.Commands.add("setupTestUsers", () => {
  return setupTestUsers();
});
