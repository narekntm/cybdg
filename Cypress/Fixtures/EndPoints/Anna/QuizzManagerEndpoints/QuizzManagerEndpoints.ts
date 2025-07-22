const root = "be/api"

export class QuizzManagerEndpoints {

  static adminLogin = `${root}/login`;

  static adminLogout = `${root}/logout`;

  static quizzes = (quizid?:string):string => `${root}/quizzes${quizid ? `/${quizid}` : ""}`;

  static users = (): string => `${root}/users`;

  static manager=():string => `${root}/auth/me`;

  static publishQuiz = (quizId: string): string => `${this.quizzes(quizId)}/publish`;

  static archiveQuiz = (quizId: string): string => `${this.quizzes(quizId)}/archive`;

  static deleteQuiz =  (quizid: string) => (`${this.quizzes(quizid)}`);

  static submissions = (quizid:string) => (`${this.quizzes(quizid)}/submissions`);

  static submissionById = (submissionId: string): string => `${root}/submissions/${submissionId}`;

}