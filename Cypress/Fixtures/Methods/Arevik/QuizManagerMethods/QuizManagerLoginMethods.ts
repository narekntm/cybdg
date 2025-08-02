import { QuizManagerLoginPage } from "Pages/Arevik/QuizManagerPages/QuizManagerLoginPage";

export class QuizManagerLoginMethods {
  static Auth = (data?: QuizManagerModels) => {
    if (data.login) {
      QuizManagerLoginPage.emailInput().type(data.login);
    }
    if (data.password) {
      QuizManagerLoginPage.passwordInput().type(data.password);
    }
    QuizManagerLoginPage.submitButton().click();
  };
}
