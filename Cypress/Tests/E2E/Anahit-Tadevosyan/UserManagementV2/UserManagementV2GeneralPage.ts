import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import {UserManagementGenerator} from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";

describe("User Management Test Cases", () => {
  const baseUrl = "http://localhost:3000/index.html";
  beforeEach("visit the site", () => {
    cy.intercept({ method: "GET", url: UserManagementEndpoints.users() }).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers").then((interception) => {
      expect(interception.response.statusCode).to.eq(304);
    });
  });

  afterEach("Reset the filled in data", () => {
    cy.intercept({ method: "POST", url: UserManagementEndpoints.reset() }).as("postReset");
    UserManagementPage.resetButton().click();
    UserManagementPage.confirmResetButton().click();
    cy.wait("@postReset").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });
  const login = function (email: string, password: string) {
    UserManagementPage.loginPopUpOpen().click();
    UserManagementPage.adminEmailInput().type(email);
    UserManagementPage.adminPasswordInput().type(password);
    UserManagementPage.loginButton().click();
  };
  const addUser = function (
    fullName: string = "",
    role: string = "",
    age: string = "",
    email: string = "",
    gender?: "Male" | "Female" | "Other",
    subscriptions: string[] = []
  ) {
    if (fullName) UserManagementPage.fullNameInput().clear().type(fullName);
    if (role) UserManagementPage.roleInput().select(role);
    if (age) UserManagementPage.ageInput().clear().type(age);
    if (email) UserManagementPage.emailInput().clear().type(email);

    if (gender) {
      UserManagementPage.genderRadio(gender).check();
    }
    UserManagementPage.subscribeComponent().uncheck();

    subscriptions.forEach((subs) => {
      UserManagementPage.subscribeCheckbox(subs).check();
    });

    UserManagementPage.saveButton().click();
  };

  describe("Admin Login", () => {
    it("Login with valid credentials", () => {
      cy.intercept({ method: "POST", url: "/api/login" }).as("login");
      login("admin@example.com", "admin123");
      cy.wait("@login").then((interception) => {
        expect(interception.request.body).to.deep.eq({ email: "admin@example.com", password: "admin123" });
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.eq({ success: true });
      });
      UserManagementPage.logoutButton().click();
    });

    it("Login with invalid credentials", () => {
      cy.intercept({ method: "POST", url: "/api/login" }).as("login");
      login("test@example.com", "test123");
      UserManagementPage.loginStatus().should("contain", "Invalid credentials");
      cy.wait("@login").then((interception) => {
        expect(interception.request.body).not.to.deep.eq({ email: "admin@example.com", password: "admin123" });
        expect(interception.response.statusCode).to.eq(401);
        expect(interception.response.body).to.deep.eq({ errors: ["Invalid credentials."] });
      });
      UserManagementPage.loginPopUpClose().click();
    });

    it("Admin delete become active after login", () => {
      cy.intercept({ method: "POST", url: "/api/login" }).as("login");
      login("admin@example.com", "admin123");
      cy.wait("@login").then((interception) => {
        expect(interception.request.body).to.deep.eq({ email: "admin@example.com", password: "admin123" });
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.eq({ success: true });
      });
      UserManagementPage.tableRow(0).within(() => {
        UserManagementPage.deleteButton().click();
      });
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.cancelDeleteButton().click();
    });

    it("Admin delete errors out after logout / before login", () => {
      UserManagementPage.tableRow(0).within(() => {
        UserManagementPage.deleteButton().click();
      });
      UserManagementPage.adminDeleteErrorMessage().should("be.visible").and("contain", "Admin login required to delete Admin-level users.");
    });
  });

  describe("Add New User", () => {
    beforeEach("open add user", () => {
      UserManagementPage.addUserPopupOpen().click();
    });

    it("Add user with valid input", () => {
      const user = UserManagementGenerator.userPositiveCase
      cy.intercept({ method: "POST", url: "/api/users" }).as("addUser");
      addUser(user.name,user.role, user.age,user.email, user.gender, user.subscriptions);
      UserManagementPage.toastSuccess().should("exist").and("contain", "User added successfully");
      cy.wait("@addUser").then((interception) => {
        expect(interception.request.body).to.include({
         ...user, subscriptions: user.subscriptions.join(",")
        });
        expect(interception.response.body).to.include({
        ...user,  subscriptions: user.subscriptions.join(",")
        });
        expect(interception.response.statusCode).to.eq(200);
      });
      UserManagementPage.tableRow(3).within(() => {
        UserManagementPage.tableTd(0).should("have.text", user.name);
      });
    });

    it("Submit form with all fields empty", () => {
      addUser();
      UserManagementPage.formErrorsMessage().should("exist");
      UserManagementPage.toastError()
        .should("exist")
        .and(
          "have.text",
          "Name must be 1–20 letters only (no spaces or symbols). Role is required. Age must be between 1 and 99. Valid email is required. Gender selection is required."
        );
      UserManagementPage.addUserPopupClose().click();
    });

    it("Invalid name (e.g. symbols, numbers)", () => {
      const user = UserManagementGenerator.userNegativeName
      addUser(user.name, user.role, user.age,user.email, user.gender, user.subscriptions);
      UserManagementPage.formErrorsMessage().should("contain", "Name must be 1–20 letters only (no spaces or symbols).");
      UserManagementPage.toastError().should("exist").and("have.text", "Name must be 1–20 letters only (no spaces or symbols).");

      UserManagementPage.addUserPopupClose().click();
    });

    it("Invalid email format", () => {
      const user= UserManagementGenerator.userNegativeEmail
      addUser(user.name, user.role, user.age,user.email, user.gender, user.subscriptions);
      UserManagementPage.formErrorsMessage().should("contain", "Valid email is required.");
      UserManagementPage.toastError().should("exist").and("have.text", "Valid email is required.");

      UserManagementPage.addUserPopupClose().click();
    });

    it("No gender selected", () => {
      const user = UserManagementGenerator.userPositiveCase
      addUser(user.name, user.role, user.age,user.email, null, user.subscriptions);
      UserManagementPage.formErrorsMessage().should("contain", "Gender selection is required.");
      UserManagementPage.toastError().should("exist").and("have.text", "Gender selection is required.");
      UserManagementPage.addUserPopupClose().click();
    });

    it("Submit without selecting subscriptions", () => {
      const user = UserManagementGenerator.userPositiveCase
      cy.intercept({ method: "POST", url: "/api/users" }).as("addUser");
      addUser(user.name, user.role, user.age,user.email, user.gender, []);
      UserManagementPage.toastSuccess().should("exist").and("have.text", "User added successfully");
      cy.wait("@addUser").then((interception) => {
        expect(interception.request.body).to.include({
         ...user, subscriptions: 'None'
        });
        expect(interception.response.body).to.include({
          ...user, subscriptions: 'None'
        });
        expect(interception.response.statusCode).to.eq(200);
        UserManagementPage.tableRow(3).within(() => {
          UserManagementPage.tableTd(0).should("have.text", user.name);
        });
      });
    });
  });
  describe("Edit Existing User", () => {
    it('Clicking "Edit" loads user data and Submitting replaces table row', () => {
      const staticUserOne = UserManagementGenerator.staticUserOne
      UserManagementPage.tableRow(0).find(".btn-secondary.edit-btn").click();
      UserManagementPage.fullNameInput().should("have.value", staticUserOne.name );
      UserManagementPage.roleInput().should("have.value", staticUserOne.role);
      UserManagementPage.ageInput().should("have.value", staticUserOne.age);
      UserManagementPage.emailInput().should("have.value", staticUserOne.email);
      UserManagementPage.genderRadio(staticUserOne.gender).should("be.checked");
      UserManagementPage.subscribeCheckbox(staticUserOne.subscriptions.join(",")).should("be.checked");
      cy.intercept({ method: "PUT", url: "api/users/1" }).as("EditUser");
      const user = UserManagementGenerator.userPositiveCase
      addUser(user.name, user.role, user.age,user.email, user.gender, user.subscriptions);
      UserManagementPage.toastSuccess().should("exist").and("have.text", "User updated successfully");
      cy.wait("@EditUser").then((interception) => {
        expect(interception.request.body).to.include({
         ...user, subscriptions: user.subscriptions.join(",")
        });
        expect(interception.response.body).to.include({
          ...user, subscriptions: user.subscriptions.join(",")
        }),
          expect(interception.response.statusCode).to.eq(200);

        UserManagementPage.tableData(0, 0).should("have.text", user.name);
        UserManagementPage.tableData(0, 1).should("have.text", user.role);
        UserManagementPage.tableData(0, 2).should("have.text", user.age);
        UserManagementPage.tableData(0, 3).should("have.text", user.email);
        UserManagementPage.tableData(0, 4).should("have.text", user.gender);
        UserManagementPage.tableData(0, 5).should("have.text", user.subscriptions.join(","));
      });
    });
  });
  describe("Delete User", () => {
    it('Clicking "Delete" opens confirmation modal', () => {
      UserManagementPage.tableRow(2).find(".btn-danger.delete-btn").click();
      UserManagementPage.modalContent().should("exist");
      UserManagementPage.cancelDeleteButton().click();
    });

    it('Clicking "Yes" deletes the selected user', () => {
      UserManagementPage.tableRow(2).find(".btn-danger.delete-btn").click();
      UserManagementPage.modalContent().should("exist");
      cy.intercept({ method: "DELETE", url: "api/users/3" }).as("deleteUser");
      UserManagementPage.confirmDeleteButton().click();
      cy.wait("@deleteUser").then((interception) => {
        expect(interception.request.body).to.include({ isAdmin: false });
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.eq({ success: true });
      });
      UserManagementPage.userTable().should("not.contain", UserManagementGenerator.staticUserThree.name);
    });

    it('Clicking "Cancel" closes modal, no action taken', () => {
      UserManagementPage.tableRow(2).find(".btn-danger.delete-btn").click();
      UserManagementPage.modalContent().should("exist");
      UserManagementPage.cancelDeleteButton().click();
      UserManagementPage.modalContent().should("not.be.visible");
    });

    it("Non-admin tries to delete Admin user", () => {
      UserManagementPage.tableRow(2).find(".btn-danger.delete-btn").click();
      UserManagementPage.adminDeleteErrorMessage().should("exist");
      UserManagementPage.cancelDeleteButton().click();
    });

    it("Admin user deletes another Admin after login", () => {
      login("admin@example.com", "admin123");
      UserManagementPage.tableRow(0).find(".btn-danger.delete-btn").click();
      UserManagementPage.modalContent().should("exist");
      cy.intercept({ method: "DELETE", url: "api/users/1" }).as("deleteUser");
      UserManagementPage.confirmDeleteButton().click();
      cy.wait("@deleteUser").then((interception) => {
        expect(interception.request.body).to.include({ isAdmin: true });
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.deep.eq({ success: true });
      });
      UserManagementPage.userTable().should("not.contain", UserManagementGenerator.staticUserOne.name);
    });
  });

  describe("Toggle Status", () => {
    it("Status toggles between Active/Inactive", () => {
      cy.intercept({ method: "PATCH", url: "api/users/3/status" }).as("deactivateUser");
      UserManagementPage.tableRow(2).find(".btn-primary.status-btn").click();
      cy.wait("@deactivateUser").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.request.body).to.include({ status: "Inactive"});
        expect(interception.response.body).to.include({
          ...UserManagementGenerator.staticUserThree,
          age: Number(UserManagementGenerator.staticUserThree.age),
          subscriptions: UserManagementGenerator.staticUserThree.subscriptions.join(", "),
          status: "Inactive",
        } );
      });
      UserManagementPage.tableRow(2).find("td").eq(6).should("have.text", "Inactive");
      cy.intercept({ method: "PATCH", url: "api/users/3/status" }).as("activateUser");
      UserManagementPage.tableRow(2).find(".btn-primary.status-btn").click();
      cy.wait("@deactivateUser").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.request.body).to.include({ status: "Active" });
        expect(interception.response.body).to.include({
          ...UserManagementGenerator.staticUserThree,
          age: Number(UserManagementGenerator.staticUserThree.age),
          subscriptions: UserManagementGenerator.staticUserThree.subscriptions.join(", "),
          status: "Active",
        });
      });
      UserManagementPage.tableRow(2).find("td").eq(6).should("have.text", "Active");
    });
  });
});
