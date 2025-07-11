export class UserManagementPage {
  static adminEmailInput = () => cy.get("#admin-email");

  static adminPasswordInput = () => cy.get("#admin-password");

  static adminLoginButton = () => cy.get("#admin-login-form-modal button[type=submit]");

  static adminLoginModal = () => cy.get("#admin-login-modal");

  static adminLoginStatus = () => cy.get("#login-status");

  static closeAdminLoginModalButton = () => cy.get("#close-login-modal");

  static logoutButton = () => cy.get("#logout-btn");

  static adminStatusText = () => cy.get("#admin-status-text");

  static openAdminLoginModalButton = () => cy.get("#open-login-modal");

  static userFormModal = () => cy.get("#user-form-modal");

  static nameInput = () => cy.get("#name");

  static roleSelect = () => cy.get("#role");

  static ageInput = () => cy.get("#age");

  static emailInput = () => cy.get("#email");

  static genderMale = () => cy.get('input[name="gender"][value="Male"]');

  static genderFemale = () => cy.get('input[name="gender"][value="Female"]');

  static genderOther = () => cy.get('input[name="gender"][value="Other"]');

  static subscribeNewsletter = () => cy.get('input[name="subscribe"][value="Newsletter"]');

  static subscribeProductUpdates = () => cy.get('input[name="subscribe"][value="Product Updates"]');

  static submitUserFormButton = () => cy.get('#user-form button[type="submit"]');

  static closeUserFormModalButton = () => cy.get("#close-user-modal");

  static formErrors = () => cy.get("#form-errors");

  static formTitle = () => cy.get("#form-title");

  static labelName = () => cy.get('label[for="name"]');

  static labelRole = () => cy.get('label[for="role"]');

  static labelAge = () => cy.get('label[for="age"]');

  static labelEmail = () => cy.get('label[for="email"]');

  static userTable = () => cy.get("#user-table");

  static userTableRows = () => cy.get("#user-table tbody tr");

  static userTableLastRow = () => cy.get("#user-table tbody tr").last();

  static firstUserRow = () => this.userTableRows().first();

  static firstUserStatusCell = () => this.firstUserRow().find("td").eq(6);

  static firstUserDeleteButton = () => this.firstUserRow().find(".btn-danger.delete-btn");

  static firstUserStatusButton = () => this.firstUserRow().find(".btn-primary.status-btn");

  static addNewUserButton = () => cy.get("#open-user-modal");

  static searchInput = () => cy.get("#search-input");

  static deleteConfirmationModal = () => cy.get("#confirm-delete-modal");

  static confirmDeleteButton = () => cy.get("#confirm-delete");

  static cancelDeleteButton = () => cy.get("#cancel-delete");

  static resetConfirmationModal = () => cy.get("#confirm-reset-modal");

  static confirmResetButton = () => cy.get("#confirm-reset");

  static cancelResetButton = () => cy.get("#cancel-reset");

  static resetButton = () => cy.get("#reset-btn");

  static toastContainer = () => cy.get("#toast-container");

  static paginationNext = () => cy.get("#next-page");

  static paginationPrev = () => cy.get("#prev-page");

  static paginationInfo = () => cy.get("#page-info");

  static adminDeleteError = () => cy.get("#admin-delete-error");
}
