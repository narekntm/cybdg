import { QuizzManagerModels } from "Models/Anna/QuizzManagerModels/QuizzManagerModels";

export class QuizzManagerGenerators {
  static inputTypeQuestion: QuizzManagerModels.Question = {
    text: "Your name",
    type: QuizzManagerModels.QuestionType.Input,
    options: [""],
  };

  static radioTypeQuestion: QuizzManagerModels.Question = {
    text: "Your gender",
    type: QuizzManagerModels.QuestionType.Radio,
    options: ["Male, Female, Other"],
  };

  static checkBoxTypeQuestion: QuizzManagerModels.Question = {
    text: "Your hobby",
    type: QuizzManagerModels.QuestionType.Checkbox,
    options: ["Reading, Travelling"],
  };

  static dropDownTypeQuestion: QuizzManagerModels.Question = {
    text: "Your country",
    type: QuizzManagerModels.QuestionType.Dropdown,
    options: ["USA, France, Armenia"],
  };

  static quizz: QuizzManagerModels.Quizz = {
    title: "Person yyy",
    description: "Person yyy details",
    question: [
      QuizzManagerGenerators.inputTypeQuestion,
      QuizzManagerGenerators.radioTypeQuestion,
      QuizzManagerGenerators.checkBoxTypeQuestion,
      QuizzManagerGenerators.dropDownTypeQuestion,
    ],
  };
}