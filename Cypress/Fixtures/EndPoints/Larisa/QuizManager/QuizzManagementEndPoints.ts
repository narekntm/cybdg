import { QuizzManagementModels } from "Models/Larisa/QuizManager/QuizzManagementModels";

const root = `${Cypress.env("API_URL")}api`;

export class QuizzManagementEndPoints {
  static login = `${root}/login`;
  static logout = `${root}/logout`;
  static authMe = `${root}/auth/me`;
  static users = `${root}/users`;
  static postQuizzes = `${root}/quizzes`;
  static quizzAction = (id: string, action: QuizzManagementModels.QuizzActions) => `${root}/quizzes/${id}/${action}`;
  static deleteQuizz = (id: string) => `${root}/quizzes/${id}`;
  static quizzes = `${root}/quizzes`;
  static getQuizz = (id: string) => `${root}/quizzes/${id}`;
  static postSubmissions = (id: string) => `${root}/quizzes/${id}/submissions`;
  static putSubmissions = (id: string) => `${root}/submissions/${id}`;
  static getSubmissionsMe = `${root}/submissions/me`;
  static getSubmissions = (id: string) => `${root}/submissions/${id}`;
  static submissions = (id?: string) => `${root}/quizzes${id ? `/${id}` : ""}/submissions`;
  static testAuth = `${root}/test/auth`;
  static testUsers = `${root}/test/users`;

  static manager = "/fe/manager.html";
  static user = "/fe/user.html";
}
