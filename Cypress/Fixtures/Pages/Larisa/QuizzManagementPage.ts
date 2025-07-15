export class QuizzManagementLoginPage {
  static title = () => cy.get(".login-container h1");
  static emailLbl = () => cy.get("#email").prev("label");
  static emailInput = () => cy.get("input#email");
  static passwordLbl = () => cy.get("#password").prev("label");
  static passwordInput = () => cy.get("#password");
  static submitBtn = () => cy.get('button[type="submit"]');
  static errorMessage = () => cy.get("#error-message");
}
