import { Gender } from "../Models/UserManagementModels";

export class UserManagementPageV3 {

  static aboutSiteBtn = () => cy.get("a[href='./about.html'] .btn-secondary")

  static loginBtn = () => cy.get("#open-login-modal")

  static headerTitle = () => cy.get(".topbar h1")

  static logoutBtn = () => cy.get("#logout-btn")

  static adminStatusText = () => cy.get("#admin-status-text")

  static userTableTitle = () => cy.get(".card h2")

  static footerTitle = () => cy.get("#reset-btn").next()

  static adminLoginModalTitle = () => cy.get("#admin-login-modal h2")

  static userFormModal = () => cy.get("#user-form-modal")

  static formTitle = () => cy.get("#form-title")

  static fullNameInput = () => cy.get("input[id='name']")

  static fullNameLabel = () => cy.get("label[for='name']")

  static roleSelect = () => cy.get("select[id='role']")

  static roleLabel = () => cy.get("label[for='role']")

  static ageInput = () => cy.get("input[id='age']")

  static ageLabel = () => cy.get("label[for='age']")

  static emailInput = () => cy.get("input[id='email']")

  static emailLabel = () => cy.get("label[for='email']")

  static userGenderBtn = (gender: Gender) => cy.get(`input[value=${gender}]`);

  static genderLabel = () => cy.get('#user-form').contains('label', 'Gender')

  static maleLabel = () => cy.get('#user-form').contains('label', 'Male')

  static maleInput = () => cy.get("input[value='Male']")

  static femaleInput = () => cy.get("input[value='Female']")

  static otherInput = () => cy.get("input[value='Other']")

  static femaleLabel = () => cy.get('#user-form').contains('label', 'Female')

  static otherLabel = () => cy.get('#user-form').contains('label', 'Other')

  static subscribeToLabel = () => cy.get('#user-form').contains('label', 'Subscribe to')

  static newsletterInput = () => cy.get("input[value='Newsletter']")

  static productUpdateInput = () => cy.get("input[value='Product Updates']")

  static saveBtn = () => cy.get("form#user-form button[type='submit']")

  static cancelUserModalBtn = () => cy.get("#close-user-modal")

  static formErrors = () => cy.get("#form-errors")

  static searchInput = () => cy.get("#search-input")

  static addNewUserBtn = () => cy.get("#open-user-modal")

  static userTableList = () => cy.get("#user-table tbody tr")

  static userTable = () => cy.get("#user-table")

  static userTableBody = () => cy.get("#user-table tbody")

  static paginationPrevBtn = () => cy.get("#prev-page")

  static paginationNextBtn = () => cy.get("#next-page")

  static pageInfo = () => cy.get("#page-info")

  static confirmDeleteModal = () => cy.get("#confirm-delete-modal")

  static confirmDeleteBtn = () => cy.get("#confirm-delete")

  static cancelDeleteBtn = () => cy.get("#cancel-delete")

  static confirmResetModal = () => cy.get("#confirm-reset-modal")

  static confirmResetBtn = () => cy.get("#confirm-reset")

  static cancelResetBtn = () => cy.get("#cancel-reset")

  static adminLoginModal = () => cy.get("#admin-login-modal")

  static adminEmailInput = () => cy.get("input[id='admin-email']")

  static adminEmailLabel = () => cy.get("label[for='admin-email']")

  static adminPasswordInput = () => cy.get("input[id='admin-password']")

  static adminPasswordLabel = () => cy.get("label[for='admin-password']")

  static adminLoginForm = () => cy.get("#admin-login-form-modal")

  static loginSubmitBtn = () => cy.get("#admin-login-form-modal button[type='submit']")

  static loginStatusText = () => cy.get("#login-status")

  static closeLoginModalBtn = () => cy.get("#close-login-modal")

  static resetDataBtn = () => cy.get("#reset-btn")

  static toastContainer = () => cy.get("#toast-container")
}
