import { Chance } from "chance";
import {
  AssignedUsers,
  Country,
  Gender,
  Question,
  QuestionType,
  QuizRequest,
  Technology,
} from "Models/Arthur/QuizManager/QuizManagerModels";

const chance = new Chance();

export class QuizGenerator {
  static generateQuestion(type: QuestionType, index: number): Question {
    const id = `q${index}`;
    const label = `Question ${index + 1} (${type})`;

    const optionsMap: Record<QuestionType, string[]> = {
      [QuestionType.Input]: [],
      [QuestionType.SingleChoice]: Object.values(Gender),
      [QuestionType.MultipleChoice]: Object.values(Technology),
      [QuestionType.Dropdown]: Object.values(Country),
    };

    return {
      id,
      label,
      type,
      options: optionsMap[type],
    };
  }

  static generateQuizWithAllTypes(): QuizRequest {
    return {
      title: chance.sentence({ words: 3 }),
      description: chance.sentence({ words: 6 }),
      assignedUsers: [AssignedUsers.All],
      questions: [
        this.generateQuestion(QuestionType.Input, 0),
        this.generateQuestion(QuestionType.SingleChoice, 1),
        this.generateQuestion(QuestionType.MultipleChoice, 2),
        this.generateQuestion(QuestionType.Dropdown, 3),
      ],
    };
  }

  static generateQuizWithOnly(type: QuestionType): QuizRequest {
    return {
      title: `Only ${type} Quiz`,
      description: chance.sentence({ words: 6 }),
      assignedUsers: AssignedUsers.All,
      questions: [this.generateQuestion(type, 0)],
    };
  }
}
