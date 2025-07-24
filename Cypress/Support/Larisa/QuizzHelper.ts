import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";
import { QuizzLoginPage } from "Pages/Larisa/QuizzLoginPage";
import { QuizzManagerPage } from "Pages/Larisa/QuizzManagerPage";

export const baseURL = "/login";

export const manager = QuizzManagementGenerators.user(UserManagementModels.UserRole.Manager);
export const user = QuizzManagementGenerators.user(UserManagementModels.UserRole.User);

export const adminLogin: UserManagementModels.Login = {
  email: manager.email,
  password: manager.password,
};

export const userLogin: UserManagementModels.Login = {
  email: user.email,
  password: user.password,
};

export function createUsers() {
  QuizzManagementBuilders.auth().then((responce) => {
    cy.setCookie("authToken", responce.body.token);
  });

  QuizzManagementBuilders.postUser(manager);
  QuizzManagementBuilders.postUser(user);
}

export function login(login: Partial<UserManagementModels.Login>) {
  if (login.email) QuizzLoginPage.emailInput().clear().type(login.email);
  if (login.password) QuizzLoginPage.passwordInput().clear().type(login.password);
  QuizzLoginPage.submitBtn().click();
}

export function addQuizz(quizz: Partial<QuizzManagementModels.Quizz>) {
  QuizzManagerPage.toggleHeader().click();
  if (quizz.title) QuizzManagerPage.quizzTitleInput().clear().type(quizz.title);
  if (quizz.description) QuizzManagerPage.quizzDescTextArea().clear().type(quizz.description);

  quizz.questions.forEach((question, index) => {
    QuizzManagerPage.addQuestionBtn().click();
    if (question.label) QuizzManagerPage.questionText(index).clear().type(question.label);
    if (question.type) QuizzManagerPage.questionSelect(index).select(question.type);
    if (question.options?.length) {
      question.options.forEach((option) => {
        QuizzManagerPage.questionOptions(index).clear().type(`${option}{enter}`);
      });
    }
  });

  QuizzManagementBuilders.getUsers().then(() => {
    QuizzManagerPage.assignModeSelect().select("Selected Users");
    QuizzManagerPage.userCheckBoxesItems().filter(`[value="${user.email}"]`).check();
  });
}
