import Chance from "chance";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";

const chance = new Chance();

const generateQuestion = () => ({
  text: chance.sentence({ words: 5 }),
  options: Array.from({ length: 4 }, () => chance.word()),
});

export class QuizzManagementGenerators {
  static user(role: UserManagementModels.UserRole): UserManagementModels.User {
    return {
      id: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      role: role,
    };
  }

  static inputTypeQuestion: QuizzManagementModels.Question = {
    text: chance.name(),
    type: QuizzManagementModels.QuestionType.Input,
    options: "",
  };

  static radioTypeQuestion: QuizzManagementModels.Question = {
    text: generateQuestion().text,
    type: QuizzManagementModels.QuestionType.Radio,
    options: generateQuestion().options.join(", "),
  };

  static checkBoxTypeQuestion: QuizzManagementModels.Question = {
    text: generateQuestion().text,
    type: QuizzManagementModels.QuestionType.Checkbox,
    options: generateQuestion().options.join(", "),
  };

  static dropDownTypeQuestion: QuizzManagementModels.Question = {
    text: generateQuestion().text,
    type: QuizzManagementModels.QuestionType.Dropdown,
    options: generateQuestion().options.join(", "),
  };

  static quizz: QuizzManagementModels.Quizz = {
    id: chance.guid(),
    title: chance.name(),
    description: chance.sentence(),
    question: [
      QuizzManagementGenerators.inputTypeQuestion,
      QuizzManagementGenerators.radioTypeQuestion,
      QuizzManagementGenerators.checkBoxTypeQuestion,
      QuizzManagementGenerators.dropDownTypeQuestion,
    ],
  };

  static generateAnswers(quizz: QuizzManagementModels.Quizz): { [key: string]: string } {
    const answers: { [key: string]: string } = {};

    quizz.question.forEach((question, index) => {
      const key = `q${index}`;
      if (question.type === QuizzManagementModels.QuestionType.Input) {
        answers[key] = chance.name();
      } else {
        const radioOptions = question.options?.split(",").map((o) => o.trim()) || [];
        answers[key] = chance.pickone(radioOptions);
      }
    });
    return answers;
  }
}
