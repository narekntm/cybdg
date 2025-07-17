import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";

export class QuizzManagementGenerators {
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
    title: "Person yyy",
    description: "Person yyy details",
    question: [
      QuizzManagementGenerators.inputTypeQuestion,
      QuizzManagementGenerators.radioTypeQuestion,
      QuizzManagementGenerators.checkBoxTypeQuestion,
      QuizzManagementGenerators.dropDownTypeQuestion,
    ],
  };
}
