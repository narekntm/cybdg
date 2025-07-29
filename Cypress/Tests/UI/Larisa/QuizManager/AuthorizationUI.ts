import { baseURL } from "Cypress/Support/Larisa/QuizzHelper";
import { QuizzLoginPage } from "Pages/Larisa/QuizManager/QuizzLoginPage";

describe("Quizz Authorization UI Suite", () => {
  before(() => {
    cy.visit(baseURL);
  });

  it("Login UI Test", () => {
    QuizzLoginPage.title().should("be.visible").and("have.text", "Login to Quizz Manager");
    QuizzLoginPage.emailLbl().should("be.visible").and("contain.text", "Email");
    QuizzLoginPage.emailInput().should("be.visible").and("be.enabled").and("have.attr", "required");
    QuizzLoginPage.passwordLbl().should("be.visible").and("contain.text", "Password");
    QuizzLoginPage.passwordInput().should("be.visible").and("be.enabled").and("have.attr", "required");
    QuizzLoginPage.submitBtn().should("be.visible").and("contain.text", "Login");
  });
});
