import { QuizzManagementEndPoints } from "../../../Fixtures/EndPoints/Larisa/QuizzManagementEndPoints";
import { QuizzManagementModels } from "../../../Fixtures/Models/Larisa/QuizzManagementModels";
  
export class QuizzManagementBuilders {
  static resetData = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.reset,
    });
  };
}