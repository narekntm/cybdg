import { QuizManagerLoginModels } from "Models/David Models/QuizManagerModels/QuizManagerLoginModels";
import { LoginPage } from "Pages/David Pages/QuizManagerPages/QuizManagerLoginPage";
import LoginModel = QuizManagerLoginModels.LoginModel;

export class QuizManagerMethods {
  static Auth = (data?: LoginModel) => {
    if (data.login) {
      LoginPage.emailInput().type(data.login);
    }
    if (data.password) {
      LoginPage.passwordInput().type(data.password);
    }
    LoginPage.submitButton().click();
  };
}
