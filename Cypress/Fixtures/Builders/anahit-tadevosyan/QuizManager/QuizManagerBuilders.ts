import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import { QuizData } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

export class QuizManagerBuilders {
  static login(email: string, password: string) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.login(),
      body: { email, password },
      failOnStatusCode: false,
    });
  }

  static logout() {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.logout(),
      failOnStatusCode: false,
    });
  }

  static getCurrentUser() {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.me(),
      failOnStatusCode: false,
    });
  }

  static getUsers() {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.users(),
    });
  }

  static createQuiz(quizData: QuizData) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.quizzes(),
      body: quizData,
    });
  }

  static publishQuiz(quizId: string) {
    return cy.request({
      method: "PATCH",
      url: QuizManagerEndpoints.publishQuiz(quizId),
    });
  }

  static archiveQuiz(quizId: string) {
    return cy.request({
      method: "PATCH",
      url: QuizManagerEndpoints.archiveQuiz(quizId),
    });
  }

  static deleteQuiz(quizId: string) {
    return cy.request({
      method: "DELETE",
      url: QuizManagerEndpoints.quizzes(quizId),
    });
  }

  static getQuizzes() {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizzes(),
    });
  }

  static getQuizById(quizId: string) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizzes(quizId),
    });
  }

  static submitQuizAnswers(quizId: string, answers: { [questionId: string]: string | string[] }) {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.quizSubmissions(quizId),
      body: { answers },
    });
  }

  static updateSubmission(submissionId: string, answers: { [questionId: string]: string | string[] }) {
    return cy.request({
      method: "PUT",
      url: QuizManagerEndpoints.submissionById(submissionId),
      body: { answers },
    });
  }

  static getMySubmissions() {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submissionsMe(),
    });
  }

  static getQuizSubmissions(quizId: string) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.quizSubmissions(quizId),
    });
  }

  static getSubmission(submissionId: string) {
    return cy.request({
      method: "GET",
      url: QuizManagerEndpoints.submissionById(submissionId),
    });
  }

  static getCu;
}
