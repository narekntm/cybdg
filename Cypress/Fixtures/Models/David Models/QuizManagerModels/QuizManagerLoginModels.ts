export namespace QuizManagerLoginModels {
  export interface LoginModel {
    login?: string;
    password?: string;
  }

  export enum ErrorMessages {
    invalidCreds = "Invalid credentials",
  }
}
