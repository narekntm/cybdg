import { login, logout, quizCreate, userCreate } from "Helper";
import { HeaderTitles, QuizCreation, Role } from "Models/Ani/QuizManagerModels";
import { QuizManagerAdminDashboardPage } from "Pages/Ani/QuizManagerAdminDashboardPage";
import { QuizManagerLoginPage } from "Pages/Ani/QuizManagerLoginPage";
import { managerEmail, managerPassword, wrongEmail, wrongPassword } from "Static/Ani/testData";

describe("E2E tests for the Quiz Management", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5353/fe/login.html");
    cy.intercept("POST", "/be/api/login").as("login");
    cy.intercept("POST", "/be/api/logout").as("logout");
  });
  const quizForAll: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Input", "All Users");
  it("1. Manager login with valid email and password", () => {
    login(managerEmail, managerPassword);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
      QuizManagerAdminDashboardPage.headerTitle().should("contain.text", HeaderTitles.managerDashboardHeaderTitle);
    });
  });
  it("2. Manager login with invalid credentials", () => {
    login(wrongEmail, wrongPassword);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("3. Manager login with valid email and invalid password", () => {
    login(managerEmail, wrongPassword);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("4. Manager login with invalid email and valid password", () => {
    login(wrongEmail, managerPassword);
    cy.wait("@login").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible");
  });
  it("5. Manager logout works properly", () => {
    userCreate(Role.Manager).then((user) => {
      login(user.email, user.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
    });
    logout();
    cy.wait("@logout").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });
  });
  it("6. Authenticates and creates a new user", () => {
    userCreate().then((user) => {
      cy.log(`User created: ${user.email}`);
    });
  });
  it("7. User creation and login(success case)", () => {
    userCreate(Role.User).then((user) => {
      login(user.email, user.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
    });
  });
  it("8. Manager creation and login(success case)", () => {
    userCreate(Role.Manager).then((user) => {
      login(user.email, user.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
    });
  });
  it("9. Quiz creation for all users", () => {
    userCreate(Role.Manager).then((user) => {
      login(user.email, user.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
    });
    quizCreate(quizForAll);
  });
});
