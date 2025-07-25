import { creatQuiz, login, quizCreate, userCreate } from "Helper";
import { QuizCreation, Role } from "Models/Ani/QuizManagerModels";

describe("E2E tests for the Quiz Manager Dashboard page", () => {
  beforeEach(() => {
    cy.visit("/fe/login.html");
    cy.intercept("POST", "/be/api/login").as("login");
    cy.intercept("POST", "/be/api/quizzes").as("createQuiz");
    cy.intercept("GET", "/be/api/quizzes").as("getQuizzes");
  });
  const quizForAll: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Input", "All Users");
  const quizWithInputType: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Input", "All Users");
  const quizWithDropdownType: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Dropdown", "All Users");
  const quizWithCheckboxType: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Checkbox", "All Users");
  const quizWithRadioType: QuizCreation = quizCreate("Quiz 1", "quiz description", "What is your age?", "Radio", "All Users");
  it("1. Quiz creation for all users", () => {
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      quizCreate(quizForAll);
    });
  });
  it("2. Quiz creation with Input question type", () => {
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      quizCreate(quizWithInputType);
    });
  });
  it("3. Quiz creation with Dropdown question type", () => {
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      quizCreate(quizWithDropdownType);
    });
  });
  it("4. Quiz creation with Checkbox question type", () => {
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      quizCreate(quizWithCheckboxType);
    });
  });
  it("5. Quiz creation with Radio question type", () => {
    userCreate(Role.Manager).then((manager) => {
      login(manager.email, manager.password);
      cy.wait("@login").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      quizCreate(quizWithRadioType);
    });
  });
});
