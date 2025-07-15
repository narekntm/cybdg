const root = "/api";

export class QuizManagementEndpoints {
  static Quiz = `${root}/quizzes`;

  static Publish = (id: string) => `${this.Quiz}/${id}/publish`;

  static Archive = (id: string) => `${this.Quiz}/${id}/archive`;

  static Delete = (id: string) => `${this.Quiz}/${id}`;

  static GetById = (id: string) => `${this.Quiz}/${id}`;

  static GetSubmissions = (id: string) => `${this.Quiz}/${id}/submissions`;
}
