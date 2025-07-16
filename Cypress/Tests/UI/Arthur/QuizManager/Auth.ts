import Chance from "chance";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { loginViaApi, logoutViaApi } from "Cypress/Support/Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { frontendRoutes } from "EndPoints/Arthur/QuizManager/FrontendRoutes";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";
import { LoginPage } from "Pages/Arthur/QuizManager/LoginPage";
import { UserViewPage as UserPage } from "Pages/Arthur/QuizManager/UserPage";

const chance = new Chance();

describe("UI Login Flow", () => {
  let manager: UserCredentials;
  let user: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((cred) => {
      manager = cred;
    });
    TestUserBuilder.createUser(UserRole.User).then((cred) => {
      user = cred;
    });
  });

  beforeEach(() => {
    cy.visit(frontendRoutes.Login);
  });

  it("Should login as manager and redirect to manager.html", () => {
    LoginPage.getEmailInput().clear().type(manager.email);
    LoginPage.getPasswordInput().clear().type(manager.password);
    LoginPage.getSubmitButton().click();
    cy.url().should("include", frontendRoutes.Manager);
  });

  it("Should login as user and redirect to user.html", () => {
    LoginPage.getEmailInput().clear().type(user.email);
    LoginPage.getPasswordInput().clear().type(user.password);
    LoginPage.getSubmitButton().click();
    cy.url().should("include", frontendRoutes.User);
  });

  it("Should show error on invalid user", () => {
    const fakeEmail = chance.email({ domain: "example.com" });
    const fakePassword = chance.string({ length: 12 });

    LoginPage.getEmailInput().clear().type(fakeEmail);
    LoginPage.getPasswordInput().clear().type(fakePassword);
    LoginPage.getSubmitButton().click();

    LoginPage.getLoginError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should show error on valid email + wrong password", () => {
    const wrongPassword = chance.string({ length: 16 });

    LoginPage.getEmailInput().clear().type(user.email);
    LoginPage.getPasswordInput().clear().type(wrongPassword);
    LoginPage.getSubmitButton().click();

    LoginPage.getLoginError().should("contain", AuthErrorMessages.InvalidCredentials);
  });

  it("Should redirect if already logged in (manager)", () => {
    loginViaApi(manager).then(() => {
      cy.visit(frontendRoutes.Login);
      cy.url().should("include", frontendRoutes.Manager);
    });
  });

  it("Should redirect if already logged in (user)", () => {
    loginViaApi(user).then(() => {
      cy.visit(frontendRoutes.Login);
      cy.url().should("include", frontendRoutes.User);
    });
  });

  it("Should logout and restrict access", () => {
    loginViaApi(user).then(() => {
      cy.visit(frontendRoutes.User);
      UserPage.logoutButton().click();
      cy.url().should("include", frontendRoutes.Login);

      cy.visit(frontendRoutes.User);
      cy.url().should("include", frontendRoutes.Login);
    });
  });
});

afterEach(() => {
  logoutViaApi(false);
});
