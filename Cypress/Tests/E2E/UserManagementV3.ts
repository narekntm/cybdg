import {UserManagementGenerators} from "Generators/Arevik/UserManagementGenerators";
import { UserManagementPage } from "Pages/UserManagementPage";

describe("User Management", () => {
  const baseUrl = "http://localhost:3000";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  afterEach(() => {
    cy.request("POST", "/api/reset");
  });

  function loginAsAdmin() {
    const admin = UserManagementGenerators.validAdminCredentials();
    UserManagementPage.openAdminLoginModalButton().click();
    UserManagementPage.adminEmailInput().type(admin.email);
    UserManagementPage.adminPasswordInput().type(admin.password);
    cy.intercept("POST", "/api/login").as("login");
    UserManagementPage.adminLoginButton().click();
    cy.wait("@login").its("response.statusCode").should("eq", 200);
    UserManagementPage.adminStatusText().should("contain", " Logged In");
  }

  function openUserForm() {
    UserManagementPage.addNewUserButton().click();
    UserManagementPage.userFormModal().should("be.visible");
  }

  function fillUserForm(user: {
    name: string;
    role: string;
    age?: number;
    email: string;
    gender: string;
    subscriptions?: string[];
  }) {
    if (user.name) UserManagementPage.nameInput().clear().type(user.name);
    if (user.role) UserManagementPage.roleSelect().select(user.role);
    if (user.age) UserManagementPage.ageInput().clear().type(user.age.toString());
    if (user.email) UserManagementPage.emailInput().clear().type(user.email);
    if (user.gender) cy.get(`input[name="gender"][value="${user.gender}"]`).check();
    if (user.subscriptions) {
      user.subscriptions.forEach((sub) => {
        cy.get(`input[name="subscribe"][value="${sub}"]`).check();
      });
    }
  }

  function submitUserForm() {
    cy.intercept("POST", "/api/users").as("addUser");
    UserManagementPage.submitUserFormButton().click();
    cy.wait("@addUser").its("response.statusCode").should("eq", 201);
    UserManagementPage.userFormModal().should("not.be.visible");
  }

  it("Logs in as admin", () => {
    loginAsAdmin();
    UserManagementPage.logoutButton().should("be.visible");
  });

  it("Fails login with wrong credentials", () => {
    const wrongCreds = UserManagementGenerators.invalidAdminCredentials();
    UserManagementPage.openAdminLoginModalButton().click();
    UserManagementPage.adminEmailInput().type(wrongCreds.email);
    UserManagementPage.adminPasswordInput().type(wrongCreds.password);
    cy.intercept("POST", "/api/login").as("loginFail");
    UserManagementPage.adminLoginButton().click();
    cy.wait("@loginFail").its("response.statusCode").should("eq", 401);
    UserManagementPage.adminLoginStatus().should("be.visible");
  });

  it("Adds a new user with valid data", () => {
    loginAsAdmin();
    openUserForm();
    fillUserForm(UserManagementGenerators.validUserArevik());
    submitUserForm();
    cy.contains("td", "Arevik").should("exist");
  });

  it("Shows validation error on empty form", () => {
    loginAsAdmin();
    openUserForm();
    const emptyUser = UserManagementGenerators.emptyUserForm();
    fillUserForm(emptyUser);
    UserManagementPage.submitUserFormButton().click();
    UserManagementPage.formErrors().should("be.visible");
  });

  it("Paginates user table", () => {
    loginAsAdmin();
    for (let i = 1; i <= 12; i++) {
      openUserForm();
      fillUserForm(UserManagementGenerators.userForPagination(i));
      submitUserForm();
    }
    UserManagementPage.paginationNext().click();
    UserManagementPage.paginationInfo().should("contain", "Page 2");
    UserManagementPage.paginationPrev().click();
    UserManagementPage.paginationInfo().should("contain", "Page 1");
  });

  it("Opens user view page", () => {
    loginAsAdmin();
    const user = UserManagementGenerators.userEve();
    cy.contains("tr", user.name).within(() => {
      cy.get(".view-btn").click();
    });
    cy.url().should("include", "/users/");
    cy.contains("h1", "User Details").should("exist");
  });
});
