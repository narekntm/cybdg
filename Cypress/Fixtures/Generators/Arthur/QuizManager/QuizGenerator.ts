import { Chance } from "chance";
import {
  Answer,
  AssignedUsers,
  Country,
  Gender,
  Question,
  QuestionType,
  QuizRequest,
  QuizResponse,
  QuizStatus,
  Submission,
  SubmissionAnswerText,
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

  static generateMockQuizWithAllTypesAndId(id: string, status: QuizStatus): QuizResponse {
    return {
      id,
      status,
      title: `Mock All Types Quiz ${id}`,
      description: `Description for quiz ${id}`,
      createdBy: "mockManager",
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
      title: `Quiz ${Date.now()}`,
      description: `Test quiz for ${type} input.`,
      assignedUsers: [AssignedUsers.All],
      questions: [this.generateQuestion(type, 0)],
    };
  }

  static generateMockQuizList(count: number): QuizResponse[] {
    return Array.from({ length: count }, (unused, index): QuizResponse => {
      const question = this.generateQuestion(QuestionType.Input, index);

      return {
        id: `mock-quiz-${index + 1}`,
        title: `Mock Quiz ${Date.now()} - ${index + 1}`,
        description: `Mock description ${index + 1}`,
        status: QuizStatus.Active,
        createdBy: "mockManager",
        assignedUsers: [AssignedUsers.All],
        questions: [question],
      };
    });
  }

  static generateMockQuizWithId(id: string, status: QuizStatus): QuizResponse {
    const question = this.generateQuestion(QuestionType.Input, 0);

    return {
      id,
      title: `Mock Quiz ${id}`,
      description: `Mock description for ${id}`,
      status,
      createdBy: "mockManager",
      assignedUsers: [AssignedUsers.All],
      questions: [question],
    };
  }

  static generateMockSubmission(quiz: QuizResponse, userId: string, idSuffix = "001", createdAt = new Date()): Submission {
    const answer: Answer = {
      questionId: quiz.questions[0].id,
      answer: SubmissionAnswerText.Answer1,
    };

    return {
      id: `submission-${idSuffix}`,
      quizId: quiz.id,
      userId,
      answers: [answer],
      createdAt: createdAt.toISOString(),
    };
  }

  static generateMockSubmissionList(quizzes: QuizResponse[], userId: string): Submission[] {
    return quizzes.map((quiz, index): Submission => {
      const answer: Answer = {
        questionId: quiz.questions[0].id,
        answer: SubmissionAnswerText.Answer1,
      };

      return {
        id: `submission-${index + 1}`,
        quizId: quiz.id,
        userId,
        answers: [answer],
        createdAt: new Date(Date.now() - index * 100000).toISOString(),
      };
    });
  }
}
