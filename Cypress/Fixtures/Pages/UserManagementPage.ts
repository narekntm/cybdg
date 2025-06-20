export class UserManagementPage {
  // Login as Admin label
  static loginAsAdminLabel = () => cy.get("section h2").eq(0);

  // Admin Email label
  static adminEmailLabel = () => cy.get('label[for="admin-email"]');

  // Admin Email input
  static adminEmailInput = () => cy.get("#admin-email");

  // Admin Password label
  static adminPasswordLabel = () => cy.get('label[for="admin-password"]');

  // Admin Password input
  static adminPasswordInput = () => cy.get("#admin-password");

  // Login button
  static loginButton = () => cy.get("#admin-login-form .btn-primary");

  // Logout button
  static logoutButton = () => cy.get("#logout-btn");

  // Login status
  static loginStatus = () => cy.get("#login-status");

  static addNewUserLabel = () => cy.get("#form-title");

  // Full Name label
  static fullNameLabel = () => cy.get('label[for="name"]');

  // Full Name input
  static fullNameInput = () => cy.get("#name");

  // Role label
  static roleLabel = () => cy.get('label[for="role"]');

  // Role input
  static roleInput = () => cy.get("#role");

  // Age label
  static ageLabel = () => cy.get('label[for="age"]');

  // Age input
  static ageInput = () => cy.get("#age");

  // Email label
  static emailLabel = () => cy.get('label[for="email"]');

  // Email input
  static emailInput = () => cy.get("#email");

  // Gender label
  static genderLabel = () => cy.get("#Gender");

  // Gender radio button
  static genderRadio = (gender: string) => cy.get(`input[name="gender"][value="${gender}"]`);

  // Subscribe to label
  static subscribeToLabel = () => cy.get("#Subscribe");

  // Subscribe to checkbox component
  static subscribeComponent = () => cy.get('input[name="subscribe"]');

  // Subscribe to checkbox
  static subscribeCheckbox = (subs: string) => cy.get(`input[name="subscribe"][value="${subs}"]`);

  // Save button
  static saveButton = () => cy.get("#user-form .btn-primary");

  static userTableLabel = () => cy.get("section h2").eq(1);

  // Error Message
  static adminDeleteErrorMessage = () => cy.get("#admin-delete-error");

  // Form Errors
  static formErrorsMessage = () => cy.get("#form-errors");

  // User Table
  static userTable = () => cy.get("#user-table");

  // Table Header Cells
  static tableHeaderCell = (index: number) => cy.get("#user-table thead th").eq(index);

  // Table Body Rows
  static tableRow = (index: number) => cy.get("#user-table tbody tr").eq(index);

  //Table Data
  static tableData = (index: number, cell: number) => cy.get("#user-table tbody tr").eq(index).find("td").eq(cell);

  //Table td
  static tableTd = (index: number) => cy.get('td').eq(index)

  // Delete, Edit, and Deactivate/Activate buttons
  static editButton = () => cy.get(".btn-secondary.edit-btn");

  static deleteButton = () => cy.get(".btn-danger.delete-btn");

  static statusButton = () => cy.get(".btn-primary.status-btn");

  // Modal for Delete Confirmation
  static confirmModal = () => cy.get("#confirm-modal");

  // Modal for Confirm Delete
  static confirmDeleteButton = () => cy.get("#confirm-delete");

  //Cancel Delete Button

  static cancelDeleteButton = () => cy.get("#cancel-delete");

  static modalContent = () => cy.get("#confirm-modal .modal-content");

  static modalMessage = () => cy.get("#confirm-modal .modal-content p");
  static adminLoginButton = () => cy.get('#admin-login-form button[type="submit"]');

  static nameInput = () => {
    return cy.get("#name");
  };
}
