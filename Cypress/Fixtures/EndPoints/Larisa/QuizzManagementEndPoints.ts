const root = "/api";

export class QuizzManagementEndPoints {
  static reset = `${root}/reset`;
  static login = `${root}/login`;
  static quizz = (id?: number) => `${root}/quizzes${id ? `/${id}` : ""}`;
  static publish = (id: number) => `${root}/quizzes/${id}/publish}`;
  static archive = (id: number) => `${root}/quizzes/${id}/archive}`;
  static users = `${root}/users}`;
}
