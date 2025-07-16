const root = Cypress.env("API_URL");

export class QuizManagerEndpoints {
  static login = `${root}/api/login`;

  static logout = `${root}/api/logout`;

  static authMe = `${root}/api/auth/me`;

  static users = `${root}/api/users`;

  static quizzes = `${root}/api/quizzes`;

  static quiz = (id: string) => `${root}/api/quizzes/${id}`;

  static quizPublish = (id: string) => `${root}/api/quizzes/${id}/publish`;

  static quizArchive = (id: string) => `${root}/api/quizzes/${id}/archive`;

  static submitToQuiz = (quizId: string) => `${root}/api/quizzes/${quizId}/submissions`;

  static quizSubmissions = (quizId: string) => `${root}/api/quizzes/${quizId}/submissions`;

  static mySubmissions = `${root}/api/submissions/me`;

  static submission = (submissionId: string) => `${root}/api/submissions/${submissionId}`;

  static testAuth = `${root}/api/test/auth`;

  static testUsers = `${root}/api/test/users`
}
