export class UserManagementPage {
  // Admin controls
  static adminEmailInput = () => cy.get("#admin-email");
  static adminPasswordInput = () => cy.get("#admin-password");
  static adminLoginButton = () => cy.get('#admin-login-form button[type="submit"]');
  static logoutButton = () => cy.get("#logout-btn");
  static adminControls = () => cy.get("#admin-controls");
  static loginStatus = () => cy.get("#login-status");

  // User form inputs
  static nameInput = () => cy.get("#name");
  static roleSelect = () => cy.get("#role");
  static ageInput = () => cy.get("#age");
  static emailInput = () => cy.get("#email");
  static genderRadio = (gender: string) => cy.get(`input[name="gender"][value="${gender}"]`);
  static subscriptionCheckbox = (sub: string) => cy.get(`input[name="subscribe"][value="${sub}"]`);
  static submitButton = () => cy.get('#user-form button[type="submit"]');
  static formErrors = () => cy.get("#form-errors");

  // Table and row actions
  static userCell = (name: string) => cy.contains("td", name);
  static userRow = (name: string) => cy.contains("tr", name);
  static openEditForUser = (name: string) => UserManagementPage.userRow(name).find(".edit-btn").click();
  static openDeleteForUser = (name: string) => UserManagementPage.userRow(name).find(".delete-btn").click();
  static toggleStatusForUser = (name: string) => UserManagementPage.userRow(name).find(".status-btn").click();
  static userStatusCell = (name: string) => UserManagementPage.userRow(name).find("td").eq(6);

  // Delete modal
  static confirmDeleteModal = () => cy.get("#confirm-delete-modal");
  static cancelDeleteButton = () => cy.get("#cancel-delete");
  static confirmDeleteButton = () => cy.get("#confirm-delete");
}
