import Chance from "chance";
import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/QuizManager/UserManagementModels";

const chance = new Chance();

const generateQuestion = () => ({
  text: chance.sentence({ words: 5 }),
  options: Array.from({ length: 2 }, () => chance.word()),
});

export class QuizzManagementGenerators {
  static questionIndex: number = 0;

  static getQuestionId(): string {
    return `q${this.questionIndex++}`;
  }

  static user(role: UserManagementModels.UserRole): UserManagementModels.User {
    return {
      id: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 10 }),
      role: role,
    };
  }

  static inputTypeQuestion = (): QuizzManagementModels.Question => {
    return {
      id: this.getQuestionId(),
      label: chance.name(),
      type: QuizzManagementModels.QuestionType.Input,
      options: [],
    };
  };

  static radioTypeQuestion = (): QuizzManagementModels.Question => {
    return {
      id: this.getQuestionId(),
      label: generateQuestion().text,
      type: QuizzManagementModels.QuestionType.Radio,
      options: generateQuestion().options,
    };
  };

  static checkBoxTypeQuestion = (): QuizzManagementModels.Question => {
    return {
      id: this.getQuestionId(),
      label: generateQuestion().text,
      type: QuizzManagementModels.QuestionType.Checkbox,
      options: generateQuestion().options,
    };
  };

  static dropDownTypeQuestion = (): QuizzManagementModels.Question => {
    return {
      id: this.getQuestionId(),
      label: generateQuestion().text,
      type: QuizzManagementModels.QuestionType.Dropdown,
      options: generateQuestion().options,
    };
  };

  static quizz: QuizzManagementModels.Quizz = {
    id: chance.guid(),
    title: chance.name(),
    description: chance.sentence(),
    questions: [
      QuizzManagementGenerators.inputTypeQuestion(),
      QuizzManagementGenerators.radioTypeQuestion(),
      QuizzManagementGenerators.checkBoxTypeQuestion(),
      QuizzManagementGenerators.dropDownTypeQuestion(),
    ],
    assignedUsers: ["all"],
  };

  static generateAnswers(quizz: QuizzManagementModels.Quizz): { [key: string]: string } {
    const answers: { [key: string]: string } = {};

    quizz.questions.forEach((question, index) => {
      const key = `q${index}`;
      if (question.type === QuizzManagementModels.QuestionType.Input) {
        answers[key] = chance.name();
      } else {
        answers[key] = chance.pickone(question.options);
      }
    });
    return answers;
  }
}
