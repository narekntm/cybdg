export class QuizzManagerLoginPage {
  static loginHeader = () => cy.get("h1").contains("Login to Quiz Manager");

  static loginContainer = () => cy.get(".login-container");

  static emailInput = () => cy.get(" #email");

  static passwordInput =() => cy.get("#password");

  static emailLabel = () => cy.get("label").contains("Email");

  static passwordLabel = () => cy.get("label").contains("Password");

  static submitButton =() => cy.get("#login-form button");

  static logoutButton =() => cy.get("#logout-btn");

  static errorMessage =() => cy.get("#error-message")
}

