export enum Role {
    Admin = "admin",
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
    createdBy: string,
    assignedUsers: AssignedUsers;
    status: QuizStatus
}

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