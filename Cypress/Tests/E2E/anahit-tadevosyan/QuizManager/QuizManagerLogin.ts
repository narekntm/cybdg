import Chance from "chance";
import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { Role, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";

const chance = new Chance();

describe("Login Test Cases", () => {
  const baseUrl = "http://127.0.0.1:5151/login.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  const invalidEmail = "invalid@login.com";
  const invalidPassword = "invalid@login";
  const login = function (email: string, password: string) {
    QuizManagerLoginPage.emailInput().clear().type(email);
    QuizManagerLoginPage.passwordInput().clear().type(password);
    QuizManagerLoginPage.loginButton().click();
  };

  before(() => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.Manager,
      };

      regularUser1 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

      regularUser2 = {
        id: chance.guid(),
        email: chance.email({ domain: "example.com" }),
        password: chance.string({ length: 10 }),
        role: Role.User,
      };

      return Promise.all([
        QuizManagerBuilders.User(managerUser),
        QuizManagerBuilders.User(regularUser1),
        QuizManagerBuilders.User(regularUser2),
      ]);
    });
  });
  beforeEach(() => {
    cy.intercept({ method: "Get", url: QuizManagerEndpoints.me() }).as("getCurrentUser");
    cy.visit(baseUrl);
    cy.wait("@getCurrentUser").then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
      expect(interception.response.body).to.deep.equal({ error: "Unauthorized" });
    });
  });
  describe("Login Positive Cases", () => {
    afterEach(() => {
      QuizManagerManagerViewPage.logoutButton().click();
    });
    it("Login Positive Test Cases for Manager", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.me() }).as("getMe");

      login(managerUser.email, managerUser.password);

      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.wait("@getMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
    it("Login Positive Test Cases for User", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.me() }).as("getMe");

      login(regularUser1.email, regularUser1.password);

      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.wait("@getMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  });

  describe("Login Negative Cases", () => {
    it("Login Invalid Credentials", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(invalidEmail, invalidPassword);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });
    it("Login Invalid Emails", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(invalidEmail, managerUser.password);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });
    it("Login Invalid Password", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(managerUser.email, invalidPassword);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });
  });
});
