export class LoginPage {
  static getEmailInput = () => cy.get("#email");

  static getPasswordInput = () => cy.get("#password");

  static getSubmitButton = () => cy.get('#login-form button[type="submit"]');

  static getLoginError = () => cy.get("#error-message");

  static loginFormHeader = () => cy.get('[class="login-container"] h1');

  static visit(): void {
    cy.visit("/login.html");
  }

  static fillEmail(email: string): void {
    this.getEmailInput().clear().type(email);
  }

  static fillPassword(password: string): void {
    this.getPasswordInput().clear().type(password);
  }

  static submit(): void {
    this.getSubmitButton().click();
  }

  static url = "/login.html";
}
