import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";

export class QuizzManagementGenerators {
  static loginAdminPositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("ADMIN_EMAIL"),
    password: Cypress.env("ADMIN_PASSWORD")
  };

  static loginUser1PositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("USER1_EMAIL"),
    password: Cypress.env("USER1_PASSWORD")
  };

  static loginUser2PositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("USER2_EMAIL"),
    password: Cypress.env("USER2_PASSWORD")
  }

  static loginNegativeCase: QuizzManagementModels.Login = {
    email: "",
    password: "",
  };

  static inputTypeQuestion: QuizzManagementModels.Question = {
    text: "Your name",
    type: QuizzManagementModels.QuestionType.Input,
    options: "",
  };

  static radioTypeQuestion: QuizzManagementModels.Question = {
    text: "Your gender",
    type: QuizzManagementModels.QuestionType.Radio,
    options: "Male, Female, Other",
  };

  static checkBoxTypeQuestion: QuizzManagementModels.Question = {
    text: "Your hobby",
    type: QuizzManagementModels.QuestionType.Checkbox,
    options: "Reading, Travelling",
  };

  static dropDownTypeQuestion: QuizzManagementModels.Question = {
    text: "Your country",
    type: QuizzManagementModels.QuestionType.Dropdown,
    options: "USA, France, Armenia",
  };

  static quizz: QuizzManagementModels.Quizz = {
    title: "Person",
    description: "Person details",
    question: [
      QuizzManagementGenerators.inputTypeQuestion,
      QuizzManagementGenerators.radioTypeQuestion,
      QuizzManagementGenerators.checkBoxTypeQuestion,
      QuizzManagementGenerators.dropDownTypeQuestion,
    ],
  };
}