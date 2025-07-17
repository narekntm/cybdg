const root = "http://127.0.0.1:5353/be/api";

export class QuizzManagementEndPoints {
  static login = `${root}/login`;
  static quizzes = `${root}/quizzes`;
  static quizz = (id?: string) => `${root}/quizzes${id ? `/${id}` : ""}`;
  static publish = (id: string) => `${root}/quizzes/${id}/publish`;
  static archive = (id: string) => `${root}/quizzes/${id}/archive`;
  static delete = (id: string) => `${root}/quizzes/${id}`;
  static users = `${root}/users`;
}
