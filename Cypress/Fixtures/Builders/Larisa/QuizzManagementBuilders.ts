import { QuizzManagementEndPoints } from "EndPoints/Larisa/QuizzManagementEndPoints";

export class QuizzManagementBuilders {
  static resetData = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.reset,
    });
  };
}
