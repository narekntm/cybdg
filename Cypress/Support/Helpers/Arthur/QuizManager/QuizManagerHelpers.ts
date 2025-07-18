import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import {
  AssignedUsers,
  QuestionType,
  QuizRequest,
  QuizResponse,
  QuizSuccessMessages,
  UserCredentials,
} from "Models/Arthur/QuizManager/QuizManagerModels";
import { ManagerPage } from "Pages/Arthur/QuizManager/ManagerPage";

export function loginViaApi(user: UserCredentials): Cypress.Chainable {
  return cy
    .request({
      method: "POST",
      url: QuizManagerEndpoints.login,
      body: {
        email: user.email,
        password: user.password,
      },
    })
    .its("headers.set-cookie")
    .should("exist")
    .then((cookies) => {
      const cookieString = Array.isArray(cookies) ? cookies.find((c) => c.includes("authToken")) : cookies;
      expect(cookieString, "authToken cookie should be present").to.exist;
      const token = cookieString.split(";")[0].split("=")[1];
      cy.setCookie("authToken", token);
    });
}

export function logoutViaApi(failOnStatusCode: boolean = true): Cypress.Chainable {
  return cy
    .request({
      method: "POST",
      url: QuizManagerEndpoints.logout,
      failOnStatusCode,
    })
    .then(() => {
      cy.clearCookie("authToken");
    });
}

export function clearAuth(): void {
  cy.clearCookie("authToken");
}

export function createAndPublishQuiz(quiz: QuizRequest): Cypress.Chainable<string> {
  return cy.request<QuizResponse>("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => {
    const quizId = res.body.id;
    return cy.request("PATCH", QuizManagerEndpoints.quizPublish(quizId)).then(() => quizId);
  });
}

export function createAndPublishGeneratedQuiz(): Cypress.Chainable<string> {
  const quiz = QuizGenerator.generateQuizWithAllTypes();
  return createAndPublishQuiz(quiz);
}

export function createDraftQuiz(quiz: QuizRequest): Cypress.Chainable<string> {
  return cy.request<QuizResponse>("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => res.body.id);
}

export function createAndPublishQuizUI(type: QuestionType = QuestionType.Input): Cypress.Chainable<QuizRequest> {
  const quiz = QuizGenerator.generateQuizWithOnly(type);

  ManagerPage.quizTitleInput().type(quiz.title);
  ManagerPage.quizDescriptionInput().type(quiz.description);
  ManagerPage.addQuestionButton().click();
  ManagerPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
  ManagerPage.questionTypeSelects().eq(0).select(quiz.questions[0].type);
  ManagerPage.selectAssignMode().select(AssignedUsers.All);

  ManagerPage.saveQuizButton().click();
  ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

  ManagerPage.quizItemByTitle(quiz.title).within(() => {
    ManagerPage.publishButtonWithin().click();
  });

  return cy.wrap(quiz);
}

export function createDraftQuizUI(type: QuestionType = QuestionType.Input): Cypress.Chainable<QuizRequest> {
  const quiz = QuizGenerator.generateQuizWithOnly(type);

  ManagerPage.quizTitleInput().type(quiz.title);
  ManagerPage.quizDescriptionInput().type(quiz.description);
  ManagerPage.addQuestionButton().click();
  ManagerPage.questionTextInputs().eq(0).type(quiz.questions[0].label);
  ManagerPage.questionTypeSelects().eq(0).select(quiz.questions[0].type);
  ManagerPage.selectAssignMode().select(AssignedUsers.All);

  ManagerPage.saveQuizButton().click();
  ManagerPage.toastSuccess().should("contain", QuizSuccessMessages.QuizSaved);

  return cy.wrap(quiz);
}
