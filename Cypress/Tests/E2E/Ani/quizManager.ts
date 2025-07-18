import { QuizManagerLoginPage } from "Pages/Ani/QuizManagerLoginPage";
import { QuizManagerAdminDashboardPage } from "Pages/Ani/QuizManagerAdminDashboardPage";
import { QuizManagerUserDashboardPage } from "Pages/Ani/QuizManagerUserDashboardPage";
import {
  managerEmail,
  managerPassword,
  wrongEmail,
  wrongPassword,
} from "Static/Ani/testData";
import { AssignTo, HeaderTitles, QuizCreation, Type } from "Models/Ani/QuizManagerModels";
import { QuizManagerBuilders } from "Builders/Ani/QuizManagerBuilders";

describe("E2E tests for the Quiz Management", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5353/fe/login.html");
  });
  function getQuizCreation(
    title: string,
    description: string,
    question: string,
    type: Type,
    assignTo: AssignTo,
  ): QuizCreation {
    return {title: title, description: description, question:question, type:type, assignTo: assignTo};
  }
  const quizForAll: QuizCreation = getQuizCreation("Quiz 1", "quiz description", "What is your age?","Input", "All Users")
  function managerLogin(email: string, password: string) {
    QuizManagerLoginPage.emailInput().type(email);
    QuizManagerLoginPage.passwordInput().type(password);
    QuizManagerLoginPage.loginBtn().click();
  }
  function managerLogout() {
    QuizManagerAdminDashboardPage.logoutButton().click();
  }
  function userLogout(){
    QuizManagerUserDashboardPage.logoutButton().click();
  }
  function quizCreate(quiz: QuizCreation) {
    QuizManagerAdminDashboardPage.quizCreatorSection().click();
    QuizManagerAdminDashboardPage.quizTitleInput().type(quiz.title);
    QuizManagerAdminDashboardPage.quizDescriptionInput().type(quiz.description);
    QuizManagerAdminDashboardPage.addQuestionBtn().click();
    QuizManagerAdminDashboardPage.quizQuestionText().type(quiz.question);
    QuizManagerAdminDashboardPage.quizQuestionTypeSelector().type(quiz.type);
    QuizManagerAdminDashboardPage.quizOptionsInput().type(quiz.assignTo);
    QuizManagerAdminDashboardPage.saveQuizBtn().click();
  }
  it("1. Manager login with valid email and password", () => {
    cy.intercept('POST', '/be/api/login').as('managerLogin');
    managerLogin(managerEmail, managerPassword);
    cy.wait("@managerLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
      QuizManagerAdminDashboardPage.headerTitle().should("contain.text", HeaderTitles.managerDashboardHeaderTitle)
      managerLogout();
    });
  });
  it("2. Manager login with invalid credentials", () => {
    cy.intercept('POST', '/be/api/login').as('managerLogin');
    managerLogin(wrongEmail, wrongPassword);
    cy.wait("@managerLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible")
  });
  it("3. Manager login with valid email and invalid password", () => {
    cy.intercept('POST', '/be/api/login').as('managerLogin');
    managerLogin(managerEmail, wrongPassword);
    cy.wait("@managerLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible")
  });
  it("4. Manager login with invalid email and valid password", () => {
    cy.intercept('POST', '/be/api/login').as('managerLogin');
    managerLogin(wrongEmail, managerPassword);
    cy.wait("@managerLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.statusCode).to.eq(401);
    });
    QuizManagerLoginPage.toastError().should("be.visible")
  });
  it("5. Test user creation and login(success case)", () => {
    return QuizManagerBuilders.CreateAndLoginTestUser();
  });
  it("6. Quiz creation for all users", () => {
    managerLogin(managerEmail, managerPassword);
    quizCreate(quizForAll);
  });
  afterEach(() => {
    userLogout();
  })
})