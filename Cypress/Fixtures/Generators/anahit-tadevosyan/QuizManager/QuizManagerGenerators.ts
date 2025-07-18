import Chance from "chance";
import { QuestionType, QuizCreationData } from "Models/anahit-tadevosyan/QuizManager/QuizManagerModels";

const chance = new Chance();

export class QuizManagerGenerators {
  static fakeQuiz: QuizCreationData = {
    title: chance.sentence({ words: 3 }),
    description: chance.sentence({ words: 5 }),
    questions: [
      {
        id: "q0",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Input,
        options: [],
      },
      {
        id: "q1",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Radio,
        options: [chance.word(), chance.word()],
      },
      {
        id: "q2",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Checkbox,
        options: chance.unique(chance.word, 4),
      },
      {
        id: "q3",
        label: chance.sentence({ words: 4 }),
        type: QuestionType.Dropdown,
        options: chance.unique(chance.word, 7),
      },
    ],
    assignedUsers: "all",
  };
}
