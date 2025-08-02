export enum Role {
  User = "user",
  Manager = "manager",
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
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
}

export interface LoginModel {
  login?: string;
  password?: string;
}

export interface QuizInfo {
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
  email: string;
  role: Role;
}

export interface Submission {
  id: string;
  quizId: string;
  userId: string;
  answers: { [questionId: string]: string | string[] };
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
export type QuizCreationData = Omit<QuizInfo, "id" | "createdBy" | "status">;

export interface UserBase {
  email: string;
  id: string;
  role: Role;
}
export interface User extends UserBase {
  password: string;
}
