export class LoginPage {
  static getEmailInput = () => cy.get("#email");

  static getPasswordInput = () => cy.get("#password");

  static getSubmitButton = () => cy.get('#login-form button[type="submit"]');

  static getLoginError = () => cy.get(".toast.error");

  static loginFormHeader = () => cy.get('[class="login-container"] h1');
}
