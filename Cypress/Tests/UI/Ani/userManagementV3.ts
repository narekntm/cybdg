import {
  AddNewUserModal,
  AdminLoginModal,
  AdminLoginStatus,
  ButtonTexts,
  Gender,
  LabelTexts,
  PageFooter,
  PageHeaders,
  UserTable,
} from "Models/UserManagementModels";
import { UserManagementPageV3 } from "Pages/UserManagementPageV3";

describe("User Management – Cypress Sandbox - V3", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  function adminLogin(email: string, password: string) {
    UserManagementPageV3.loginBtn().click();
    UserManagementPageV3.adminEmailInput().type(email);
    UserManagementPageV3.adminPasswordInput().type(password);
    UserManagementPageV3.loginSubmitBtn().click();
  }
  it("1. Check the UI of the page's header(logged out)", () => {
    UserManagementPageV3.headerTitle().should("be.visible").should("contain.text", PageHeaders.headerTitle);
    UserManagementPageV3.aboutSiteBtn().should("be.visible").should("contain.text", PageHeaders.aboutSiteBtnText);
    UserManagementPageV3.adminStatusText().should("contain.text", AdminLoginStatus.notLoggedInTitle);
    UserManagementPageV3.loginBtn().should("be.visible").should("contain.text", ButtonTexts.login);
  });
  it("2. Check the UI of the page's header(logged in as Admin)", () => {
    adminLogin("admin@example.com", "admin123");
    UserManagementPageV3.headerTitle().should("be.visible").should("contain.text", PageHeaders.headerTitle);
    UserManagementPageV3.aboutSiteBtn().should("be.visible").should("contain.text", PageHeaders.aboutSiteBtnText);
    UserManagementPageV3.adminStatusText().should("contain.text", AdminLoginStatus.successTitle);
    UserManagementPageV3.logoutBtn().should("be.visible").should("contain.text", ButtonTexts.logout);
  });
  it("3. Check the UI of the User Table", () => {
    UserManagementPageV3.userTableTitle().should("be.visible").should("contain.text", UserTable.userTableTitle);
    UserManagementPageV3.searchInput().should("be.visible");
    UserManagementPageV3.addNewUserBtn().should("be.visible").should("contain.text", ButtonTexts.addNewUser);
    UserManagementPageV3.userTableList().should("be.visible").should("have.length", 3);
    UserManagementPageV3.paginationPrevBtn().should("be.visible").and("be.disabled");
    UserManagementPageV3.paginationNextBtn().should("be.visible").and("be.disabled");
  });
  it("4. Check the UI of the page's footer", () => {
    UserManagementPageV3.resetDataBtn().should("be.visible").should("contain.text", ButtonTexts.resetData);
    UserManagementPageV3.footerTitle().should("be.visible").should("contain.text", PageFooter.footerText);
  });
  it("5. Check that the 'Admin Login' modal is properly opened", () => {
    UserManagementPageV3.loginBtn().click();
    UserManagementPageV3.adminLoginModal().should("be.visible");
  });
  it("6. Check the UI of the 'Admin Login' modal", () => {
    UserManagementPageV3.loginBtn().click();
    UserManagementPageV3.adminLoginModalTitle().should("have.text", AdminLoginModal.modalTitle);
    UserManagementPageV3.adminEmailLabel().should("be.visible").should("have.text", LabelTexts.adminEmailLabel);
    UserManagementPageV3.adminEmailInput().should("be.visible");
    UserManagementPageV3.adminPasswordLabel().should("be.visible").should("contain.text", LabelTexts.adminPasswordLabel);
    UserManagementPageV3.adminEmailInput().should("be.visible");
    UserManagementPageV3.loginSubmitBtn().should("be.visible").should("contain.text", ButtonTexts.login);
    UserManagementPageV3.closeLoginModalBtn().should("be.visible").and("have.text", ButtonTexts.cancel);
  });
  it("7. Check that the 'Add New User' modal is properly opened", () => {
    UserManagementPageV3.addNewUserBtn().click();
    UserManagementPageV3.userTableBody().should("be.visible");
  });
  it("8. Check the UI of the 'Add New User' modal", () => {
    UserManagementPageV3.addNewUserBtn().click();
    UserManagementPageV3.formTitle().should("be.visible").should("have.text", AddNewUserModal.modalTitle);
    UserManagementPageV3.fullNameLabel().should("be.visible").should("have.text", LabelTexts.fullNameLabel);
    UserManagementPageV3.fullNameInput().should("be.visible");
    UserManagementPageV3.roleLabel().should("be.visible").and("have.text", LabelTexts.role);
    UserManagementPageV3.roleSelect().should("be.visible");
    UserManagementPageV3.ageLabel().should("be.visible").and("have.text", LabelTexts.age);
    UserManagementPageV3.ageInput().should("be.visible");
    UserManagementPageV3.emailLabel().should("be.visible").and("have.text", LabelTexts.adminEmailLabel);
    UserManagementPageV3.emailInput().should("be.visible");
    UserManagementPageV3.genderLabel().should("be.visible").should("have.text", LabelTexts.gender);
    UserManagementPageV3.maleLabel().should("be.visible").should("contain.text", Gender.male);
    UserManagementPageV3.maleInput().should("be.visible");
    UserManagementPageV3.femaleLabel().should("be.visible").should("contain.text", Gender.female);
    UserManagementPageV3.fullNameInput().should("be.visible");
    UserManagementPageV3.otherLabel().should("be.visible").should("contain.text", Gender.other);
    UserManagementPageV3.otherInput().should("be.visible");
    UserManagementPageV3.subscribeToLabel().should("be.visible").and("contain.text", LabelTexts.subscription);
    UserManagementPageV3.newsletterInput().should("be.visible");
    UserManagementPageV3.productUpdateInput().should("be.visible");
    UserManagementPageV3.saveBtn().should("be.visible");
    UserManagementPageV3.cancelUserModalBtn().should("be.visible");
  });
});
