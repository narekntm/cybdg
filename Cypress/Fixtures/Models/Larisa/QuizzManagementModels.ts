export namespace QuizzManagementModels {
    export interface Login {
        email: string;
        password: string;
    }

    export enum QuestionType {
        Input = "Input",
        Radio = "Radio",
        Checkbox = "Checkbox",
        Dropdown = "Dropdown"
    }

    export interface Question {
        text: string,
        type: QuestionType,
        options: string
    }

    export interface Quizz {
        title: string,
        description: string,
        question: Question[]
    }
}