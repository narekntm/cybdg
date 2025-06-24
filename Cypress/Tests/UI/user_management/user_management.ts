import { UserManagementPage } from "Pages/UserManagementPage";
import { intersection } from "lodash";

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
    cy.get('#user-form button[type="submit"]').click();
    cy.contains("td", name).should("exist");
  }

  describe("🔐 Admin Login", () => {
    it("Logs in with valid credentials", () => {

      cy.intercept ({method : "POST", url: "/api/login"}).as('postLogin')
      loginAsAdmin();
      cy.wait('@postLogin').then(interseption => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body).deep.equal({success: true})
      })

      cy.get("#admin-controls").should("be.visible");
    });

    it("Fails with invalid credentials", () => {

      cy.intercept({method: "POST", url: "/api/login"}).as('postLoginFail')

      cy.get("#admin-email").type("wrong@admin.com");
      cy.get("#admin-password").type("wrongpass");
      cy.get('#admin-login-form button[type="submit"]').click();
      cy.get("#login-status").should("be.visible");

      cy.wait('@postLoginFail').then( interseption => {
        expect(interseption.response.statusCode).to.eq(401)
        expect(interseption.response.body).deep.equal({email: "wrong@loginAsAdmin.com", password: "wrongpass"})
        expect(interseption.response.body).deep.equal({success: false})
      })
    });

    it("Logs out and hides admin controls", () => {
      loginAsAdmin();
      cy.get("#logout-btn").click();
      cy.get("#admin-controls").should("not.be.visible");
    });
  });

  describe("👤 Add/Edit User Form", () => {
    it("Adds a valid user", () => {
  cy.intercept({method: "POST", url: "/api/users"}).as("postUserForm")

      fillUserForm({
        name: "John",
        role: "Editor",
        age: 30,
        email: "john@example.com",
        gender: "Male",
        subscriptions: ["Newsletter"],
      });
      cy.get('#user-form button[type="submit"]').click();

      cy.wait("@postUserForm").then(interseption => {
        expect(interseption.response.statusCode).deep.equal(200)
        expect(interseption.request.body.name).to.eq("john")
        expect(interseption.request.body.email).to.equal("john@example.com")
      })
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
      cy.intercept({method: "POST", url: "/api/users"}).as('PostNewUser')
      fillUserForm({
        name: "Anna",
        role: "Viewer",
        age: 26,
        email: "anna@example.com",
        gender: "Female",
        subscriptions: [],
      });
      cy.get('#user-form button[type="submit"]').click();

      cy.wait('@PostNewUser').then(interseption => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body.name).deep.eq("Anna")
        expect(interseption.response.body.email).deep.eq("anna@example.com")

      })
      cy.contains("td", "Anna").should("exist");
    });

    it("Edit user and verify updated values", () => {
      cy.intercept({method: "POST", url: "/api/users" }).as('PostEditUser')
      
      addUserAndFindRow("EditableUser");

      
      cy.wait('@PostEditUser').then(interseption => {
        expect(interseption.response.statusCode).deep.eq(200)
        expect(interseption.response.body.name).to.eq("EditableUser")
        expect(interseption.response.body.email).to.eq("EditableUser@example.com")

      })
      cy.contains("tr", "EditableUser").within(() => {
        cy.get(".edit-btn").click();
      });

      cy.intercept({method: "PUT", url:"/api/users/4"}).as('PutUpdatedUser')

      UserManagementPage.nameInput().clear().type("EditedUser");
      cy.get('#user-form button[type="submit"]').click();

      cy.wait("@PutUpdatedUser").then(interseption => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body.name).to.eq("EditedUser")
        expect(interseption.response.body.id).to.eq(4)

      })

      cy.contains("td", "EditedUser").should("exist");
      cy.contains("td", "EditableUser").should("not.exist");
    });
  });

  describe("🗑 Delete & Edit Actions", () => {
    it("Delete modal flow works correctly", () => {
      cy.intercept({method: "POST", url: "/api/users"}).as('PostNewUser')

      addUserAndFindRow("TempUser");

      cy.wait("@PostNewUser").then((interseption) => {
        expect(interseption.response.body.name).to.eq("TempUser")
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body.email).to.eq("TempUser@example.com")
      })

      cy.contains("tr", "TempUser").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete-modal").should("be.visible");

      cy.intercept({method: "DELETE", url: "/api/users/4"}).as("DeleteUser")
      cy.get("#cancel-delete").click();

      cy.wait("@DeleteUser").then((interseption) => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body).deep.eq({success: true})
      })
      
      cy.get("#confirm-delete-modal").should("not.be.visible");
    });

    it("Non-admin cannot delete Admin user", () => {
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#admin-delete-error").should("be.visible");
    });

    it("Admin can delete Admin user", () => {
      cy.intercept ({method : "POST", url: "/api/login"}).as('postAdminLogin')
      loginAsAdmin();
      cy.wait('@postAdminLogin').then((interseption) => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body).deep.equal({success: true})
      })
    cy.intercept({method: "DELETE", url:"/api/users/1"}).as("DeleteUser")
      cy.contains("tr", "Alice").within(() => {
        cy.get(".delete-btn").click();
      });
      cy.get("#confirm-delete").click();

      cy.wait('@DeleteUser').then((interseption) => {
        expect(interseption.response.statusCode).to.eq(200)
        expect(interseption.response.body).deep.equal({success: true})
      })

      cy.contains("tr", "Alice").should("not.exist");
    });
  });

  describe("🔁 Status Toggle", () => {
    it("Toggles status between Active and Inactive", () => {

      cy.intercept({method: "PATCH", url: "/api/users/2/status"}).as("PatchStatus")

      cy.contains("tr", "Eve").within(() => {
        cy.get("td").eq(6).should("contain", "Active");
        cy.get(".status-btn").click();
      cy.wait("#PatchStatus").then((interseption) => {
        expect(interseption.response.statusCode).to.equal(200)
        expect(interseption.response.body.status).to.equal("Inactivate")

      })

        cy.get("td").eq(6).should("contain", "Inactive");
      });
    });
  });
});
