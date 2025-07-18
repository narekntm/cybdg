import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizManagerLoginPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import { QuizManagerManagerViewPage } from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import { UserManagementPage } from "Pages/anahit-tadevosyan/UserManagementV2Page";

describe("Login Test Cases", () => {
  const baseUrl = "/login.html";
  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");
  const user1Email = Cypress.env("USER1_EMAIL");
  const user1Password = Cypress.env("USER1_PASSWORD");
  const invalidEmail = "invalid@login.com";
  const invalidPassword = "invalid@login";
  const login = function (email: string, password: string) {
    QuizManagerLoginPage.emailInput().clear().type(email);
    QuizManagerLoginPage.passwordInput().clear().type(password);
    QuizManagerLoginPage.loginButton().click();
  };
  beforeEach(() => {
    cy.intercept({ method: "Get", url: QuizManagerEndpoints.me() }).as("getCurrentUser");
    cy.visit(baseUrl);
    cy.wait("@getCurrentUser").then((interception) => {
      expect(interception.response.statusCode).to.eq(401);
      expect(interception.response.body).to.deep.equal({ error: "Unauthorized" });
    });
  });
  describe('Login Positive Cases', () => {
    afterEach(() => {
      QuizManagerManagerViewPage.logoutButton().click();
    });
    it("Login Positive Test Cases for Manager", () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      cy.intercept({ method: "GET", url: QuizManagerEndpoints.me() }).as("getMe");

      login(managerEmail, managerPassword);

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

      login(user1Email, user1Password);

      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });

      cy.wait("@getMe").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
      });
    });
  })

  describe('Login Negative Cases', ()=> {
    it('Login Invalid Credentials', () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(invalidEmail, invalidPassword);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should('contain', 'Login failed: Invalid credentials');
    })
    it('Login Invalid Emails', ()=> {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(invalidEmail, managerPassword);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should('contain', 'Login failed: Invalid credentials');
    })
    it('Login Invalid Password', () => {
      cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
      login(managerEmail, invalidPassword);
      cy.wait("@postLogin").then((interception) => {
        expect(interception.response.statusCode).to.eq(401);
      });
      QuizManagerLoginPage.toastContainer().should('contain', 'Login failed: Invalid credentials');
    })

  })

});
