const root = "/api"

export class QuizzManagerEndpoints {

  static adminLogin = `${root}/login`;

  static adminLogout = `${root}/logout`;

  static quizzes = (id?:string) => `${root}/quizzes${id ? `/${id}` : ""}`;

  static status =  (id: string) => (`${this.quizzes(id)}/status`)

  static submissions = (id:string) => (`${this.quizzes(id)}/submissions`)
}