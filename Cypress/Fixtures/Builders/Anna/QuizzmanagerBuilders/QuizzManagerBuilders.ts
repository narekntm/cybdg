import { QuizzManagerEndpoints } from "EndPoints/Anna/QuizzManagerEndpoints/QuizzManagerEndpoints";
import {  QuizzManagerModels } from "Models/Anna/QuizzManagerModels/QuizzManagerModels";

export class QuizzManagerBuilders {
  static AdminLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.adminLogin,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  };

  static logout() {
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.adminLogout,
    })
  }
  static postQuizz = (quizz: QuizzManagerModels.Quizz) => {
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.quizzes(),
      body: quizz,
      failOnStatusCode: false,
    });
  };


  static getManagerUser() {
    return cy.request({
      method: "GET",
      url: QuizzManagerEndpoints.manager(),
      failOnStatusCode : false,
    });
  }

  static getUsers() {
    return cy.request({
      method: "GET",
      url: QuizzManagerEndpoints.users(),
      failOnStatusCode : false,
    });
  }

  static createQuiz(quizData: QuizzManagerModels.QuizCreationData) {
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.quizzes(),
      body: quizData,
      failOnStatusCode : false,
    });
  }


  static deleteQuizz(quizId: string, isAdmin: boolean = false) {
    return cy.request({
      method: "DELETE",
      url: QuizzManagerEndpoints.quizzes(quizId),
      body: { isAdmin },

    });
  }

  static publishQuizz(quizId: string, ) {
    return cy.request({
      method: "PATCH",
      url: QuizzManagerEndpoints.publishQuiz(quizId),
      body: quizId,
      failOnStatusCode : false,
    });
  }

  static archiveQuizz(quizId: string, ) {
    return cy.request({
      method: "PATCH",
      url: QuizzManagerEndpoints.archiveQuiz(quizId),
      body: quizId,
      failOnStatusCode: false,
    });
  }


  static getQuizzes() {
    cy.log("Fetching quizzes");
    return cy.request("GET", QuizzManagerEndpoints.quizzes());
  }


  static getQuizById(quizId: string) {
    return cy.request({
      method: "GET",
      url: QuizzManagerEndpoints.quizzes(quizId),
      failOnStatusCode : false,
    });
  }


}

