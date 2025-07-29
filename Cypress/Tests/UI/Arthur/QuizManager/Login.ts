import Chance from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { FrontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { CommonPage } from "Pages/Arthur/QuizManager/CommonPage";
import { LoginPage } from "Pages/Arthur/QuizManager/LoginPage";

const chance = new Chance();

describe("UI Login Flow", () => {
  let manager: UserCredentials;
  let user: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
    TestUserBuilder.createUser(UserRole.User).then((u) => (user = u));
  });

  beforeEach(() => {
    cy.visit(FrontendRoutes.Login);
  });

  it("Should login as manager and redirect to manager.html", () => {
    LoginPage.getEmailInput().clear().type(manager.email);
    LoginPage.getPasswordInput().clear().type(manager.password);
    LoginPage.getSubmitButton().click();
    cy.url().should("include", FrontendRoutes.Manager);
  });

  it("Should login as user and redirect to user.html", () => {
    LoginPage.getEmailInput().clear().type(user.email);
    LoginPage.getPasswordInput().clear().type(user.password);
    LoginPage.getSubmitButton().click();
    cy.url().should("include", FrontendRoutes.User);
  });

  it("Should show error on invalid user", () => {
    const fakeEmail = chance.email({ domain: "example.com" });
    const fakePassword = chance.string({ length: 12 });

    LoginPage.getEmailInput().clear().type(fakeEmail);
    LoginPage.getPasswordInput().clear().type(fakePassword);
    LoginPage.getSubmitButton().click();

    CommonPage.toastError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should show error on valid email + wrong password", () => {
    const wrongPassword = chance.string({ length: 16 });

    LoginPage.getEmailInput().clear().type(user.email);
    LoginPage.getPasswordInput().clear().type(wrongPassword);
    LoginPage.getSubmitButton().click();

    CommonPage.toastError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should redirect if already logged in (manager)", () => {
    loginViaApi(manager);
    cy.visit(FrontendRoutes.Login);
    cy.url().should("include", FrontendRoutes.Manager);
  });

  it("Should redirect if already logged in (user)", () => {
    loginViaApi(user);
    cy.visit(FrontendRoutes.Login);
    cy.url().should("include", FrontendRoutes.User);
  });

  it("Should logout and restrict access", () => {
    loginViaApi(user);
    cy.visit(FrontendRoutes.User);
    CommonPage.logoutButton().click();
    cy.url().should("include", FrontendRoutes.Login);

    cy.visit(FrontendRoutes.User);
    cy.url().should("include", FrontendRoutes.Login);
  });
});

afterEach(() => {
  logoutViaApi(false);
});
