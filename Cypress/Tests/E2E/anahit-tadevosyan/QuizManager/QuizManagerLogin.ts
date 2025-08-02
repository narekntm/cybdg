import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { login, logout } from "Helpers/anahit-tadevosyan/QuizManager/QuizManagerHelpers";
import { managerUser, regularUser1, setupTestUsers } from "Helpers/QuizManagerSetup";
import { QuizManagerCommonPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerCommonPage";

describe("Login Test Cases", () => {
  const baseUrl = "/login.html";

  let initialAuthToken: string;
  const invalidEmail = "invalid@login.com";
  const invalidPassword = "invalid@login";

  before(() => {
    setupTestUsers();
  });

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.url().should("include", "/login.html");
    cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
    cy.intercept({ method: "GET", url: QuizManagerEndpoints.me() }).as("getMe");
  });

  describe("Login Positive Cases", () => {
    afterEach(() => {
      logout();
      cy.url().should("include", "/login.html");
    });

    it("Login Positive Test Cases for Manager", () => {
      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.not.exist;
      });

      login(managerUser.email, managerUser.password);

      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.wait("@getMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.getCookie("authToken").then((cookie) => {
        expect(cookie).to.exist;
        initialAuthToken = cookie.value;
      });

      cy.url().should("include", "/manager.html");

      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.exist;
        expect(cookie.value).to.equal(initialAuthToken);
      });
    });

    it("Login Positive Test Cases for User", () => {
      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.not.exist;
      });

      login(regularUser1.email, regularUser1.password);

      cy.wait("@postLogin").then((postLogin) => {
        expect(postLogin.response.statusCode).to.eq(200);
      });
      cy.wait("@getMe").then((getMe) => {
        expect(getMe.response.statusCode).to.eq(200);
      });

      cy.getCookie("authToken").then((cookie) => {
        expect(cookie).to.exist;
        initialAuthToken = cookie.value;
      });

      cy.url().should("include", "/user.html");

      cy.getCookie("authToken").should((cookie) => {
        expect(cookie).to.exist;
        expect(cookie.value).to.equal(initialAuthToken);
      });
    });
  });

  describe("Login Negative Cases", () => {
    it("Login Invalid Credentials", () => {
      login(invalidEmail, invalidPassword, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((postLogin) => {
        expect(postLogin.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });

    it("Login Invalid Emails", () => {
      login(invalidEmail, managerUser.password, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((postLogin) => {
        expect(postLogin.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });

    it("Login Invalid Password", () => {
      login(managerUser.email, invalidPassword, false);
      cy.url().should("include", "/login.html");
      cy.wait("@postLogin").then((postLogin) => {
        expect(postLogin.response.statusCode).to.eq(401);
      });
      QuizManagerCommonPage.toastContainer().should("contain", "Login failed: Invalid credentials");
    });
  });
});
