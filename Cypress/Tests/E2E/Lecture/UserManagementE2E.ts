import { UserManagementBuilders } from "Builders/Lecture/UserManagementBuilders";
import { UserManagementEndpoints } from "EndPoints/Lecture/UserManagementEndpoints";
import { UserManagementPage } from "Pages/Lecture/UserManagementPage";

describe("User Management – Cypress Sandbox", () => {
  const baseUrl = "/";

  beforeEach(() => {
    // Intercept all relevant API calls
    cy.intercept("POST", UserManagementEndpoints.reset).as("resetData");
    cy.intercept("GET", UserManagementEndpoints.users()).as("getUsers");
    cy.intercept("POST", UserManagementEndpoints.users()).as("createUser");
    cy.intercept("PUT", UserManagementEndpoints.users("*")).as("updateUser");
    cy.intercept("DELETE", UserManagementEndpoints.users("*")).as("deleteUser");
    cy.intercept("PATCH", UserManagementEndpoints.status("*")).as("toggleStatus");
    cy.intercept("POST", UserManagementEndpoints.adminLogin).as("adminLogin");

    // Reset backend state
    UserManagementBuilders.resetData().its("status").should("eq", 200);

    // Visit app and wait for initial load
    cy.visit(baseUrl);
    cy.wait("@getUsers");
  });

  afterEach(() => {
    // Clean up
    UserManagementBuilders.resetData().its("status").should("eq", 200);
  });

  function loginAsAdmin(name = "admin@example.com", password = "admin123") {
    UserManagementPage.adminEmailInput().type(name);
    UserManagementPage.adminPasswordInput().type(password);
    UserManagementPage.adminLoginButton().click();
    cy.wait("@adminLogin").its("response.statusCode").should("eq", 200);
  }

  function fillUserForm(user: { name: string; role: string; age: number; email: string; gender: string; subscriptions?: string[] }) {
    if (user.name) UserManagementPage.nameInput().clear().type(user.name);
    if (user.role) UserManagementPage.roleSelect().select(user.role);
    if (user.age) UserManagementPage.ageInput().clear().type(user.age.toString());
    if (user.email) UserManagementPage.emailInput().clear().type(user.email);
    if (user.gender) UserManagementPage.genderRadio(user.gender).check();
    if (user.subscriptions) {
      for (const sub of user.subscriptions) {
        UserManagementPage.subscriptionCheckbox(sub).check();
      }
    }
  }

  function addUserAndFindRow(name: string) {
    fillUserForm({
      name,
      role: "Viewer",
      age: 28,
      email: `${name.toLowerCase()}@example.com`,
      gender: "Other",
    });
    UserManagementPage.submitButton().click();
    cy.wait("@createUser");
    UserManagementPage.userCell(name).should("exist");
  }

  describe("🔐 Admin Login", () => {
    it("Logs in with valid credentials", () => {
      loginAsAdmin();
      UserManagementPage.adminControls().should("be.visible");
    });

    it("Fails with invalid credentials", () => {
      UserManagementPage.adminEmailInput().type("wrong@admin.com");
      UserManagementPage.adminPasswordInput().type("wrongpass");
      UserManagementPage.adminLoginButton().click();
      cy.wait("@adminLogin");
      UserManagementPage.loginStatus().should("be.visible");
    });

    it("Logs out and hides admin controls", () => {
      loginAsAdmin();
      UserManagementPage.logoutButton().click();
      UserManagementPage.adminControls().should("not.be.visible");
    });
  });

  describe("👤 Add/Edit User Form", () => {
    it("Adds a valid user", () => {
      addUserAndFindRow("John");
    });

    it("Shows validation errors on empty form", () => {
      UserManagementPage.submitButton().click();
      UserManagementPage.formErrors().should("be.visible");
    });

    it("Invalid name is rejected", () => {
      UserManagementPage.nameInput().type("1234!");
      UserManagementPage.submitButton().click();
      UserManagementPage.formErrors().should("contain", "Name must be");
    });

    it("Invalid email is rejected", () => {
      fillUserForm({ name: "Jane", gender: "Female", role: "Viewer", age: 22, email: "invalid-email" });
      UserManagementPage.submitButton().click();
      UserManagementPage.formErrors().should("contain", "Valid email");
    });

    it("Missing gender shows error", () => {
      fillUserForm({ name: "Jane", role: "Viewer", age: 22, email: "jane@example.com", gender: "" });
      UserManagementPage.submitButton().click();
      UserManagementPage.formErrors().should("contain", "Gender selection");
    });

    it("Allows adding user with no subscriptions", () => {
      fillUserForm({
        name: "Anna",
        role: "Viewer",
        age: 26,
        email: "anna@example.com",
        gender: "Female",
        subscriptions: [],
      });
      UserManagementPage.submitButton().click();
      cy.wait("@createUser");
      UserManagementPage.userCell("Anna").should("exist");
    });

    it("Edit user and verify updated values", () => {
      addUserAndFindRow("EditableUser");
      UserManagementPage.openEditForUser("EditableUser");
      UserManagementPage.nameInput().clear().type("EditedUser");
      UserManagementPage.submitButton().click();
      cy.wait("@updateUser");
      UserManagementPage.userCell("EditedUser").should("exist");
      UserManagementPage.userCell("EditableUser").should("not.exist");
    });
  });

  describe("🗑 Delete & Edit Actions", () => {
    it("Delete modal flow works correctly", () => {
      addUserAndFindRow("TempUser");
      UserManagementPage.openDeleteForUser("TempUser");
      UserManagementPage.confirmDeleteModal().should("be.visible");
      UserManagementPage.cancelDeleteButton().click();
      UserManagementPage.confirmDeleteModal().should("not.be.visible");
    });

    it("Non-admin cannot delete Admin user", () => {
      UserManagementPage.openDeleteForUser("Alice");
      cy.get("#admin-delete-error").should("be.visible");
    });

    it("Admin can delete Admin user", () => {
      loginAsAdmin();
      UserManagementPage.openDeleteForUser("Alice");
      UserManagementPage.confirmDeleteButton().click();
      cy.wait("@deleteUser");
      UserManagementPage.userCell("Alice").should("not.exist");
    });
  });

  describe("🔁 Status Toggle", () => {
    it("Toggles status between Active and Inactive", () => {
      UserManagementPage.userStatusCell("Eve").should("contain", "Active");
      UserManagementPage.toggleStatusForUser("Eve");
      cy.wait("@toggleStatus");
      UserManagementPage.userStatusCell("Eve").should("contain", "Inactive");
    });
  });
});
