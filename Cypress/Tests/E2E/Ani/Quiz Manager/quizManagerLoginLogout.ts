import { login, logout, userCreate } from "Helper";
import { Role, User, WrongCredentials } from "Models/Ani/QuizManagerModels";
import { QuizManagerLoginPage } from "Pages/Ani/QuizManagerLoginPage";

describe("E2E tests for the Quiz Management Login and Logout flows", () => {
  let manager: User;
  let user: User;
  before(() => {
    userCreate(Role.Manager).then((createdManager) => {
      manager = createdManager;
    });
    userCreate(Role.User).then((createdUser) => {
      user = createdUser;
    });
  });
  beforeEach(() => {
    cy.visit("/fe/login.html");
    cy.intercept("POST", "/be/api/login").as("login");
    cy.intercept("POST", "/be/api/logout").as("logout");
  });
  it("1. Manager login with valid email and password", () => {
    login(manager.email, manager.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
    });
  });
  it("2. User login with valid email and password", () => {
    login(user.email, user.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
    });
  });
  it("3. Manager login with valid email and invalid password", () => {
    login(manager.email, WrongCredentials.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("4. Manager login with invalid email and valid password", () => {
    login(WrongCredentials.email, manager.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("5. Manager login with invalid credentials", () => {
    login(WrongCredentials.email, WrongCredentials.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("6. User login with valid email and invalid password", () => {
    login(user.email, WrongCredentials.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("7. User login with invalid email and valid password", () => {
    login(WrongCredentials.email, user.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("8. User login with invalid credentials", () => {
    login(WrongCredentials.email, WrongCredentials.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("9. Manager logout works properly", () => {
    login(manager.email, manager.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
    });
    logout();
    cy.wait("@logout").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });
  });
  it("10. User logout works properly", () => {
    login(user.email, user.password);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
    });
    logout();
    cy.wait("@logout").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });
  });
});
