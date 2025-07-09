export class UserManagementPage {
  static adminEmailInput = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#admin-email");
  static adminPasswordInput = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#admin-password");
  static adminLoginButton = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#admin-login-form button[type="submit]');

  static adminError = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#login-status");

  static userFormTitle = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#form-title");
  static userFullName = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="name"]');
  static userRole = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('select[id="role"]').select("Admin");
  static userAge = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="age"]');
  static userEmail = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[id="email"]');

  static userErorrs = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#form-errors ul li");

  static userLabelFullname = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="name"]');
  static userLabelRole = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="role"]');
  static userLabelAge = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="age"]');
  static userLabelEmail = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('label[for="email"]');

  static userInputNewsletter = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Newsletter"]');

  static userGenderMale = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Male"]');
  static userGendeFemale = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Female"]');
  static userGenderOther = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('input[value="Other"]');

  static userButtonSave = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('form[id="user-form"] button[type="submit"]');

  static userButtonLogout = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#logout-btn");

  static userTableRow = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#user-table tbody tr");
  static userTableDelete = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get("#user-table tbody tr").first().find("td").find(".btn-danger.delete-btn");
  static userTableEdit = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn");
  static userTableDeactivate = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn");

  static userDeleteError = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#admin-delete-error");

  static userTableActivate = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn").should("have.text", "Activate").click();

  static userTableModal = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get(".modal-content");
  static userTableConfirm = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#confirm-delete");

  static userModalCancel = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get("#cancel-delete");

  static paginationInfo = () => cy.get("#page-info");
  static prevPage = () => cy.get("#prev-page");
  static nextPage = () => cy.get("#next-page");
}
