const root = "/api";

export class QuizzManagementEndPoints {
  static login = `${root}/login`;
  static quizz = (id?: string) => `${root}/quizzes${id ? `/${id}` : ""}`;
  static publish = (id: string) => `${root}/quizzes/${id}/publish`;
  static archive = (id: string) => `${root}/quizzes/${id}/archive`;
  static users = `${root}/users}`;
}
