import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { QuizGenerator } from "Generators/Arthur/QuizManager/QuizGenerator";
import { QuizRequest, QuizResponse, UserCredentials } from "Models/Arthur/QuizManager/QuizManagerModels";

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
    .then((res) => {
      const setCookieHeader = res.headers["set-cookie"];
      expect(setCookieHeader, "Set-Cookie header should exist").to.exist;

      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      const authTokenCookie = cookies.find((c) => c.includes("authToken"));
      expect(authTokenCookie, "authToken cookie should be present").to.exist;

      const token = authTokenCookie.split(";")[0].split("=")[1];
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
