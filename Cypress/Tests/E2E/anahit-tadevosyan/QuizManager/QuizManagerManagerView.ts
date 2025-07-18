import { QuizManagerEndpoints } from "EndPoints/anahit-tadevosyan/QuizManager/QuizManagerEndPoints";
import {QuizManagerLoginPage} from "Pages/anahit-tadevosyan/QuizManager/QuizManagerLoginPage";
import {QuizManagerManagerViewPage} from "Pages/anahit-tadevosyan/QuizManager/QuizManagerManagerViewPage";
import {QuizManagerGenerators} from "Generators/anahit-tadevosyan/QuizManager/QuizManagerGenerators";

describe("QuizManager Manager View", () => {
  const baseUrl = "/manager.html";
  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");

  const login = function (email: string, password: string) {
    QuizManagerLoginPage.emailInput().clear().type(email);
    QuizManagerLoginPage.passwordInput().clear().type(password);
    QuizManagerLoginPage.loginButton().click();
  };


 before('login', () => {
   cy.intercept({ method: "POST", url: QuizManagerEndpoints.login() }).as("postLogin");
   login(managerEmail, managerPassword);
   cy.wait("@postLogin").then((interception) => {
     expect(interception.response.statusCode).to.eq(200);
   });
 })
  describe("Add Questions", () => {
    QuizManagerManagerViewPage.quizToggle().click();
    QuizManagerManagerViewPage.quizTitleInput().type(QuizManagerGenerators.fakeQuiz.title)
    QuizManagerManagerViewPage.addQuestionButton().click()
    

  });
  describe("View Quizzes", () => {});
});
