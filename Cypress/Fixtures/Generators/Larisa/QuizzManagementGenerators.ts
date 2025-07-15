import Chance from "chance";
import { QuizzManagementModels } from "../../../Fixtures/Models/Larisa/QuizzManagementModels";

export class QuizzManagementGenerators {
  static loginAdminPositiveCase(): QuizzManagementModels.Login {
    return {
      email: Cypress.env('ADMIN_EMAIL'),
      password: Cypress.env('ADMIN_PASSWORD'),
    };
  }

  static loginUser1PositiveCase(): QuizzManagementModels.Login {
    return {
      email: Cypress.env('USER1_EMAIL'),
      password: Cypress.env('USER1_PASSWORD'),
    };
  }  

  static loginUser2PositiveCase(): QuizzManagementModels.Login {
    return {
      email: Cypress.env('USER2_EMAIL'),
      password: Cypress.env('USER2_PASSWORD'),
    };
  }    

  static loginNegativeCase(): QuizzManagementModels.Login {
    return {
      email: "",
      password: "",
    };
  }

  static inputTypeQuestion(): QuizzManagementModels.Question {
    return {
        text: "Your name",
        type: QuizzManagementModels.QuestionType.Input,
        options: ""
    }
  }

  static radioTypeQuestion(): QuizzManagementModels.Question {
    return {
        text: "Your gender",
        type: QuizzManagementModels.QuestionType.Radio,
        options: "Male, Female, Other"
    }
  }
  
  static checkBoxTypeQuestion(): QuizzManagementModels.Question {
    return {
        text: "Your hobby",
        type: QuizzManagementModels.QuestionType.Checkbox,
        options: "Reading, Travelling"
    }
  }
  
  static dropDownTypeQuestion(): QuizzManagementModels.Question {
    return {
        text: "Your country",
        type: QuizzManagementModels.QuestionType.Dropdown,
        options: "USA, France, Armenia"
    }
  }

  static quizz(): QuizzManagementModels.Quizz {
    return {
        title: "Person",
        description: "Person details",
        question: [
          QuizzManagementGenerators.inputTypeQuestion(), 
          QuizzManagementGenerators.radioTypeQuestion(), 
          QuizzManagementGenerators.checkBoxTypeQuestion(),
          QuizzManagementGenerators.dropDownTypeQuestion()
        ]
    }
  }

}