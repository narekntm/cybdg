export class QuizManagerLoginPage {
  static emailInput = () => cy.get("#email");

  static passwordInput = () => cy.get("#password");

  static submitButton = () => cy.get("#login-form button");

  static errorMessage = () => cy.get("#error-message");

  static loginContainer = () => cy.get(".login-container");

  static emailLabel = () => cy.get("label").contains("Email");

  static passwordLabel = () => cy.get("label").contains("Password");

  static loginHeader = () => cy.get("h1").contains("Login to Quiz Manager");
}
