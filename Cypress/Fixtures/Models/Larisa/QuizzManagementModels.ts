export namespace QuizzManagementModels {
  export interface Login {
    email: string;
    password: string;
  }

  export enum QuestionType {
    Input = "input",
    Radio = "radio",
    Checkbox = "checkbox",
    Dropdown = "dropdown",
  }

  export interface Question {
    id: string;
    label: string;
    type: QuestionType;
    options: string[];
  }

  export interface ResponceQuestion {
    id: string;
    label: string;
    type: QuestionType;
    options: string[];
  }

  export interface Quizz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    assignedUsers: string[];
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

  export enum QuizzActions {
    Publish = "publish",
    Archive = "archive",
    Delete = "delete",
  }
}
