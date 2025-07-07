import Chance from "chance";
import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { fillUserForm } from "Cypress/Support/Helpers/Arthur/UserManagementPageHelpers";
import { UserManagementEndpoints } from "EndPoints/Arthur/UserManagementEndpoints";
import { UserManagementGenerators } from "Generators/Arthur/UserManagementGenerator";
import { Gender, Role, Status, User, UserErrorMessages, UserFormData, UserStatusMessages } from "Models/Arthur/UserManagementModels";
import { UserManagementPage } from "Pages/Arthur/UserManagementPageV3";

const chance = new Chance();

describe("User Management Test Scenarios", () => {
  const baseUrl = "/";

  afterEach(() => {
    UserManagementBuilders.ResetData();
  });

  beforeEach(() => {
    UserManagementBuilders.ResetData();
    cy.visit(baseUrl);
  });

  const login = (email: string = "admin@example.com", password: string = "admin123", shouldSucceed: boolean = true) => {
    UserManagementPage.openLoginModalButton().click();
    UserManagementPage.adminLoginModal();
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
        expect(xhr.response.body.errors).to.deep.equal([UserErrorMessages.InvalidCredentials]);
      }
    });
  };

  const saveUser = () => UserManagementPage.saveButton().contains("Save").click();

  context("Admin auth test cases", () => {
    it("Login with valid credentials", () => {
      login();
      UserManagementPage.adminStatusText().should("contain", UserStatusMessages.LoggedInAsAdmin);
      UserManagementPage.logoutButton().should("be.visible").and("have.text", "Logout");
    });

    it("Check login with invalid credentials", () => {
      login("invalid@admin.test", "wrongpassword,", false);
      UserManagementPage.loginStatus().should("be.visible").and("have.text", UserErrorMessages.InvalidCredentials);
    });

    it("Verify that the delete button is working after login", () => {
      login();

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const user = body.find((u: User) => u.id === 1);
        expect(user).to.exist;

        UserManagementPage.deleteButtonInRowById(user.id).click();
        UserManagementPage.confirmModal().should("be.visible");
      });
    });

    it("Should check error message on delete button without login", () => {
      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const adminUser = body.find((u: User) => u.role === Role.Admin);
        expect(adminUser).to.exist;

        UserManagementPage.deleteButtonInRowById(adminUser.id).click();
        UserManagementPage.deleteError().should("be.visible").and("contain", UserErrorMessages.AdminDeleteError);
      });
    });
  });

  context("Adding new user", () => {
    beforeEach(() => {
      cy.intercept("POST", UserManagementEndpoints.Users()).as("addUser");
    });

    it("Should add user with valid input", () => {
      login();

      const testUser: UserFormData = UserManagementGenerators.validUser();
      UserManagementPage.addNewUserButton().click();

      fillUserForm(testUser);
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
          status: Status.Active,
        });

        const responseSubscriptionsArray = responseBody.subscriptions.split(",").map((s: string) => s.trim());
        expect(responseSubscriptionsArray).to.have.members(testUser.subscriptions);
        expect(responseBody).to.have.property("id").that.is.a("number");
      });

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const addedUser = body.find((u: User) => u.email === testUser.email);
        expect(addedUser).to.exist;
        expect(addedUser.name).to.eq(testUser.name);
        expect(addedUser.role).to.eq(testUser.role);
      });
    });

    it("Should submit form with all fields empty", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      saveUser();

      cy.wait("@addUser").then((interception) => {
        console.log("Request body:", interception.request.body);
        expect(interception.request.body).to.include({
          name: "",
          role: "",
          age: "",
          email: "",
        });

        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body).to.deep.equal({
          errors: [
            UserErrorMessages.EmptyName,
            UserErrorMessages.EmptyRole,
            UserErrorMessages.InvalidAge,
            UserErrorMessages.InvalidEmail,
            UserErrorMessages.EmptyGender,
          ],
        });
      });

      UserManagementPage.formErrors().should("be.visible");
      UserManagementPage.formErrors().within(() => {
        cy.contains(UserErrorMessages.EmptyName).should("exist");
        cy.contains(UserErrorMessages.EmptyRole).should("exist");
        cy.contains(UserErrorMessages.InvalidAge).should("exist");
        cy.contains(UserErrorMessages.InvalidEmail).should("exist");
        cy.contains(UserErrorMessages.EmptyGender).should("exist");
      });
    });

    it("Should show error when name contains symbols", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withSymbolsInName());
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.EmptyName);
      });
      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.EmptyName);
    });

    it("Should show error when name contains numbers", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withNumbersInName());
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.EmptyName);
      });
      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.EmptyName);
    });

    it("Should show error when name is too long", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withLongRandomName(25));
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.EmptyName);
      });
      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.EmptyName);
    });

    it("Should show error when no @ symbol", () => {
      login();
      const userNoAt = UserManagementGenerators.validUser();
      userNoAt.email = "arthurtest.com";
      UserManagementPage.addNewUserButton().click();
      fillUserForm(userNoAt);
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.InvalidEmail);
      });

      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.InvalidEmail);
    });

    it("Should show error when no domain", () => {
      login();
      const userNoDomain = UserManagementGenerators.validUser();
      userNoDomain.email = chance.string({ length: 10, pool: "abcdefghijklmnopqrstuvwxyz" }) + "@";
      UserManagementPage.addNewUserButton().click();
      fillUserForm(userNoDomain);
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.InvalidEmail);
      });

      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.InvalidEmail);
    });
    it("Should show error when no username part", () => {
      login();
      const userNoUsername = UserManagementGenerators.validUser();
      userNoUsername.email = "@" + chance.domain();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(userNoUsername);
      saveUser();

      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.InvalidEmail);
      });

      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.InvalidEmail);
    });

    it("Should show error when gender is not selected", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      UserManagementPage.userNameInput().type(chance.first());
      UserManagementPage.userRoleSelect().select(Role.Admin);
      UserManagementPage.userAgeInput().type(chance.age({ type: "adult" }).toString());
      UserManagementPage.userEmailInput().type(chance.email());
      saveUser();
      cy.wait("@addUser").then((interception) => {
        expect(interception.response?.statusCode).to.eq(400);
        expect(interception.response?.body.errors).to.include(UserErrorMessages.EmptyGender);
      });
      UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.EmptyGender);
    });

    it("Should show error when email already exists", () => {
      login();

      UserManagementBuilders.GetUsers().then((response) => {
        const users = response.body;
        const existingUser = users[0];
        expect(existingUser).to.exist;
        UserManagementPage.addNewUserButton().click();

        const user = UserManagementGenerators.validUser();
        UserManagementPage.userNameInput().type(user.name);
        UserManagementPage.userRoleSelect().select(user.role);
        UserManagementPage.userAgeInput().type(user.age);
        UserManagementPage.userGenderRadio(Gender.Male).check();
        UserManagementPage.userEmailInput().type(existingUser.email);
        saveUser();
        cy.wait("@addUser").then((interception) => {
          expect(interception.response?.statusCode).to.eq(409);
          expect(interception.response?.body.errors).to.include(UserErrorMessages.ExistingEmail);
        });
        UserManagementPage.formErrors().should("be.visible").and("have.text", UserErrorMessages.ExistingEmail);
      });
    });
  });

  context("Edit,Delete, Deactivate user", () => {
    it("Should edit existing user and update in the table", () => {
      login();

      UserManagementBuilders.GetUsers().then(({ body }: { body: User[] }) => {
        const user = body.find((u) => u.id === 1);
        expect(user).to.exist;
        const updatedUser = UserManagementGenerators.validUser();

        UserManagementPage.editButtonInRowById(user.id).click();
        UserManagementPage.userFormModal().should("be.visible");
        UserManagementPage.userNameInput().should("have.value", user.name);
        UserManagementPage.userRoleSelect().should("have.value", user.role);
        UserManagementPage.userAgeInput().should("have.value", String(user.age));
        UserManagementPage.userEmailInput().should("have.value", user.email);
        UserManagementPage.userGenderRadio(user.gender).should("be.checked");

        fillUserForm(updatedUser);

        cy.intercept("PUT", UserManagementEndpoints.Users(user.id)).as("editUser");

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
            status: Status.Active,
          });

          const responseSubscriptionsArray = res.subscriptions.split(",").map((s: string) => s.trim());
          expect(responseSubscriptionsArray).to.have.members(updatedUser.subscriptions);
        });

        UserManagementPage.userRowById(user.id).within(() => {
          cy.contains(updatedUser.name);
          cy.contains(updatedUser.role);
          cy.contains(updatedUser.age);
          cy.contains(updatedUser.email);
          cy.contains(updatedUser.gender);
          cy.contains(updatedUser.subscriptions[0]);
        });
      });
    });

    it("Should delete first user and remove from the table", () => {
      login();

      UserManagementBuilders.GetUsers().then(({ body: users }: { body: User[] }) => {
        const user = users[0];
        expect(user).to.exist;

        UserManagementPage.deleteButtonInRowById(user.id).click();
        UserManagementPage.confirmModal().should("be.visible");
        UserManagementPage.cancelDeleteButton().should("be.visible").click();
        UserManagementPage.confirmModal().should("not.be.visible");
        UserManagementPage.deleteButtonInRowById(user.id).click();
        UserManagementPage.confirmModal().should("be.visible");

        cy.intercept("DELETE", UserManagementEndpoints.Users(user.id)).as("deleteUser");

        UserManagementPage.confirmDeleteButton().should("be.visible").click();

        cy.wait("@deleteUser").then((interception) => {
          expect(interception.response?.statusCode).to.eq(200);
          expect(interception.response?.body).to.have.property("success", true);
        });

        UserManagementPage.userRowById(user.id).should("not.exist");

        UserManagementBuilders.GetUsers().then(({ body: updatedUsers }: { body: User[] }) => {
          const deletedUser = updatedUsers.find((u) => u.id === user.id);
          expect(deletedUser).to.be.undefined;
        });
      });
    });

    it("Should deactivate and activate user", () => {
      login();

      const userId = 1;

      cy.intercept("PATCH", UserManagementEndpoints.Status(userId)).as("toggleUserStatus");

      UserManagementPage.statusButtonInRowById(userId).click();

      cy.wait("@toggleUserStatus").then((interception) => {
        const requestedStatus = interception.request.body.status;
        expect(requestedStatus).to.be.oneOf([Status.Active, Status.Inactive]);
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.response?.body).to.have.property("status", requestedStatus);
      });

      UserManagementPage.statusCellInRowById(userId)
        .invoke("text")
        .then((text) => {
          expect([Status.Active, Status.Inactive]).to.include(text.trim());
        });

      UserManagementPage.statusButtonInRowById(userId).should("exist");
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
