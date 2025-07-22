export class QuizManagerLoginPage {
  static emailInput = () => cy.get("#email");

  static toastError = () => cy.get(".toast.error");

  static passwordInput = () => cy.get("#password");

  static loginBtn = () => cy.get("#login-form button[type='submit']");
}
