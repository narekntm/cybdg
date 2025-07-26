import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { FrontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { TokenGenerator } from "Generators/Arthur/QuizManager/TokenGenerator";
import { UserGenerator } from "Generators/Arthur/QuizManager/UserGenerator";
import { clearAuth, loginViaApi, logoutViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { CommonPage } from "Pages/Arthur/QuizManager/CommonPage";
import { LoginPage } from "Pages/Arthur/QuizManager/LoginPage";

describe("E2E Authentication & Access", () => {
  let manager: UserCredentials;
  let user: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((u) => (manager = u));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  beforeEach(() => {
    clearAuth();
    cy.intercept("POST", QuizManagerEndpoints.login).as("loginRequest");
    cy.intercept("GET", QuizManagerEndpoints.authMe).as("authMeRequest");
    cy.visit(FrontendRoutes.Login);
    cy.wait("@authMeRequest").its("response.statusCode").should("eq", 401);
  });

  context("Login flow", () => {
    it("Should login as manager, redirect, and show manager dashboard UI", () => {
      LoginPage.getEmailInput().type(manager.email);
      LoginPage.getPasswordInput().type(manager.password);
      LoginPage.getSubmitButton().click();

      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      cy.wait("@authMeRequest").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.include({
          email: manager.email,
          role: UserRole.Manager,
        });
      });

      cy.url().should("include", FrontendRoutes.Manager);
      CommonPage.managerUsername().should("be.visible").and("contain", manager.id);
    });

    it("Should login as user, redirect, and show user dashboard UI", () => {
      LoginPage.getEmailInput().type(user.email);
      LoginPage.getPasswordInput().type(user.password);
      LoginPage.getSubmitButton().click();

      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

      cy.wait("@authMeRequest").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.include({
          email: user.email,
          role: UserRole.User,
        });
      });

      cy.url().should("include", FrontendRoutes.User);
      CommonPage.username().should("be.visible").and("contain", user.id);
    });
  });

  context("Negative login scenarios", () => {
    it("Should show error on invalid credentials", () => {
      const invalidUser = UserGenerator.invalidUser();
      LoginPage.getEmailInput().type(invalidUser.email);
      LoginPage.getPasswordInput().type(invalidUser.password);
      LoginPage.getSubmitButton().click();
      CommonPage.toastError().should("contain", AuthErrorMessages.InvalidCredentials);
      cy.url().should("include", FrontendRoutes.Login);
    });
  });

  context("Session management", () => {
    it("Should redirect authenticated user from login to dashboard", () => {
      loginViaApi(manager).then(() => {
        cy.visit(FrontendRoutes.Login);
        cy.url().should("include", FrontendRoutes.Manager);
      });
    });

    it("Should logout and restrict access", () => {
      LoginPage.getEmailInput().type(user.email);
      LoginPage.getPasswordInput().type(user.password);
      LoginPage.getSubmitButton().click();
      cy.url().should("include", FrontendRoutes.User);

      logoutViaApi().then(() => {
        cy.visit(FrontendRoutes.User);
        cy.url().should("include", FrontendRoutes.Login);

        cy.request({
          method: "GET",
          url: QuizManagerEndpoints.authMe,
          failOnStatusCode: false,
        })
          .its("status")
          .should("eq", 401);
      });
    });

    it("Should block access with invalid session", () => {
      clearAuth();
      cy.setCookie("authToken", TokenGenerator.invalidToken());
      cy.visit(FrontendRoutes.User);

      cy.wait("@authMeRequest").then((interception) => {
        expect(interception.response?.statusCode).to.eq(401);
      });

      cy.url().should("include", FrontendRoutes.Login);
    });
  });
});
