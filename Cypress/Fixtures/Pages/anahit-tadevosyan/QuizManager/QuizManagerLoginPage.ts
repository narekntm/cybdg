export class QuizManagerLoginPage {
  static emailInput = () => cy.get("#email");

  static passwordInput = () => cy.get("#password");

  static loginButton = () => cy.get('button[type = "submit"');

  static toastContainer = () => cy.get("#toast-container");
}
