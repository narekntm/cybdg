export enum Role {
  Admin = "admin",
  User = "user",
}

export enum AssignMode {
  All = "all",
  Custom = "custom",
}

export enum QuestionType {
  Input = "input",
  Radio = "radio",
  Checkbox = "checkbox",
  Dropdown = "dropdown",
}

export enum QuizStatus {
  Active = "active",
  Draft = "draft",
  Archived = "archived",
}

export interface Question {
  id: string,
  label: string,
  type: QuestionType,
  options?: string[],
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  assignTo: AssignMode;
  assignedUserIds?: string[];
  createdBy: string;
}

export enum QuizErrorMessages {
  QuizNotFound = "Quiz not found",
  QuizHasSubmissions = "Quiz has submissions",
  QuizNotEditable = "Quiz is not editable",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Submission {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string | string[]; };
  createdAt: string;
}

export enum SubmissionErrorMessages {
  AlreadySubmitted = "Already submitted",
  SubmissionNotFound = "Submission not found",
}

export enum AuthErrorMessages {
  InvalidCredentials = "Invalid credentials",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
}

