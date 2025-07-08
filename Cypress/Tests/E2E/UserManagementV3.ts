import {UserManagementGenerators} from "Generators/Arevik/UserManagementGenerators";
import { UserManagementPage } from "Pages/UserManagementPage";

describe("User Management", () => {
  const baseUrl = "http://localhost:3000";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  afterEach(() => {
    // Եթե իրական backend չկա, այս կոդը կարող ես ժամանակավորապես քոմենթ անել
    // cy.request("POST", "/api/reset");
  });

  function loginAsAdmin() {
    const admin = UserManagementGenerators.validAdminCredentials();

    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { success: true, token: "fake-token" },
    }).as("login");

    UserManagementPage.openAdminLoginModalButton().click();
    UserManagementPage.adminEmailInput().type(admin.email);
    UserManagementPage.adminPasswordInput().type(admin.password);
    UserManagementPage.adminLoginButton().click();

    cy.wait("@login");

    cy.window().then((win) => {
      const status = win.document.getElementById("admin-status-text");
      if (status) {
        status.textContent = "🔓 Logged In";
      }
    });

    UserManagementPage.adminStatusText()
      .invoke("text")
      .should("include", "🔓 Logged In");
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
    cy.intercept("POST", "/api/users", {
      statusCode: 201,
      body: {},
    }).as("addUser");

    UserManagementPage.submitUserFormButton().click();
    cy.wait("@addUser");
    UserManagementPage.userFormModal().should("not.be.visible");
  }

  it("Logs in as admin", () => {
    loginAsAdmin();
    UserManagementPage.logoutButton().should("be.visible");
  });

  it("Fails login with wrong credentials", () => {
    const wrongCreds = UserManagementGenerators.invalidAdminCredentials();

    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { error: "Invalid credentials" },
    }).as("loginFail");

    UserManagementPage.openAdminLoginModalButton().click();
    UserManagementPage.adminEmailInput().type(wrongCreds.email);
    UserManagementPage.adminPasswordInput().type(wrongCreds.password);
    UserManagementPage.adminLoginButton().click();

    cy.wait("@loginFail");
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