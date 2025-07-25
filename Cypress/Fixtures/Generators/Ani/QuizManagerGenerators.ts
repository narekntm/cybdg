import Chance from "chance";
import { QuestionType, QuizCreationData } from "Models/Ani/QuizManagerModels";

const chance = new Chance();
export class QuizManagerGenerators {
  static randomQuizInputType: QuizCreationData = {
    title: chance.sentence({ words: 3 }),
    description: chance.sentence({ words: 5 }),
    questions: [
      {
        id: "q1",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Input,
        options: [],
      },
    ],
    assignedUsers: ["all"],
  };
  static randomQuizDropdownType: QuizCreationData = {
    title: chance.sentence({ words: 3 }),
    description: chance.sentence({ words: 5 }),
    questions: [
      {
        id: "q1",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Dropdown,
        options: [],
      },
    ],
    assignedUsers: ["all"],
  };
  static randomQuizRadioType: QuizCreationData = {
    title: chance.sentence({ words: 3 }),
    description: chance.sentence({ words: 5 }),
    questions: [
      {
        id: "q1",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Radio,
        options: [],
      },
    ],
    assignedUsers: ["all"],
  };
  static randomQuizCheckboxType: QuizCreationData = {
    title: chance.sentence({ words: 3 }),
    description: chance.sentence({ words: 5 }),
    questions: [
      {
        id: "q1",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Checkbox,
        options: [],
      },
    ],
    assignedUsers: ["all"],
  };
}
