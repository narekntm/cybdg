import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizManager/QuizzManagementEndPoints";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/QuizManager/UserManagementModels";

export class QuizzManagementBuilders {
  static token: string;

  static authMe = (failOnStatusCode: boolean = true) => {
    return cy.request({
      method: "Get",
      url: QuizzManagementEndPoints.authMe,
      failOnStatusCode: failOnStatusCode,
    });
  };

  static auth = () => {
    return cy
      .request({
        method: "POST",
        url: QuizzManagementEndPoints.testAuth,
        body: {
          email: Cypress.env("TEST_USER_EMAIL"),
          password: Cypress.env("TEST_USER_PASSWORD"),
        },
      })
      .then((response) => {
        QuizzManagementBuilders.token = response.body.token;
      });
  };

  static postUser = (login: UserManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.testUsers,
      body: login,
      headers: {
        authorization: `Bearer ${QuizzManagementBuilders.token}`,
      },
    });
  };

  static loginUser = (login: UserManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.login,
      body: {
        email: login.email,
        password: login.password,
      },
    });
  };

  static logout = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.logout,
    });
  };

  static postQuizz = (quizz: QuizzManagementModels.Quizz) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.quizzes,
      body: quizz,
    });
  };

  static publishQuizz = (dataID: string) => {
    return cy.request({
      method: "PATCH",
      url: QuizzManagementEndPoints.quizzAction(dataID, QuizzManagementModels.QuizzActions.Publish),
    });
  };

  static archiveQuizz = (dataID: string) => {
    return cy.request({
      method: "PATCH",
      url: QuizzManagementEndPoints.quizzAction(dataID, QuizzManagementModels.QuizzActions.Archive),
    });
  };

  static deleteQuizz = (dataID: string) => {
    return cy.request({
      method: "DELETE",
      url: QuizzManagementEndPoints.deleteQuizz(dataID),
    });
  };

  static getUsers = () => {
    return cy.request({
      method: "GET",
      url: QuizzManagementEndPoints.users,
    });
  };

  static getSubmissions = (userID: string) => {
    return cy.request({
      method: "GET",
      url: QuizzManagementEndPoints.submissions(userID),
    });
  };

  static submitQuizz = (quizId: string, answers: object) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.postSubmissions(quizId),
      body: answers,
    });
  };

  static getQuizz = (quizId: string) => {
    return cy.request({
      method: "GET",
      url: QuizzManagementEndPoints.getQuizz(quizId),
    });
  };
}
