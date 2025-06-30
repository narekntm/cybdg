import Chance from "chance";
import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { Gender , Role , Status, Subscription, UserFormData, UserFormDataMock, UserInput } from "Models/Arthur/UserManagementModels";
import { UserManagementPage } from "Pages/Arthur/UserManagementPageV3";


const chance = new Chance();

describe("User Management Test Scenarios", () => {
  const baseUrl = "http://localhost:3000/";

  beforeEach(() => {
    cy.visit(baseUrl);
    UserManagementBuilders.ResetData();
  });

  afterEach(() => {
    UserManagementBuilders.ResetData();
  });

  const login = (email: string = "admin@example.com", password: string = "admin123") => {
    UserManagementPage.openLoginModalButton().click();
    UserManagementPage.adminLoginModal();
    UserManagementPage.adminEmailInput().type(email);
    UserManagementPage.adminPasswordInput().type(password);
    UserManagementPage.loginButton().click();
  };

  function fillUserForm(user: UserFormData) {
    UserManagementPage.addNewUserButton().click();
    UserManagementPage.userNameInput().clear().type(user.name);
    UserManagementPage.userRoleSelect().select(user.role);
    UserManagementPage.userAgeInput().clear().type(user.age);
    UserManagementPage.userEmailInput().clear().type(user.email);
    UserManagementPage.userGenderRadio(user.gender).check();

    if (user.subscriptions && user.subscriptions.length > 0) {
      user.subscriptions.forEach((sub) => {
        UserManagementPage.userSubscriptionCheckbox(sub).uncheck().check();
      });
    }
  }

  function editUserForm(user: UserFormData) {
    UserManagementPage.editButton().click();
    UserManagementPage.userNameInput().clear().type(user.name);
    UserManagementPage.userRoleSelect().select(user.role);
    UserManagementPage.userAgeInput().clear().type(user.age);
    UserManagementPage.userEmailInput().clear().type(user.email);
    UserManagementPage.genderSelect().select(user.gender);
    UserManagementPage.productCheckbox().check();
  }

  const saveUser = () => UserManagementPage.saveButton().contains("Save").click();

  context("Admin auth test cases", () => {
    it("Login with valid credentials", () => {
      login();
      UserManagementPage.adminStatusText().should("contain", "Logged in as Admin");
      UserManagementPage.logoutButton().should("be.visible").contains("Logout");
    });

    it("Check login with invalid credentials", () => {
      login("invalid@admin.test", "wrongpassword");
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
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthur@example.com",
        gender: "Male",
        subscriptions: ["Newsletter", "Product Updates"],
      });
      saveUser();
      UserManagementPage.toastContainer().should("be.visible").and("contain.text", "User added successfully");
      UserManagementPage.deleteButtonInRow("Arthur").click();
    });

    it("Should submit form with all fields empty", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      saveUser();
      UserManagementPage.formErrors().should("be.visible");
      UserManagementPage.formErrors().within(() => {
        cy.contains("Name must be 1–20 letters only (no spaces or symbols).").should("exist");
        cy.contains("Role is required.").should("exist");
        cy.contains("Age must be between 1 and 99.").should("exist");
        cy.contains("Valid email is required.").should("exist");
        cy.contains("Gender selection is required.").should("exist");
      });
      UserManagementPage.toastContainer().should("be.visible");
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
      UserManagementPage.toastContainer().should("be.visible");
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
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when no @ symbol", () => {
      login();
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthurtest.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Valid email is required.");
      UserManagementPage.toastContainer().should("be.visible");
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
      UserManagementPage.toastContainer().should("be.visible");
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
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when gender is not selected", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      UserManagementPage.userNameInput().type("Arthur");
      UserManagementPage.userRoleSelect().select("Admin");
      UserManagementPage.userAgeInput().type("30");
      UserManagementPage.userEmailInput().type("arthur@test.test");
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Gender selection is required.");
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error message when email already exists", () => {
      login();
      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "alice@site.com",
        gender: "Male",
      });
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains("Email already exists.");
      UserManagementPage.toastContainer().should("be.visible").and("text", "Email already exists.");
    });
  });

  context("Edit,Delete, Deactivate user", () => {
    it("Should edit existing user and update in the table", () => {
      login();
      UserManagementPage.viewButtonInRow("Alice").click();
      editUserForm({
        name: "AliceUpdatedName",
        role: "Editor",
        age: "35",
        email: "alice.updated@test.test",
        gender: "Female",
        subscriptions: ["Product Updates"],
      });

      UserManagementPage.saveUserDataButton().click();
      UserManagementPage.toastContainer().should("be.visible").and("text", "User updated!");
      UserManagementPage.backButton().click();

      cy.contains("#user-table tr", "AliceUpdatedName").within(() => {
        cy.contains("Editor");
        cy.contains("35");
        cy.contains("alice.updated@test.test");
        cy.contains("Female");
        cy.contains("Product Updates");
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
      UserManagementPage.confirmDeleteButton().should("be.visible").click();
      cy.contains("#user-table tr", "Alice").should("not.exist");
    });

    it("Should deactivate and activate user", () => {
      login();
      UserManagementPage.deactivateButtonInRow("Alice").click();
      UserManagementPage.statusCellInRow("Alice").should("contain", "Inactive");
      UserManagementPage.activateButtonInRow("Alice").click();
      UserManagementPage.statusCellInRow("Alice").should("contain", "Active");
      UserManagementPage.deactivateButtonInRow("Alice").should("exist");
    });
  });

  context("User detail page", () => {
    const mockedUser: UserFormDataMock = {
      name: "GhostUser",
      email: "ghost@example.com",
      role: "Viewer",
      age: "30",
      gender: "Non-binary",
      subscriptions: "Newsletter, Product Updates",
      status: "Active",
    };

    it("Should display mocked user data and check it", () => {
      cy.intercept("GET", "/api/users/1", {
        statusCode: 200,
        body: mockedUser,
      }).as("getUser");

      cy.visit("/user_detail.html?id=1");
      cy.wait("@getUser");

      UserManagementPage.userNameText().should("have.text", mockedUser.name);
      cy.contains("Name:").next().should("have.text", mockedUser.name);
      cy.contains("Role:").next().should("have.text", mockedUser.role);
      cy.contains("Age:").next().should("have.text", mockedUser.age);
      cy.contains("Email:").next().should("have.text", mockedUser.email);
      cy.contains("Gender:").next().should("have.text", mockedUser.gender);
      cy.contains("Subscriptions:").next().should("have.text", mockedUser.subscriptions);
      cy.contains("Status:").next().should("have.text", mockedUser.status);
    });
  });

  context("User detail page", () => {
    it.only("Should seed 50 users and verify total user count is 53", () => {
      const users: UserInput[] = [];

      for (let i = 0; i < 50; i++) {
        users.push({
          name: chance.first(),
          role: chance.pickone(Object.values(Role)),
          age: chance.integer({ min: 18, max: 65 }),
          email: chance.email(),
          gender: chance.pickone(Object.values(Gender)),
          subscriptions: chance.pickset(Object.values(Subscription), chance.integer({ min: 0, max: 2 })),
          status: chance.pickone(Object.values(Status)),
        });
      }

      UserManagementBuilders.seedData(users).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("success", true);
      });

      UserManagementBuilders.GetUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array").with.length(53);
      });

      cy.reload();
      UserManagementPage.userRows().should("have.length.at.most", 10);
    });
  });
});
