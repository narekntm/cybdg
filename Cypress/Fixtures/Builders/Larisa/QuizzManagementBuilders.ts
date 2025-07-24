import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";

export class QuizzManagementBuilders {
  static authMe = () => {
    return cy.request({
      method: "Get",
      url: QuizzManagementEndPoints.authMe,
      failOnStatusCode: false,
    });
  };

  static auth = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.testAuth,
      body: {
        email: Cypress.env("TEST_USER_EMAIL"),
        password: Cypress.env("TEST_USER_PASSWORD"),
      },
    });
  };

  static postUser = (login: UserManagementModels.Login) => {
    return cy.getCookie("authToken").then((cookie) => {
      const token = cookie ? cookie.value : "";

      return cy.request({
        method: "POST",
        url: QuizzManagementEndPoints.testUsers,
        body: login,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  };

  static adminLogin = (login: UserManagementModels.Login) => {
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
