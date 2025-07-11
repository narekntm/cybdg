const root = Cypress.env('API_URL');

export class QuizManagerEndpoints {
    static login = `${root}/login`;

    static logout = `${root}/logout`;

    static authMe = `${root}/auth/me`;

    static users = `${root}/users`;

    static quizzes = `${root}/quizzes`;

    static quiz = (id: string) => `${root}/quizzes/${id}`;

    static quizPublish = (id: string) => `${root}/quizzes/${id}/publish`;

    static quizArchive = (id: string) => `${root}/quizzes/${id}/archive`;

    static submitToQuiz = (quizId: string) => `${root}/quizzes/${quizId}/submissions`;

    static quizSubmissions = (quizId: string) => `${root}/quizzes/${quizId}/submissions`;

    static mySubmissions = `${root}/submissions/me`;

    static submission = (submissionId: string) => `${root}/submissions/${submissionId}`;
}
