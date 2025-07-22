export namespace QuizzManagementModels {
  export interface Login {
    email: string;
    password: string;
  }

  export enum QuestionType {
    Input = "Input",
    Radio = "Radio",
    Checkbox = "Checkbox",
    Dropdown = "Dropdown",
  }

  export interface Question {
    text: string;
    type: QuestionType;
    options: string;
  }

  export interface Quizz {
    id: string;
    title: string;
    description: string;
    question: Question[];
  }

  export enum Role {
    Admin = "Admin",
    User = "User",
  }

  export interface Answer {
    questionId: string;
    answer: string | string[];
  }
  export interface Submission {
    id: string;
    quizId: string;
    userId: string;
    answers: Answer[];
    createdAt: string;
  }
}
