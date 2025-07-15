import { QuizzManagerEndpoints } from "EndPoints/Anna/QuizzManagerEndpoints/QuizzManagerEndpoints";
import { QuizzManagerModels } from "Models/Anna/QuizzManagerModels/QuizzManagerModels";


export class QuizzManagerBuildersBuilders {
  static AdminLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.adminLogin,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  };

  static logout (){
    return cy.request({
      method: "POST",
      url: QuizzManagerEndpoints.adminLogout,
    })
  }

  static deleteQuizz(id: number, isAdmin: boolean = false) {
    cy.log(`Deleting user #${id}`);
    return cy.request({
      method: "DELETE",
      url: QuizzManagerEndpoints.quizzes(),
      body: { isAdmin },

    });
  }


  static toggleStatus(id: string, status: QuizzManagerModels.Status) {
    cy.log(`Toggling status of user #${id} to ${status}`);
    return cy.request<{ status: QuizzManagerModels.Status }>({
      method: "PATCH",
     url: QuizzManagerEndpoints.status(id),
      body: { status },
    });
  }
  static getQuizzes() {
    cy.log("Fetching quizzes");
    return cy.request("GET", QuizzManagerEndpoints.quizzes());
  }


  // static NewQuizz = (quizz: {
  //   quizzTitle: string,
  //   quizzDescription: string,
  //   AddQuestionFields: AddQuestionFields}) => {
  //   return cy.request({
  //     method: "POST",
  //
  //     body: quizz,
  //     failOnStatusCode: false,
  //   });
  // };



}
