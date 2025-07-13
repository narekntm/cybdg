export class UserManagementPage {

  static firstSection = () => cy.get("section").eq(0);
  static secondSection = () => cy.get("section").eq(1);
  static thirdSection = () => cy.get("section").eq(3);
  static loginPopUpButton = () => cy.get("#open-login-modal")
  static adminEmailInput = () => cy.get("#admin-email");
  static adminPasswordInput = () => cy.get("#admin-password");
  static adminSubmitButton = () => cy.get("[class*='btn-primary']").first();
  static adminSubmitButtonV2 = () => cy.get('#admin-login-form-modal button[type="submit"]')
  static successSignInMessage = () => cy.contains("#admin-controls", "You are logged in as admin.");
  static logoutButton = () => cy.get("[class*='btn-secondary']").first().should("contain.text", "Logout");
  static logoutButtonV2 = () => cy.get("#logout-btn")
  static AboutSiteButton = () => cy.get("[class*='btn-secondary']").first().should("contain.text", "About Site");
  static popUpConfirmDeleteButton = () => cy.get("#confirm-delete");
  static userTableRows = () => cy.get("tbody tr");
  static invalidCredentials = () => cy.contains("#login-status", "Invalid credentials");
  static userTable = () => cy.get("#user-table");
  static userTableBody = () => cy.get("#user-table tbody");
  static editButtonInTable = () => cy.get(".btn-secondary.edit-btn");
  static firstEditButtonInTable = () => cy.get(".btn-secondary.edit-btn").eq(0);
  static secondEditButtonInTable = () => cy.get(".btn-secondary.edit-btn").eq(1);
  static thirdEditButtonInTable = () => cy.get(".btn-secondary.edit-btn").eq(2);
  static fourthEditButtonInTable = () => cy.get(".btn-secondary.edit-btn").eq(3);
  static showButtonInTable = (index: number) => cy.get("[class*=\"btn-neutral\"]").eq(index)
  static userViewCard = () => cy.get("#user-card")
  static userViewCardInfo =  () => cy.get("#user-form")
  static userCardName = () => cy.get("[for=\"name\"]")
  static userCardRole =  () => cy.get("[for=\"role\"]")
  static userCardAge = () => cy.get("[for=\"age\"]")
  static userCardEmail = () => cy.get("[for=\"email\"]")
  static userCardGender = () => cy.get("[for=\"gender\"]")
  static userCardSubscriptions = () => cy.get("[for=\"subscriptions\"]")
  static userCardStatus = () => cy.get("[for=\"status\"]")
  static userCardEditButton = () => cy.get("#edit-btn")
  static userCardBackButton = () => cy.get("#back-btn")
  static userCardNameInput = () => cy.get("input[type=\"text\"][id=\"name\"]")
  static userCardRoleSelect = () => cy.get("select[id=\"role\"]")
  static userCardAgeInput = () => cy.get("input[type=\"number\"][id=\"age\"]")
  static userCardEmailInput = () => cy.get("input[type=\"text\"][id=\"email\"]")
  static userCardGenderSelect = () => cy.get("select[id=\"gender\"][name=\"gender\"]")
  static userCardNewsletterCheckbox = () => cy.get("input[type=\"checkbox\"][value=\"Newsletter\"]")
  static userCardProductUpdatesCheckbox = () => cy.get("input[type=\"checkbox\"][value=\"Product Updates\"]")
  static userCardStatusSelect = () => cy.get("select[id=\"status\"][name=\"status\"]")
  static userCardSaveButton = () => cy.get("#save-btn")
  static userCardCancelButton = () => cy.get("#cancel-btn")
  static prevPageButton = () => cy.get("#prev-page")
  static nextPageButton = () => cy.get("#next-page")
  static paginationInfo = () => cy.get("#page-info")
  static firstRowInUserTable = () => cy.get("tbody tr").eq(0);
  static secondRowInUserTable = () => cy.get("tbody tr").eq(1);
  static thirdRowInUserTable = () => cy.get("tbody tr").eq(2);
  static fourthRowInUserTable = () => cy.get("tbody tr").eq(3);
  static deleteButtonInTable = () => cy.get(".btn-danger.delete-btn");
  static userTableFirstDeleteButton = () => cy.get(".btn-danger.delete-btn").eq(0);
  static userTableSecondDeleteButton = () => cy.get(".btn-danger.delete-btn").eq(1);
  static userTableThirdDeleteButton = () => cy.get(".btn-danger.delete-btn").eq(2);
  static userTableFourthDeleteButton = () => cy.get(".btn-danger.delete-btn").eq(3);
  static userTableStatusChangeButton = () => cy.get("td button.btn-primary");
  static userTableFirstStatusChangeButton = () => cy.get("td button.btn-primary").eq(0);
  static userTableSecondStatusChangeButton = () => cy.get("td button.btn-primary").eq(1);
  static userTableThirdStatusChangeButton = () => cy.get("td button.btn-primary").eq(2);
  static userTableFourthStatusChangeButton = () => cy.get("td button.btn-primary").eq(3);
  static newUserButtonPopUpOpen = () => cy.get("#open-user-modal")
  static nameField = () => cy.get("#name");
  static roleField = () => cy.get("#role");
  static roleOptionAdmin = () => cy.get('option[value="Admin"]');
  static roleOptionAdminV2 = () => cy.get('#role option').eq(1)
  static roleOptionEditor = () => cy.get('option[value="Editor"]');
  static roleOptionEditorV2 = () => cy.get('#role option').eq(2)
  static roleOptionViewer = () => cy.get('option[value="Viewer"]');
  static roleOptionViewerV2 = () => cy.get('#role option').eq(3)
  static ageField = () => cy.get("#age");
  static emailField = () => cy.get("#email");
  static genderMaleRadioButton = () => cy.get('input[value="Male"]');
  static genderFemaleRadioButton = () => cy.get('input[value="Female"]');
  static genderOtherRadioButton = () => cy.get('input[value="Other"]');
  static newsletterCheckbox = () => cy.get('input[value="Newsletter"]');
  static productUpdatesCheckbox = () => cy.get('input[value="Product Updates"]');
  static addNewUserSaveButton = () => cy.get('#user-form button[type="submit"]');
  static nameDataUserTable = () => cy.get("td").eq(0);
  static roleDataUserTable = () => cy.get("td").eq(1);
  static ageDataUserTable = () => cy.get("td").eq(2);
  static emailDataUserTable = () => cy.get("td").eq(3);
  static genderDataUserTable = () => cy.get("td").eq(4);
  static subscriptionDataUserTable = () => cy.get("td").eq(5);
  static statusDataUserTable = () => cy.get("td").eq(6);
  static adminDeleteError = () => cy.get("div#admin-delete-error");
  static nameFieldError = () => cy.contains("ul li", "Name must be 1–20 letters only (no spaces or symbols).");
  static roleFieldError = () => cy.contains("ul li", "Role is required.");
  static ageFieldError = () => cy.contains("ul li", "Age must be between 1 and 99.");
  static emailFieldError = () => cy.contains("ul li", "Valid email is required.");
  static genderFieldError = () => cy.contains("ul li", "Gender selection is required.");
  static successPopUp = () => cy.get('.toast')
  static resetButton = () => cy.get('#reset-btn')
  static confirmResetButton = () => cy.get('#confirm-reset')
}
