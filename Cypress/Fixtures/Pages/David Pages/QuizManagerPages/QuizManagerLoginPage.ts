export class LoginPage {
  static loginContainer = () => cy.get(".login-container");

  static loginContainerHeader = () => cy.get(".login-container > h1");

  static emailInput = () => cy.get("#email");

  static passwordInput = () => cy.get("#password");

  static submitButton = () => cy.get("button[type=submit]");

  static errorsField = () => cy.get("#error-message");
}
