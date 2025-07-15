import { QuizzManagementModels } from "../../../Fixtures/Models/Larisa/QuizzManagementModels";
import { QuizzManagementEndPoints } from "../../../Fixtures/EndPoints/Larisa/QuizzManagementEndPoints";
  
export class QuizzManagementBuilders {
  static resetData = () => {
    return cy.request({
      method: "POST",
      url: QuizzManagementEndPoints.reset,
    });
  };
}