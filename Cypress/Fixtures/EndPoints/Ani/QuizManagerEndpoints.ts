export class QuizManagerEndpoints {
  static Auth = "/be/api/test/auth";
  static Users = "/be/api/test/users";
  static publishQuiz = (id: string) => `/be/api/quizzes/${id}/publish`;
  static quizzes = () => "/be/api/quizzes";
  static login = () => "/be/api/login";
}
