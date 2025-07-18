import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizRequest, QuizResponse, UserCredentials } from "Models/Arthur/QuizManager/QuizManagerModels";
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

export function fillQuizFormUI(quiz: QuizRequest): void {
  ManagerPage.quizTitleInput().type(quiz.title);
  ManagerPage.quizDescriptionInput().type(quiz.description);

  quiz.questions.forEach((q, index) => {
    ManagerPage.addQuestionButton().click();
    ManagerPage.questionTextInputs().eq(index).type(q.label);
    ManagerPage.questionTypeSelects().eq(index).select(q.type);
    q.options.forEach((opt) => {
      ManagerPage.optionInputFields().eq(index).type(opt);
      ManagerPage.addOptionButtons().eq(index).click();
    });
  });

  ManagerPage.selectAssignMode().select("all");
}

export function createDraftQuiz(quiz: QuizRequest): Cypress.Chainable<string> {
  return cy.request<QuizResponse>("POST", QuizManagerEndpoints.quizzes, quiz).then((res) => res.body.id);
}
