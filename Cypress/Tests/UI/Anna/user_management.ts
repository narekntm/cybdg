import { UserManagementEndpoints } from "EndPoints/Anna/UserManagementEndpoints";
import { UserManagementPage } from "Pages/UserManagementPage";
//import { intersection } from "lodash";

describe("User Management – Cypress Sandbox", () => {
  const baseUrl = "/";

  beforeEach(() => {
    cy.intercept("GET", UserManagementEndpoints.Users()).as("getUsers");
    cy.visit(baseUrl);
  });

  afterEach(() => {
    // reset the state after each test
    return cy.request({
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
    cy.get('#user-form button[type="submit"]').click();
    cy.contains("td", name).should("exist");
  }

  describe("🔐 Admin Login", () => {
    it("Logs in with valid credentials", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.adminLogin }).as("postLogin");
      loginAsAdmin();
      cy.wait("@postLogin").then((interseption) => {
        expect(interseption.response.statusCode).to.eq(200);
        expect(interseption.response.body).deep.equal({ success: true });
      });

      cy.get("#admin-controls").should("be.visible");
    });

    it("Fails with invalid credentials", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.adminLogin }).as("postLoginFail");

      cy.get("#admin-email").type("wrong@admin.com");
      cy.get("#admin-password").type("wrongpass");
      cy.get('#admin-login-form button[type="submit"]').click();
      cy.get("#login-status").should("be.visible");

      cy.wait("@postLoginFail").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).deep.eq({ email: "wrong@admin.com", password: "wrongpass" });
        expect(xhr.response.body).deep.eq({ success: false });
      });
    });

    it("Logs out and hides admin controls", () => {
      loginAsAdmin();
      cy.get("#logout-btn").click();
      cy.get("#admin-controls").should("not.be.visible");
    });
  });

  describe("👤 Add/Edit User Form", () => {
    it("Adds a valid user", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.Users() }).as("postUserForm");

      fillUserForm({
        name: "John",
        role: "Editor",
        age: 30,
        email: "john@example.com",
        gender: "Male",
        subscriptions: ["Newsletter"],
      });
      cy.get('#user-form button[type="submit"]').click();

      cy.wait("@postUserForm").then((xhr) => {
        expect(xhr.response.statusCode).deep.equal(200);
        expect(xhr.request.body.name).to.eq("john");
        expect(xhr.request.body.email).to.equal("john@example.com");
      });
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
      cy.intercept({ method: "POST", url: UserManagementEndpoints.Users() }).as("PostNewUser");
      fillUserForm({
        name: "Anna",
        role: "Viewer",
        age: 26,
        email: "anna@example.com",
        gender: "Female",
        subscriptions: [],
      });
      cy.get('#user-form button[type="submit"]').click();

      cy.wait("@PostNewUser").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body.name).deep.eq("Anna");
        expect(xhr.response.body.email).deep.eq("anna@example.com");
      });
      cy.contains("td", "Anna").should("exist");
    });

    it("Edit user and verify updated values", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.Users() }).as("PostEditUser");

      addUserAndFindRow("EditableUser");

      cy.wait("@PostEditUser").then((xhr) => {
        expect(xhr.response.statusCode).deep.eq(200);
        expect(xhr.response.body.name).to.eq("EditableUser");
        expect(xhr.response.body.email).to.eq("EditableUser@example.com");
      });
      cy.contains("tr", "EditableUser").within(() => {
        cy.get(".edit-btn").click();
      });

      cy.intercept({ method: "PUT", url: UserManagementEndpoints.Users(4) }).as("PutUpdatedUser");

      UserManagementPage.nameInput().clear().type("EditedUser");
      cy.get('#user-form button[type="submit"]').click();

      cy.wait("@PutUpdatedUser").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body.name).to.eq("EditedUser");
        expect(xhr.response.body.id).to.eq(4);
      });

      cy.contains("td", "EditedUser").should("exist");
      cy.contains("td", "EditableUser").should("not.exist");
    });
  });

  describe("🗑 Delete & Edit Actions", () => {
    it("Delete modal flow works correctly", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.Users() }).as("PostNewUser");

      addUserAndFindRow("TempUser");

      cy.wait("@PostNewUser").then((xhr) => {
        expect(xhr.response.body.name).to.eq("TempUser");
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body.email).deep.equals("TempUser@example.com");
      });

      cy.contains("tr", "TempUser").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete-modal").should("be.visible");

      cy.intercept({ method: "DELETE", url: UserManagementEndpoints.Users(4) }).as("DeleteUser");
      cy.get("#cancel-delete").click();

      cy.wait("@DeleteUser").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.eq({ success: true });
      });

      cy.get("#confirm-delete-modal").should("not.be.visible");
    });

    it("Non-admin cannot delete Admin user", () => {
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#admin-delete-error").should("be.visible");
    });

    it("Admin can delete Admin user", () => {
      cy.intercept({ method: "POST", url: UserManagementEndpoints.adminLogin }).as("postAdminLogin");
      loginAsAdmin();
      cy.wait("@postAdminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });
      cy.intercept({ method: "DELETE", url: UserManagementEndpoints.Users(1) }).as("DeleteUser");
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete").click();

      cy.wait("@DeleteUser").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({ success: true });
      });

      cy.contains("tr", "Alice").should("not.exist");
    });
  });

  describe("🔁 Status Toggle", () => {
    it("Toggles status between Active and Inactive", () => {
      cy.intercept({ method: "PATCH", url: UserManagementEndpoints.Status(2) }).as("PatchStatus");

      cy.contains("tr", "Eve").within(() => {
        cy.get("td").eq(6).should("contain", "Active");
        cy.get(".status-btn").click();
        cy.wait("#PatchStatus").then((xhr) => {
          expect(xhr.response.statusCode).to.equal(200);
          expect(xhr.response.body.status).to.equal("Inactivate");
        });

        cy.get("td").eq(6).should("contain", "Inactive");
      });
    });
  });
});
