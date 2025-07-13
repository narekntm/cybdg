export namespace QuizManagerLoginModels {

  export interface LoginModel {
    login ?: string,
    password ?: string
  }

  export enum errorMessages {
    invalidCreds = "Invalid credentials"
  }
}

