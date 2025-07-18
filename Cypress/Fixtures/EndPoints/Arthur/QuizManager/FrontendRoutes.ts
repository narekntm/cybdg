export const frontendRoutes = {
  Login: "/fe/login.html",
  Manager: "/fe/manager.html",
  User: "/fe/user.html",
  QuizView: (quizId?: string, submissionId?: string) => {
    const path = "/fe/quiz-view.html";
    const params = new URLSearchParams();
    if (quizId) params.append("quiz", quizId);
    if (submissionId) params.append("submission", submissionId);
    return `${path}?${params.toString()}`;
  },
  ViewSubmissions: (quizId: string) => `/view-submissions.html?quiz=${quizId}`,
};
