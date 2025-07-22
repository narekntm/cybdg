export namespace QuizzManagerModels {
  export interface Login {
    email: string;
    password: string;
  }

  export enum Role {
    Manager = "manager",
    User = "user",
  }

  export enum QuestionType {
    Input = "Input",
    Radio = "Radio",
    Checkbox = "Checkbox",
    Dropdown = "Dropdown",
  }

  export interface Question {
    label: string;
    type: QuestionType;
    options: string;
    questionText: string ;
  }

  export interface Users {
    id: string;
    email: string;
    role: Role;
  }


  export enum QuizStatus {
    Active = "Active",
    Archived = "Archived",
    Draft = "Draft",
  }

  export interface Quizz {
    title: string;
    description: string;
    question: Question[];
  }

  export interface QuizCreation {
    title: string;
    description: string;
    question: string;
    type: OptionType;
    option:string;
    assignTo: AssignTo;
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

  export type QuizCreationData = Omit < QuizData, "id" | "createdBy" | "status" >;


  export type AssignedUsers = "all" | string[];

  export interface Submission {
    id: string;
    quizId: string;
    userId: string;
    answers: {
      [questionId: string]: string | string[];
    };
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

  }