const root = "/be/api";

export class QuizManagerEndpoints {
  static login = (): string => `${root}/login`;

  static logout = (): string => `${root}/logout`;

  static me = (): string => `${root}/auth/me`;

  static users = (): string => `${root}/users`;

  static quizzes = (quizId?: string): string => `${root}/quizzes${quizId ? `/${quizId}` : ""}`;

  static publishQuiz = (quizId: string): string => `${this.quizzes(quizId)}/publish`;

  static archiveQuiz = (quizId: string): string => `${this.quizzes(quizId)}/archive`;

  static submissionsMe = (): string => `${root}/submissions/me`;

  static submissionById = (submissionId: string): string => `${root}/submissions/${submissionId}`;

  static quizSubmissions = (quizId: string): string => `${this.quizzes(quizId)}/submissions`;
}
