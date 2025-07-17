export class QuizzLoginPage {
  static title = () => cy.get(".login-container h1");
  static emailLbl = () => cy.get('label[for="email"]');
  static emailInput = () => cy.get("input#email");
  static passwordLbl = () => cy.get('label[for="password"]');
  static passwordInput = () => cy.get("#password");
  static submitBtn = () => cy.get('button[type="submit"]');
  static toast = () => cy.get(".toast");
}
