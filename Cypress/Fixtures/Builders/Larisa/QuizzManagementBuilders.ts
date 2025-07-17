import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";

export class QuizzManagementBuilders {
  static adminLogin = (login: QuizzManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.login,
      body: {
        email: login.email,
        password: login.password,
      },
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
      url: QuizzManagementEndPoints.publish(dataID),
      body: {
        dataID: dataID,
      },
    });
  };

  static archiveQuizz = (dataID: string) => {
    return cy.request({
      method: "PATCH",
      url: QuizzManagementEndPoints.archive(dataID),
      body: {
        dataID: dataID,
      },
    });
  };

  static deleteQuizz = (dataID: string) => {
    return cy.request({
      method: "DELETE",
      url: QuizzManagementEndPoints.delete(dataID),
      body: {
        dataID: dataID,
      },
    });
  };
}
