import { UserBuilder } from "Builders/Arthur/QuizManager/QuizManagerBuilders";
import { clearAuth, loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { AdminPage } from "Pages/Arthur/QuizManager/AdminPage";
import { LoginPage } from "Pages/Arthur/QuizManager/LoginPage";
import { UserViewPage } from "Pages/Arthur/QuizManager/UserPage";

describe("UI Login Flow", () => {
  const admin = UserBuilder.validAdmin();
  const user = UserBuilder.validUser();
  const invalid = UserBuilder.invalidUser();
  const wrongPassword = UserBuilder.withWrongPassword();

  beforeEach(() => {
    clearAuth();
    LoginPage.visit();
  });

  it("Should login as admin and redirect to admin.html", () => {
    LoginPage.fillEmail(admin.email);
    LoginPage.fillPassword(admin.password);
    LoginPage.submit();
    cy.url().should("include", AdminPage.url);
  });

  it("Should login as user and redirect to user.html", () => {
    LoginPage.fillEmail(user.email);
    LoginPage.fillPassword(user.password);
    LoginPage.submit();
    cy.url().should("include", UserViewPage.url);
  });

  it("Should show error on invalid user", () => {
    LoginPage.fillEmail(invalid.email);
    LoginPage.fillPassword(invalid.password);
    LoginPage.submit();
    LoginPage.getLoginError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should show error on valid email + wrong password", () => {
    LoginPage.fillEmail(wrongPassword.email);
    LoginPage.fillPassword(wrongPassword.password);
    LoginPage.submit();
    LoginPage.getLoginError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should redirect if already logged in (admin)", () => {
    loginViaApi(admin).then(() => {
      LoginPage.visit();
      cy.url().should("include", AdminPage.url);
    });
  });

  it("Should redirect if already logged in (user)", () => {
    loginViaApi(user).then(() => {
      LoginPage.visit();
      cy.url().should("include", UserViewPage.url);
    });
  });

  it("Should logout and redirect to login, then restrict access to protected page", () => {
    loginViaApi(user).then(() => {
      UserViewPage.visit();
      UserViewPage.logoutButton().click();
      cy.url().should("include", LoginPage.url);
      UserViewPage.visit();
      cy.url().should("include", LoginPage.url);
    });
  });
});

afterEach(() => {
  logoutViaApi(false);
  clearAuth();
});
