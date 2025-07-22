import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";

export class QuizzManagementBuilders {
  static auth = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.testAuth,
      body: {
        email: Cypress.env("TEST_USER_EMAIL"),
        password: Cypress.env("TEST_USER_PASSWORD"),
      },
      failOnStatusCode: false,
    });
  };

  static postUser = (login: UserManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.testUsers,
      body: login,
      headers: { Authorization: `Bearer ${cy.getCookie("authToken")}` },
      failOnStatusCode: false,
    });
  };

  static adminLogin = (login: UserManagementModels.Login) => {
    return cy.getCookie("authToken").then((cookie) => {
      expect(cookie).to.not.be.null;
      cy.request({
        method: "POST",
        url: QuizzManagementEndPoints.login,
        body: {
          email: login.email,
          password: login.password,
        },
        failOnStatusCode: false,
      });
    });
  };

  static logout = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.logout,
      failOnStatusCode: false,
    });
  };

  static postQuizz = (quizz: QuizzManagementModels.Quizz) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.quizzes,
      body: quizz,
      failOnStatusCode: false,
    });
  };

  static publishQuizz = (dataID: string) => {
    return cy.request({
      method: "PATCH",
      url: QuizzManagementEndPoints.publishQuizz(dataID),
    });
  };

  static archiveQuizz = (dataID: string) => {
    return cy.request({
      method: "PATCH",
      url: QuizzManagementEndPoints.archiveQuizz(dataID),
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
}
