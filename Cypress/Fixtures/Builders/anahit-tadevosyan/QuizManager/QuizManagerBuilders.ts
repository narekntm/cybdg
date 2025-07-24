import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizCreationData, User } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

export class QuizManagerBuilders {
  static login(email: string, password: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.login(),
      body: { email, password },
      failOnStatusCode,
    });
  }

  static token: string;
  static Auth = () => {
    return cy
      .request("POST", QuizManagerEndpoints.Auth, {
        email: Cypress.env("TESTING_USER_EMAIL"),
        password: Cypress.env("TESTING_USER_PASSWORD"),
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        QuizManagerBuilders.token = res.body.token;
      });
  };

  static User = (newUser: User) => {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.Users,
      headers: {
        Authorization: `Bearer ${QuizManagerBuilders.token}`,
      },
      body: newUser,
    });
  };

  static logout(failOnStatusCode: boolean = true) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.logout(),
      failOnStatusCode,
    });
  }

  static getCurrentUser(failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.me(),
      failOnStatusCode,
    });
  }

  static getUsers(failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.users(),
      failOnStatusCode,
    });
  }

  static createQuiz(quizData: QuizCreationData, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.quizzes(),
      body: quizData,
      failOnStatusCode,
    });
  }

  static publishQuiz(quizId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "PATCH",
      url: QuizManagerEndpoints.publishQuiz(quizId),
      failOnStatusCode,
    });
  }

  static archiveQuiz(quizId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "PATCH",
      url: QuizManagerEndpoints.archiveQuiz(quizId),
      failOnStatusCode,
    });
  }

  static deleteQuiz(quizId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "DELETE",
      url: QuizManagerEndpoints.quizzes(quizId),
      failOnStatusCode,
    });
  }

  static getQuizzes(failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizzes(),
      failOnStatusCode,
    });
  }

  static getSubmissionsMe(quizId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizzes(quizId),
      failOnStatusCode,
    });
  }

  static submitQuizAnswers(quizId: string, answers: { [questionId: string]: string | string[] }, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.quizSubmissions(quizId),
      body: { answers },
      failOnStatusCode,
    });
  }

  static updateSubmission(submissionId: string, answers: { [questionId: string]: string | string[] }, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "PUT",
      url: QuizManagerEndpoints.submissionById(submissionId),
      body: { answers },
      failOnStatusCode,
    });
  }

  static getUserSubmissions(failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submissionsMe(),
      failOnStatusCode,
    });
  }

  static getQuizSubmissions(quizId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizSubmissions(quizId),
      failOnStatusCode,
    });
  }

  static getSubmission(submissionId: string, failOnStatusCode: boolean = true) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submissionById(submissionId),
      failOnStatusCode,
    });
  }
}
