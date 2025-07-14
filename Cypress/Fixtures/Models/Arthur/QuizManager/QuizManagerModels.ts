export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum Technology {
  JavaScript = "JavaScript",
  Python = "Python",
  GO = "Go",
}

export enum Country {
  Armenia = "Armenia",
  USA = "USA",
  Germany = "Germany",
}

export interface QuizFormData {
  name: string;
  gender: Gender;
  technologies: Technology[];
  country: Country;
}

export enum QuestionType {
  Input = "input",
  SingleChoice = "radio",
  MultipleChoice = "checkbox",
  Dropdown = "dropdown",
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options: string[];
}

export interface QuizRequest {
  title: string;
  description: string;
  assignedUsers: "all" | string[];
  questions: Question[];
}

export interface QuizResponse extends QuizRequest {
  id: string;
  createdBy: string;
  status: QuizStatus;
}

export enum QuizStatus {
  Draft = "draft",
  Active = "active",
  Archived = "archived",
}

export interface AdminQuiz {
  title: string;
  description: string;
  questions: Question[];
  assignToUsers: string[];
  assignMode: "all" | "specific";
}

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface UserCredentials {
  id: string;
  email: string;
  password: string;
  role?: UserRole;
}

export enum UserFields {
  Id = "id",
  Email = "email",
  Role = "role",
}

export enum QuizFields {
  Id = "id",
  Title = "title",
  Description = "description",
  AssignedUsers = "assignedUsers",
  Questions = "questions",
  CreatedBy = "createdBy",
  Status = "status",
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
