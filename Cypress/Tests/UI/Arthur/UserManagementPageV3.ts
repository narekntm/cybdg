import Chance from "chance";
import { UserManagementBuilders } from "Builders/Arthur/UserManagementBuilders";
import { fillUserForm } from "Cypress/Support/Helpers/Arthur/UserManagementPageHelpers";
import { UserManagementEndpoints } from "EndPoints/Arthur/UserManagementEndpoints";
import { UserManagementGenerators } from "Generators/Arthur/UserManagementGenerator";
import { Gender, Role, Status, Subscription, UserErrorMessages, UserInput, UserStatusMessages } from "Models/Arthur/UserManagementModels";
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

  // function fillUserForm(user: UserFormData) {
  //   UserManagementPage.addNewUserButton().click();
  //   UserManagementPage.userNameInput().clear().type(user.name);
  //   UserManagementPage.userRoleSelect().select(user.role);
  //   UserManagementPage.userAgeInput().clear().type(user.age);
  //   UserManagementPage.userEmailInput().clear().type(user.email);
  //   if (user.gender) {
  //     UserManagementPage.userGenderRadio(user.gender).check();
  //   }

  //   if (user.subscriptions && user.subscriptions.length > 0) {
  //     user.subscriptions.forEach((sub) => {
  //       UserManagementPage.userSubscriptionCheckbox(sub).uncheck().check();
  //     });
  //   }
  // }

  // function editUserForm(user: UserFormData) {
  //   UserManagementPage.userNameInput().clear().type(user.name);
  //   UserManagementPage.userRoleSelect().select(user.role);
  //   UserManagementPage.userAgeInput().clear().type(user.age);
  //   UserManagementPage.userEmailInput().clear().type(user.email);
  //   UserManagementPage.genderSelect().select(user.gender);
  //   UserManagementPage.productCheckbox().check();
  // }

  const saveUser = () => UserManagementPage.saveButton().contains("Save").click();

  context("Admin auth test cases", () => {
    it("Login with valid credentials", () => {
      login();
      UserManagementPage.adminStatusText().should("contain", UserStatusMessages.LoggedInAsAdmin);
      UserManagementPage.logoutButton().should("be.visible").contains("Logout");
    });

    it("Check login with invalid credentials", () => {
      login("invalid@admin.test", "wrongpassword");
      UserManagementPage.loginStatus().should("be.visible").contains(UserErrorMessages.InvalidCredentials);
    });

    it("Verify that the delete button is working after login", () => {
      login();
      UserManagementPage.deleteButtonInRowByRole("Admin").click();
      UserManagementPage.confirmModal().should("be.visible");
    });

    it("Should check error message on delete button without login", () => {
      UserManagementPage.deleteButtonInRowByRole("Admin").click();
      UserManagementPage.deleteError().should("be.visible").and("contain", UserErrorMessages.AdminDeleteError);
    });
  });

  context("Adding new user", () => {
    it("Should add user with valid input", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.validUser());
      saveUser();
      UserManagementPage.toastContainer().should("be.visible").and("contain.text", UserStatusMessages.AddNewUserMessage);
    });

    it("Should submit form with all fields empty", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      saveUser();

      UserManagementPage.formErrors().should("be.visible");
      UserManagementPage.formErrors().within(() => {
        cy.contains(UserErrorMessages.EmptyName).should("exist");
        cy.contains(UserErrorMessages.EmptyRole).should("exist");
        cy.contains(UserErrorMessages.InvalidAge).should("exist");
        cy.contains(UserErrorMessages.InvalidEmail).should("exist");
        cy.contains(UserErrorMessages.EmptyGender).should("exist");
      });

      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when name contains symbols", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withSymbolsInName());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.EmptyName);
    });

    it("Should show error when name contains numbers", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withNumbersInName());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.EmptyName);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when name is too long", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withTooLongName());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.EmptyName);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when no @ symbol", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withEmailMissingAt());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.InvalidEmail);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when no domain", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withEmailMissingDomain());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.InvalidEmail);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when no username part", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withEmailMissingUsername());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.InvalidEmail);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error when gender is not selected", () => {
      login();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withEmptyGender());
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.EmptyGender);
      UserManagementPage.toastContainer().should("be.visible");
    });

    it("Should show error message when email already exists", () => {
      login();
      const user = UserManagementGenerators.validUser();
      UserManagementPage.addNewUserButton().click();
      fillUserForm(user);
      saveUser();
      UserManagementPage.toastContainer().should("be.visible").and("contain.text", UserStatusMessages.AddNewUserMessage);
      UserManagementPage.addNewUserButton().click();
      fillUserForm(UserManagementGenerators.withDuplicateEmail(user.email));
      saveUser();
      UserManagementPage.formErrors().should("be.visible").contains(UserErrorMessages.ExistingEmail);
      UserManagementPage.toastContainer().should("be.visible").and("text", UserErrorMessages.ExistingEmail);
    });
  });

  context("Edit,Delete, Deactivate user", () => {
    it("Should edit existing user and update in the table", () => {
      const updatedUser = UserManagementGenerators.validUser();
      login();
      UserManagementPage.userRows()
        .first()
        .within(() => {
          UserManagementPage.firstEditButton().click();
        });
      fillUserForm(updatedUser);
      saveUser();
      UserManagementPage.toastContainer().should("be.visible").and("contain.text", UserStatusMessages.UpdatedUserMainPage);
      UserManagementPage.userRowByName(updatedUser.name).within(() => {
        cy.contains(updatedUser.role);
        cy.contains(updatedUser.age);
        cy.contains(updatedUser.email);
        cy.contains(updatedUser.gender);
        cy.contains(updatedUser.subscriptions[0]);
      });
    });

    it("Should delete existing user and remove from the table", () => {
      login();
      UserManagementPage.firstDeleteButton().click();
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.cancelDeleteButton().click();
      UserManagementPage.confirmModal().should("not.be.visible");
      UserManagementPage.firstDeleteButton().click();
      UserManagementPage.confirmModal().should("be.visible");
      UserManagementPage.confirmDeleteButton().click();
      UserManagementPage.userRows().should("have.length.lessThan", 3);
    });

    it("Should deactivate and activate user", () => {
      login();

      UserManagementPage.userRows()
        .first()
        .then(($row) => {
          const username = $row.find("td").eq(0).text().trim();
          const statusText = $row.find("td").eq(6).text().trim();
          if (statusText === Status.Active.toString()) {
            UserManagementPage.deactivateButtonInRow(username).click();
            UserManagementPage.statusCellInRow(username).should("contain", Status.Inactive);

            UserManagementPage.activateButtonInRow(username).click();
            UserManagementPage.statusCellInRow(username).should("contain", Status.Active);

            UserManagementPage.deactivateButtonInRow(username).should("exist");
          } else if (statusText === Status.Inactive.toString()) {
            UserManagementPage.activateButtonInRow(username).click();
            UserManagementPage.statusCellInRow(username).should("contain", Status.Active);
            UserManagementPage.deactivateButtonInRow(username).click();
            UserManagementPage.statusCellInRow(username).should("contain", Status.Inactive);
            UserManagementPage.activateButtonInRow(username).should("exist");
          } else {
            throw new Error(`Unexpected user status: ${statusText}`);
          }
        });
    });
  });

  context("User detail page", () => {
    it("Should display mocked user data and check it", () => {
      const mockedUser = {
        ...UserManagementGenerators.validUser(),
        subscriptions: UserManagementGenerators.validUser().subscriptions.join(", "),
        status: Status.Active,
      };

      cy.intercept("GET", UserManagementEndpoints.Users(1), {
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

    it("Should seed 50 users and verify total user count is 53", () => {
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

      UserManagementPage.paginationInfo()
        .should("be.visible")
        .and("contain.text", `Page 1 of ${Math.ceil((3 + users.length) / 5)}: (${3 + users.length} Users)`);

      UserManagementPage.prevPage().should("be.disabled");
      UserManagementPage.nextPage().should("be.enabled");

      const emails = [...users.map((u) => u.email), "alice@site.com", "bob@site.com", "eve@site.com"];

      const pageCount = Math.ceil((3 + users.length) / 5);

      for (let i = 0; i < pageCount; i++) {
        cy.get("tbody tr").each((tr) => {
          cy.wrap(tr)
            .find("td")
            .eq(3)
            .invoke("text")
            .then((email) => {
              expect(emails.includes(email)).to.be.true;
            });
        });

        if (i < pageCount - 1) {
          UserManagementPage.nextPage().should("not.be.disabled").click();
        }
      }
    });
  });
});
