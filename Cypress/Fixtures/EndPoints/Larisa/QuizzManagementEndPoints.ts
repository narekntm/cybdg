const root = "http://127.0.0.1:5353/be/api";

export class QuizzManagementEndPoints {
  static login = `${root}/login`;
  static logout = `${root}/logout`;
  static authMe = `${root}/auth/me`;
  static users = `${root}/users`;
  static postQuizzes = `${root}/quizzes`;
  static publishQuizz = (id: string) => `${root}/quizzes/${id}/publish`;
  static archiveQuizz = (id: string) => `${root}/quizzes/${id}/archive`;
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
}
