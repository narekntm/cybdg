export class UserManagementPage {
  static adminEmailInput = () => cy.get("#admin-email");

  static adminPasswordInput = () => cy.get("#admin-password");

  static adminLoginButton = () => cy.get('#admin-login-form button[type="submit"]');

  static nameInput = () => {
    return cy.get("#name"); 
  };
}
