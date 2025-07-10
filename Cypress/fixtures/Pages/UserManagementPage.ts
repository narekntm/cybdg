import { Gender } from "Models/UserManagementModels";

export class UserManagementPage {
  static adminEmailInput = () => cy.get('input[id="admin-email"]');

  static adminPasswordInput = () => cy.get('input[id="admin-password"]');

  static adminLoginBtn = () => cy.get('form[id="admin-login-form"] button[type="submit"]');

  static adminLogoutBtn = () => cy.get("#logout-btn");

  static adminLoginStatusMsg = () => cy.get("#login-status");

  static adminControlsPanel = () => cy.get("#admin-controls");

  static loginAsAdminTitle = () => cy.get("#admin-controls").prev();

  static adminEmailLabel = () => cy.get('label[for="admin-email"]');

  static adminPasswordLabel = () => cy.get('label[for="admin-password"]');

  static userFullNameInput = () => cy.get('input[id="name"]');

  static userRoleDropdown = () => cy.get('select[id="role"]');

  static userAgeInput = () => cy.get('input[id="age"]');

  static userEmailInput = () => cy.get('input[id="email"]');

  static userGenderLabel = (gender: Gender) => cy.get(`input[value=${gender}]`).parent();

  static userGenderBtn = (gender: Gender) => cy.get(`input[value=${gender}]`);

  static userGenderFemaleBtn = () => cy.get('input[value="Female"');

  static userGenderFemaleLabel = () => cy.get('input[value="Female"]').parent();

  static userGenderOtherBtn = () => cy.get('input[value="Other"]');

  static userGenderOtherLabel = () => cy.get('input[value="Other"]').parent();

  static userSaveBtn = () => cy.get('form[id="user-form"] button[type="submit"]');

  static userTableData = () => cy.get("#user-table tbody tr");

  static userTableFirstUserActiveRow = () => cy.get("#user-table tbody tr").first().find("td").eq(6);

  static userTableFirstUserRole = () => cy.get("#user-table tbody tr").first().find("td").eq(1);

  static userTableFirstUserAge = () => cy.get("#user-table tbody tr").first().find("td").eq(2);

  static userTableFirstUserEmail = () => cy.get("#user-table tbody tr").first().find("td").eq(3);

  static userTableFirstUserGender = () => cy.get("#user-table tbody tr").first().find("td").eq(4);

  static userTableFirstUserName = () => cy.get("#user-table tbody tr").first().find("td").eq(0);

  static userTableSecondUserActiveRow = () => cy.get("#user-table tbody tr").eq(1).find("td").eq(6);

  static userTableFirstUsersDeleteBtn = () => cy.get("#user-table tbody tr").first().find("td").find(".btn-danger.delete-btn");

  static userTableFirstUserEditBtn = () => cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn");

  static userTableFirstUserStatusBtn = () => cy.get("#user-table tbody tr").first().find("td").find(".btn-primary.status-btn");

  static userTableSecondUserStatusBtn = () => cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn");

  static userTableLastUserName = () => cy.get("#user-table tbody tr").last().find("td").eq(0);

  static userTable = () => cy.get("#user-table");

  static userTableTitle = () => cy.get("#admin-delete-error").prev();

  static userValidationErrors = () => cy.get("#form-errors ul li");

  static userFormTitle = () => cy.get("#form-title");

  static userNameLabel = () => cy.get('label[for="name"]');

  static userRoleLabel = () => cy.get('label[for="role"]');

  static userAgeLabel = () => cy.get('label[for="age"]');

  static userEmailLabel = () => cy.get('label[for="email"]');

  static userGenderTitle = () => cy.get('input[value="Male"]').parents("label").parent().siblings("label");

  static userGenderMaleBtn = () => cy.get('input[value="Male"]');

  static userGenderMaleLabel = () => cy.get('input[value="Male"]').parent();

  static userNewsletterLabel = () => cy.get('input[value="Newsletter"]').parent();

  static userNewsletterCheckbox = () => cy.get('input[value="Newsletter"]');

  static userProductUpdatesLabel = () => cy.get('input[value="Product Updates"]').parent();

  static userProductUpdatesCheckbox = () => cy.get('input[value="Product Updates"]');

  static userDeleteValidationError = () => cy.get("#admin-delete-error");

  static userDeleteConfirmationModal = () => cy.get(".modal-content");

  static userDeleteConfirmBtn = () => cy.get("#confirm-delete");

  static userDeleteCancelBtn = () => cy.get("#cancel-delete");

  static userSubscriptionLabel = () => cy.get('input[value="Newsletter"]').parents("label").parent().siblings("label");
}
