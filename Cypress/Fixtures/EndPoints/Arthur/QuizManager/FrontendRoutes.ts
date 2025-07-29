export class FrontendRoutes {
  static Login = "/fe/login.html";

  static Manager = "/fe/manager.html";

  static User = "/fe/user.html";

  static QuizView = (quizId?: string, submissionId?: string): string => {
    const path = "/fe/quiz-view.html";
    const params = new URLSearchParams();

    if (quizId) params.append("quiz", quizId);
    if (submissionId) params.append("submission", submissionId);

    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  static ViewSubmissions = (quizId: string): string => `/fe/view-submissions.html?quiz=${quizId}`;
}
