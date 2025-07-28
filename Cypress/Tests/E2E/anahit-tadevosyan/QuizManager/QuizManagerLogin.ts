import { QuizManagerBuilders } from "Builders/anahit-tadevosyan/QuizManager/QuizManagerBuilders";
import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { generateUser, login, logout } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { Role, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";
import { QuizManagerCommonPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerCommonPage";

describe("Login Test Cases", () => {
  const baseUrl = "/login.html";
  let managerUser: User;
  let regularUser1: User;
  let regularUser2: User;
  let initialAuthToken: string;
  const invalidEmail = "invalid@login.com";
  const invalidPassword = "invalid@login";

  before(() => {
    QuizManagerBuilders.Auth().then(() => {
      managerUser = generateUser(Role.Manager);
      regularUser1 = generateUser(Role.User);
      regularUser2 = generateUser(Role.User);

      return Promise.all([
        QuizManagerBuilders.User(managerUser),
        QuizManagerBuilders.User(regularUser1),
        QuizManagerBuilders.User(regularUser2),
      ]);
    });
  });

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.url().should("include", "/login.html");
  });

  describe("Login Positive Cases", () => {
    afterEach(() => {
      logout();
      cy.url().should("include", "/login.html");
    });

    it("Login Positive Test Cases for Manager", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.me() }).as("getMe");

      login(managerUser.email, managerUser.password);
      cy.getCookie("authToken").then((cookie) => {
        expect(cookie).to.exist;
        initialAuthToken = cookie.value;
      });

      cy.url().should("include", "/manager.html");

      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.exist;
        expect(cookie.value).to.equal(initialAuthToken);
      });

      cy.url().should("include", "/manager.html");
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
      cy.getCookie("authToken").then((cookie) => {
        expect(cookie).to.exist;
        initialAuthToken = cookie.value;
      });

      cy.url().should("include", "/user.html");

      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.exist;
        expect(cookie.value).to.equal(initialAuthToken);
      });

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
      login(invalidEmail, invalidPassword, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });

    it("Login Invalid Emails", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(invalidEmail, managerUser.password, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });

    it("Login Invalid Password", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(managerUser.email, invalidPassword, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });
  });
});
