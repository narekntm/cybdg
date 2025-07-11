import { UserManagementPage } from "Pages/UserManagementPage";

describe("User Management – Cypress Sandbox", () => {
  const baseUrl = "/";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  afterEach(() => {
    // reset the state after each test
    cy.request({
      method: "POST",
      url: "/api/reset",
    });
  });

  function loginAsAdmin(name: string = "admin@example.com", password: string = "admin123") {
    UserManagementPage.adminEmailInput().type(name);
    UserManagementPage.adminPasswordInput().type(password);
    UserManagementPage.adminLoginButton().click();
  }

  function fillUserForm(user: { name: string; role: string; age: number; email: string; gender: string; subscriptions?: string[] }) {
    if (user.name) UserManagementPage.nameInput().type(user.name);
    if (user.role) cy.get("#role").select(user.role);
    if (user.age) cy.get("#age").clear().type(user.age.toString());
    if (user.email) cy.get("#email").clear().type(user.email);
    if (user.gender) cy.get(`input[name="gender"][value="${user.gender}"]`).check();
    if (user.subscriptions) {
      user.subscriptions.forEach((sub) => {
        cy.get(`input[name="subscribe"][value="${sub}"]`).check();
      });
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
    cy.intercept("POST", "/api/users").as("submitUser");
    cy.get('#user-form button[type="submit"]').click();
    cy.wait("@submitUser").its("response.statusCode").should("eq", 201);
    cy.contains("td", name).should("exist");
  }

  describe("Admin Login", () => {
    it("Logs in with valid credentials", () => {
      cy.intercept("POST", "/api/login").as("loginRequest");
      loginAsAdmin();
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
      cy.get("#admin-controls").should("be.visible");
    });

    it("Fails with invalid credentials", () => {
      cy.intercept("POST", "/api/login").as("loginFail");
      cy.get("#admin-email").type("wrong@admin.com");
      cy.get("#admin-password").type("wrongpass");
      cy.get('#admin-login-form button[type="submit"]').click();
      cy.wait("@loginFail").its("response.statusCode").should("eq", 401);
      cy.get("#login-status").should("be.visible");
    });

    it("Logs out and hides admin controls", () => {
      loginAsAdmin();
      cy.get("#logout-btn").click();
      cy.get("#admin-controls").should("not.be.visible");
    });
  });

  describe("Add/Edit User Form", () => {
    it("Adds a valid user", () => {
      cy.intercept("POST", "/api/users").as("submitUser");
      fillUserForm({
        name: "John",
        role: "Editor",
        age: 30,
        email: "john@example.com",
        gender: "Male",
        subscriptions: ["Newsletter"],
      });
      cy.get('#user-form button[type="submit"]').click();
      cy.wait("@submitUser").its("response.statusCode").should("eq", 201);
      cy.contains("td", "John").should("exist");
    });

    it("Shows validation errors on empty form", () => {
      cy.get('#user-form button[type="submit"]').click();
      cy.get("#form-errors").should("be.visible");
    });

    it("Invalid name is rejected", () => {
      UserManagementPage.nameInput().type("1234!");
      cy.get('#user-form button[type="submit"]').click();
      cy.get("#form-errors").should("contain", "Name must be");
    });

    it("Invalid email is rejected", () => {
      fillUserForm({ name: "Jane", gender: "Female", role: "Viewer", age: 22, email: "invalid-email" });
      cy.get('#user-form button[type="submit"]').click();
      cy.get("#form-errors").should("contain", "Valid email");
    });

    it("Missing gender shows error", () => {
      fillUserForm({ name: "Jane", role: "Viewer", age: 22, email: "jane@example.com", gender: "" });
      cy.get('#user-form button[type="submit"]').click();
      cy.get("#form-errors").should("contain", "Gender selection");
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
      cy.get('#user-form button[type="submit"]').click();
      cy.contains("td", "Anna").should("exist");
    });

    it("Edit user and verify updated values", () => {
      addUserAndFindRow("EditableUser");
      cy.contains("tr", "EditableUser").within(() => {
        cy.get(".edit-btn").click();
      });

      UserManagementPage.nameInput().clear().type("EditedUser");
      cy.intercept("PUT", /\/api\/users\/.*/).as("updateUser");
      cy.get('#user-form button[type="submit"]').click();
      cy.wait("@updateUser").its("response.statusCode").should("eq", 200);
      cy.contains("td", "EditedUser").should("exist");
      cy.contains("td", "EditableUser").should("not.exist");
    });
  });

  describe("Delete & Edit Actions", () => {
    it("Delete modal flow works correctly", () => {
      addUserAndFindRow("TempUser");
      cy.contains("tr", "TempUser").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete-modal").should("be.visible");
      cy.get("#cancel-delete").click();
      cy.get("#confirm-delete-modal").should("not.be.visible");
    });

    it("Non-admin cannot delete Admin user", () => {
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#admin-delete-error").should("be.visible");
    });

    it("Admin can delete Admin user", () => {
      loginAsAdmin();
      cy.intercept("DELETE", /\/api\/users\/.*/).as("deleteUser");
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete").click();
      cy.wait("@deleteUser").its("response.statusCode").should("eq", 200);
      cy.contains("tr", "Alice").should("not.exist");
    });
  });

  describe("Status Toggle", () => {
    it("Toggles status between Active and Inactive", () => {
      cy.intercept("PATCH", /\/api\/users\/.+\/status/).as("toggleStatus");
      cy.contains("tr", "Eve").within(() => {
        cy.get("td").eq(6).should("contain", "Active");
        cy.get(".status-btn").click();
        cy.wait("@toggleStatus").its("response.statusCode").should("eq", 200);
        cy.contains("tr", "Eve").within(() => {
          cy.get("td").eq(6).should("contain", "Inactive");
        });
      });
    });
  });
});
