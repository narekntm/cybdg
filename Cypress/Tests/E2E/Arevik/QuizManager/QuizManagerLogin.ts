import { QuizManagerModels } from "Cypress/Fixtures/Models/Arevik/QuizManagerModels";
import { QuizManagerLoginMethods } from "Cypress/Fixtures/Methods/Arevik/QuizManagerMethods/QuizManagerLoginMethods";
import { QuizManagerLoginPage } from "Cypress/Fixtures/Pages/Arevik/QuizManagerPages/QuizManagerLoginPage";
import { QuizManagerEndpoints } from "EndPoints/Arevik/QuizManagerEndPoints/QuizManagerEndPoints";

describe("Quiz Manager - Login Page", () => {
  const baseUrl = "/login.html";
  beforeEach(() => {
    cy.intercept({ method: "Get", url: QuizManagerEndpoints.me() });
    cy.visit(baseUrl);
  });

  it("should display login UI correctly", () => {
    QuizManagerLoginPage.loginContainer().should("be.visible");
    QuizManagerLoginPage.loginHeader().should("be.visible");
    QuizManagerLoginPage.emailLabel().should("contain", "Email");
    QuizManagerLoginPage.passwordLabel().should("contain", "Password");
    QuizManagerLoginPage.emailInput().should("exist");
    QuizManagerLoginPage.passwordInput().should("exist");
    QuizManagerLoginPage.submitButton().should("contain", "Login");
  });

  it("should successfully login with valid manager credentials", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        id: "manager1",
        name: "Manager",
        email: "manager@quizz.com",
        role: "manager",
        token: "jwt-fake-token",
      },
    }).as("loginSuccess");

    QuizManagerLoginMethods.Auth({
      login: "manager@quizz.com",
      password: "manager123",
    });

    cy.wait("@loginSuccess").its("request.body").should("deep.equal", {
      email: "manager@quizz.com",
      password: "manager123",
    });

    cy.url().should("not.include", "login.html");
  });

  it("should show error messages for empty fields", () => {
    QuizManagerLoginMethods.Auth(); // no data
    QuizManagerLoginPage.errorMessage().should("contain", "Email is required");
    QuizManagerLoginPage.errorMessage().should("contain", "Password is required");
  });

  it("should show error for invalid data", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { message: QuizManagerModels.InvalidCredentials },
    }).as("loginFail");

    QuizManagerLoginMethods.Auth({
      login: "wrong@quizz.com",
      password: "wrongpass",
    });

    cy.wait("@loginFail");
    QuizManagerLoginPage.errorMessage().should("contain", QuizManagerModels.InvalidCredentials);
  });
});
