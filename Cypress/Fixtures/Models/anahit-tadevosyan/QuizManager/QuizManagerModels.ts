export enum Role {
  Manager = "manager",
  User = "user",
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options: string[];
}

export interface Users {
  id: string;
  email: string;
  role: Role;
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

export interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  assignedUsers: AssignedUsers;
  status: QuizStatus;
}

export type QuizCreationData = Omit<QuizData, "id" | "createdBy" | "status">;

export enum QuizSuccessMessages {
  QuizSaved = "Quiz saved successfully!",
  QuizPublished = "Quiz published",
}

export enum ValidationErrorMessages {
  TitleRequired = "Quiz title cannot be empty.",
  DescriptionRequired = "Quiz description cannot be empty.",
  AtLeastOneQuestion = "At least one question is required.",
  AtLeastOneOption = "must have at least one option",
  CustomAssignmentMissingUsers = "Please select at least one user.",
  MustHaveALabel = "Question 1 must have a label.",
}

export type AssignedUsers = "all" | string[];

export interface Answers {
  [questionId: string]: string | string[];
}
export interface Submission {
  id: string;
  quizId: string;
  userId: string;
  answers: Answers;
  createdAt: string;
}

export interface UserBase {
  email: string;
  id: string;
  role: Role;
}

export interface User extends UserBase {
  password: string;
}
