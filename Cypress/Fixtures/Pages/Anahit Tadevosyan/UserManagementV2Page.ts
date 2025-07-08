import {userTableColumn} from "Models/Anahit Tadevosyan/UserManagementV2Model";

export class UserManagementPage {
  // Login as Admin label
  static loginAsAdminLabel = () => cy.get("section h2").eq(0);

  // Admin Email label
  static adminEmailLabel = () => cy.get('label[for="admin-email"]');

  //Login Pop up Open
  static loginPopUpOpen = () => cy.get("#open-login-modal");

  //Login Pop up close
  static loginPopUpClose = () => cy.get("#close-login-modal");

  // Admin Email input
  static adminEmailInput = () => cy.get("#admin-email");

  // Admin Password label
  static adminPasswordLabel = () => cy.get('label[for="admin-password"]');

  // Admin Password input
  static adminPasswordInput = () => cy.get("#admin-password");

  // Login button
  static loginButton = () => cy.get(".btn-primary.full-width");

  // Logout button
  static logoutButton = () => cy.get("#logout-btn");

  // Login status
  static loginStatus = () => cy.get("#login-status");

  static addNewUserLabel = () => cy.get("#form-title");
  // Add User Popup open
  static addUserPopupOpen = () => cy.get("#open-user-modal");
  // Add User Popup close

  static addUserPopupClose = () => cy.get("#close-user-modal");
  // Full Name label
  static fullNameLabel = () => cy.get('label[for="name"]');

  // Full Name input
  static fullNameInput = () => cy.get("#name");
  // Full Name view mode

  static fullNameViewMode = () => cy.get(".info-row label[for=name].value");
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

  //Gender dropdown

  static genderDropdown = (gender: string) => cy.get("#gender");
  // Gender radio button
  static genderRadio = (gender: string) => cy.get(`input[name="gender"][value="${gender}"]`);

  // Subscribe to label
  static subscribeToLabel = () => cy.get("#Subscribe");

  // Subscribe to checkbox component
  static subscribeComponent = () => cy.get('input[name="subscribe"]');

  // Subscribe to checkbox component
  static subscribeComponentFromPage = () => cy.get('input[name="subscriptions"]');

  // Subscribe to checkbox
  static subscribeCheckbox = (subs: string) => cy.get(`input[name="subscribe"][value="${subs}"]`);

  // Subscribe to checkbox
  static subscribeCheckboxFromPage = (subs: string) => cy.get(`input[name="subscriptions"][value="${subs}"]`);

  //Subscriptions options
  static subscriptionOption = (subscription: string) => cy.get(`.checkbox-item input[value="${subscription}"]`);
  //Statuc drop-down
  static statusDropDown = (status: string) => cy.get("#status");

  // Save button
  static saveButton = () => cy.get("#user-form .btn-primary");

  //Save button from user page
  static saveFromUser = () => cy.get("#save-btn");

  //Back buttom from user page
  static backButton = () => cy.get("#back-btn");

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
  static tableRow = (index?: number) => cy.get("#user-table tbody tr").eq(index);

  //Table Body Tr
  static tableTr = () => cy.get("#user-table tbody tr");

  //Table Data
  static tableData = (index: number, cell: number) => cy.get("#user-table tbody tr").eq(index).find("td").eq(cell);

  //Table data by id
  static tableDataByUserId = (userId: number, column: userTableColumn) =>
      cy.get(`#user-table tbody tr[data-id="${userId}"] td`).eq(column);

  //Table td
  static tableTd = (index: number) => cy.get("td").eq(index);

  // Delete, Edit, and Deactivate/Activate buttons
  static editButton = () => cy.get(".btn-secondary.edit-btn");

  static deleteButton = () => cy.get(".btn-danger.delete-btn");

  static statusButton = () => cy.get(".btn-primary.status-btn");

  // Modal for Delete Confirmation
  static confirmModal = () => cy.get("#confirm-delete-modal");

  // Modal for Confirm Delete
  static confirmDeleteButton = () => cy.get("#confirm-delete");

  //Cancel Delete Button

  static cancelDeleteButton = () => cy.get("#cancel-delete");

  static modalContent = () => cy.get("#confirm-delete-modal .modal-content");

  static modalMessage = () => cy.get("#confirm-delete-modal .modal-content p");

  static adminLoginButton = () => cy.get('#admin-login-form button[type="submit"]');

  static nameInput = () => {
    return cy.get("#name");
  };

  //Reset
  static resetButton = () => cy.get("#reset-btn");

  //Confirm Reset
  static confirmResetButton = () => cy.get("#confirm-reset");

  //Cancel Reset

  static cancelResetButton = () => cy.get("#cancel-reset");

  //Pagination

  static pageInfo = () => cy.get("#page-info");

  static prevPageButton = () => cy.get("#prev-page");

  static nextPageButton = () => cy.get("#next-page");

  //View User

  static viewButton = (id: number) => cy.get(`a[href="user_detail.html?id=${id}"]`);

  //Edit from USer Page

  static editUserButton = () => cy.get("#edit-btn");

  //Toast Containter
  static toastSuccess = () => cy.get(".toast.success");

  //Toast Error
  static toastError = () => cy.get(".toast.error");
}
