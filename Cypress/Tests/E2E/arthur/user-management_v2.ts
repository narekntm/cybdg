import { UserFormData } from "Models/UserManagementModels";
import { UserManagementPage } from "Pages/UserManagementPageV2";
import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementEndpoints } from "EndPoints/UserManagementEndpoints";


describe("User Management Test Scenarios", () => {
  const baseUrl = "/";

  afterEach(() => {
    UserManagementBuilders.ResetData()
  });

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  const login = (email: string = "admin@example.com", password: string = "admin123", shouldSucceed: boolean = true) => {
    UserManagementPage.adminEmailInput().type(email);
    UserManagementPage.adminPasswordInput().type(password);
    cy.intercept({ method: "POST", url: UserManagementEndpoints.adminLogin }).as("loginRequest");
    UserManagementPage.loginButton().click();
    cy.wait("@loginRequest").then((xhr) => {
      if (shouldSucceed) {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      } else {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      }
    });
  };

  function fillUserForm(user: UserFormData) {
    UserManagementPage.userNameInput().clear().type(user.name);
    UserManagementPage.userRoleSelect().select(user.role);
    UserManagementPage.userAgeInput().clear().type(user.age);
    UserManagementPage.userEmailInput().clear().type(user.email);
    UserManagementPage.userGenderRadio(user.gender).check();

    const allSubscriptions = ["Newsletter", "Product Updates"];
    allSubscriptions.forEach((sub) => {
      UserManagementPage.userSubscriptionCheckbox(sub).uncheck({ force: true });
    });

    if (user.subscriptions && user.subscriptions.length > 0) {
      user.subscriptions.forEach((sub) => {
        UserManagementPage.userSubscriptionCheckbox(sub).check({ force: true });
      });
    }
  }

  const saveUser = () => UserManagementPage.saveButton().contains("Save").click();

  context("Admin auth test cases", () => {
    it("Login with valid credentials", () => {
      login();
      UserManagementPage.adminControls().should("contain", "You are logged in as admin.");
      UserManagementPage.logoutButton().should("be.visible").contains("Logout");
    });

    it("Check login with invalid credentials", () => {
      login("invalid@admin.test", "wrongpassword,", false);
      UserManagementPage.loginStatus().should("be.visible").contains("Invalid credentials");
    });

    it("Verify that the delete button is working after login", () => {
      login();
      UserManagementPage.deleteButtonInRow("Alice").click();
      UserManagementPage.confirmModal().should("be.visible");
    });

    it("Should check error message on delete button without login", () => {
      UserManagementPage.deleteButtonInRow("Alice").click();
      UserManagementPage.deleteError().should("be.visible").and("contain", "Admin login required to delete Admin-level users.");
    });
  });

  context("Adding new user", () => {
    it("Should add user with valid input", () => {
      login();
      UserManagementPage.formTitle().should("be.visible");

      const testUser: UserFormData = {
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthur@example.com",
        gender: "Male",
        subscriptions: ["Newsletter", "Product Updates"],
      };

      fillUserForm(testUser);

      cy.intercept("POST", UserManagementEndpoints.Users()).as("addUser");

      saveUser();

      cy.wait("@addUser").then((interception) => {
        const sent = interception.request.body;

        expect(sent.name).to.eq(testUser.name);
        expect(sent.role).to.eq(testUser.role);
        expect(sent.age).to.eq(testUser.age);
        expect(sent.email).to.eq(testUser.email);
        expect(sent.gender).to.eq(testUser.gender);

        const sentSubscriptionsArray = sent.subscriptions.split(",").map((s: string) => s.trim());
        expect(sentSubscriptionsArray).to.have.members(testUser.subscriptions);

        expect(interception.response?.statusCode).to.eq(200);

        const responseBody = interception.response?.body;

        expect(responseBody).to.include({
          name: testUser.name,
          email: testUser.email,
          role: testUser.role,
          age: testUser.age,
          gender: testUser.gender,
          status: "Active",
        });

        const responseSubscriptionsArray = responseBody.subscriptions.split(",").map((s: string) => s.trim());
        expect(responseSubscriptionsArray).to.have.members(testUser.subscriptions);

        expect(responseBody).to.have.property("id").that.is.a("number");
      });

      UserManagementPage.deleteButtonInRow("Arthur").click();
    });

    it("Should submit form with all fields empty", () => {
      login();
      UserManagementPage.formTitle().should("be.visible");
      saveUser();
      UserManagementPage.formErrors().should("be.visible");
      UserManagementPage.formErrors().within(() => {
        cy.contains("Name must be 1–20 letters only (no spaces or symbols).").should("exist");
        cy.contains("Role is required.").should("exist");
        cy.contains("Age must be between 1 and 99.").should("exist");
        cy.contains("Valid email is required.").should("exist");
        cy.contains("Gender selection is required.").should("exist");
      });
    });

    it("Should show error when name contains symbols", () => {
      login();
      fillUserForm({
        name: "John@",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when name contains numbers", () => {
      login();
      fillUserForm({
        name: "John123",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when name is too long", () => {
      login();
      fillUserForm({
        name: "ArthurTheGreatAndPowerfulKingOfTheBrits",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when no @ symbol", () => {
      login();
      cy.get("#form-title").should("be.visible");
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthurtest.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when no domain", () => {
      login();
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthurtest@",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when no username part", () => {
      login();
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "@test.test",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when gender is not selected", () => {
      login();
      UserManagementPage.userNameInput().type("Arthur");
      UserManagementPage.userRoleSelect().select("Admin");
      UserManagementPage.userAgeInput().type("30");
      UserManagementPage.userEmailInput().type("arthur@test.test");
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Gender selection is required.");
    });
  });

  context("Edit,Delete, Deactivate user", () => {
    it("Should edit existing user and update in the table", () => {
      login();
      UserManagementPage.editButtonInRow("Alice").click();

      UserManagementPage.userNameInput().should("have.value", "Alice");
      UserManagementPage.userRoleSelect().should("have.value", "Admin");
      UserManagementPage.userAgeInput().should("have.value", "30");
      UserManagementPage.userEmailInput().should("have.value", "alice@site.com");
      UserManagementPage.userSubscriptionCheckbox("Newsletter").should("be.checked");

      const updatedUser: UserFormData = {
        name: "AliceUpdatedName",
        role: "Editor",
        age: "35",
        email: "alice.updated@test.test",
        gender: "Female",
        subscriptions: ["Product Updates"],
      };

      fillUserForm(updatedUser);

      cy.intercept("PUT", UserManagementEndpoints.Users(1)).as("editUser");

      saveUser();

      cy.wait("@editUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        const sent = interception.request.body;

        expect(sent.name).to.eq(updatedUser.name);
        expect(sent.role).to.eq(updatedUser.role);
        expect(sent.age).to.eq(updatedUser.age);
        expect(sent.email).to.eq(updatedUser.email);
        expect(sent.gender).to.eq(updatedUser.gender);

        const sentSubscriptionsArray = sent.subscriptions.split(",").map((s: string) => s.trim());
        expect(sentSubscriptionsArray).to.have.members(updatedUser.subscriptions);

        const res = interception.response?.body;

        expect(res).to.include({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          age: updatedUser.age,
          gender: updatedUser.gender,
          status: "Active",
        });

        const responseSubscriptionsArray = res.subscriptions.split(",").map((s: string) => s.trim());
        expect(responseSubscriptionsArray).to.have.members(updatedUser.subscriptions);
      });

      cy.contains("#user-table tr", updatedUser.name).within(() => {
        cy.contains(updatedUser.role);
        cy.contains(updatedUser.age);
        cy.contains(updatedUser.email);
        cy.contains(updatedUser.gender);
        cy.contains(updatedUser.subscriptions[0]);
      });
    });

    it("Should delete existing user and remove from the table", () => {
      login();
      UserManagementPage.deleteButtonInRow("Alice").click();
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.cancelDeleteButton().should("be.visible").click();
      UserManagementPage.confirmModal().should("not.be.visible");
      UserManagementPage.deleteButtonInRow("Alice").click();
      UserManagementPage.confirmModal().should("be.visible");

      cy.intercept("DELETE", UserManagementEndpoints.Users(1)).as("deleteUser");

      UserManagementPage.confirmDeleteButton().should("be.visible").click();
      cy.wait("@deleteUser").then((interception) => {
        expect(interception.request.body).to.have.property("isAdmin", true);
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.property("success", true);
      });
      cy.contains("#user-table tr", "Alice").should("not.exist");
    });

    it("Should deactivate and activate user", () => {
      login();

      cy.intercept("PATCH", UserManagementEndpoints.Status(1)).as("toggleUserStatus");

      UserManagementPage.deactivateButtonInRow("Alice").click();

      cy.wait("@toggleUserStatus").then((interception) => {
        expect(interception.request.body).to.have.property("status", "Inactive");
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.property("status", "Inactive");
      });

      UserManagementPage.statusCellInRow("Alice").should("contain", "Inactive");
      UserManagementPage.activateButtonInRow("Alice").click();
      UserManagementPage.statusCellInRow("Alice").should("contain", "Active");
      UserManagementPage.deactivateButtonInRow("Alice").should("exist");
    });

    it("Should reset all users and verify API returns 3 users", () => {
      login();

      cy.intercept("POST", UserManagementEndpoints.reset).as("resetRequest");

      UserManagementPage.resetButton().click();
      UserManagementPage.confirmResetModal().should("be.visible");
      UserManagementPage.confirmResetButton().should("be.visible").click();

      cy.wait("@resetRequest").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        expect(response?.body).to.have.property("success", true);
        expect(response?.body).to.have.property("users");
        expect(response?.body.users).to.be.an("array").with.length(3);
      });
    });
  });
});
