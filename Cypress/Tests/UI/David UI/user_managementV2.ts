import { UserManagementBuilders } from "Builders/David Builders/UserManagementBuilders";
import { UserManagementGenerators } from "Generators/David Generators/UserManagementGenerators";
import { UserManagementMethods } from "Methods/David Methods/UserManagementMethods";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
import { UserManagementPage } from "Pages/David Pages/UserManagementPage";

describe("Auth", () => {
  beforeEach(() => {
    UserManagementBuilders.ResetData();
    cy.visit("/");
  });

  context("Negative cases", () => {
    it("Empty fields", () => {
      UserManagementMethods.AuthV2({});
      UserManagementPage.invalidCredentials().should("be.visible");
    });
    it("Wrong email", () => {
      UserManagementMethods.AuthV2({ password: UserManagementGenerators.adminCredentials.password });
      UserManagementPage.invalidCredentials().should("be.visible");
    });
    it("Wrong password", () => {
      UserManagementMethods.AuthV2({ email: UserManagementGenerators.adminCredentials.login });
      UserManagementPage.invalidCredentials().should("be.visible");
    });
  });
  context("Positive cases", () => {
    it("Should log in and delete admin", () => {
      UserManagementMethods.AuthV2({
        email: UserManagementGenerators.adminCredentials.login,
        password: UserManagementGenerators.adminCredentials.password,
      });
      UserManagementPage.AboutSiteButton().should("be.visible");
      UserManagementMethods.adminUserDeleteAsAdmin();
      UserManagementMethods.logoutV2();
    });
  });
});

describe("Add New user section", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Positive cases", () => {
    const users: UserManagementModels.User[] = [];

    for (let i = 0; i < 50; i++) {
      const user = UserManagementGenerators.generatedUsers();
      user.email = `user${i}@mails.com`;
      users.push(user);
    }
    before(() => {
      UserManagementBuilders.ResetData();
      UserManagementBuilders.seedData(users);
    });
    it("Should check pagination work", () => {
      const defaultUserCount = 3;
      const seededUsersCount = users.length;
      const expectedUserCount = defaultUserCount + seededUsersCount;
      const emails = [...users.map((user) => user.email), "alice@site.com", "bob@site.com", "eve@site.com"].filter(Boolean);
      const seenEmails = new Set();

      UserManagementPage.paginationInfo()
        .should("be.visible")
        .and("contain.text", `Page 1 of ${Math.ceil(expectedUserCount / 5)}: (${expectedUserCount} Users)`);

      UserManagementPage.prevPageButton().should("be.disabled");
      UserManagementPage.nextPageButton().should("be.enabled");

      function checkPage() {
        cy.get("tbody tr").each(($tr) => {
          cy.wrap($tr)
            .find("td")
            .eq(3)
            .invoke("text")
            .then((text) => {
              seenEmails.add(text.trim());
            });
        });

        UserManagementPage.nextPageButton().then(($btn) => {
          if (!$btn.is(":disabled")) {
            cy.wrap($btn).click();
            checkPage();
          } else {
            cy.wrap(null).then(() => {
              expect(Array.from(seenEmails)).to.have.members(emails);
            });
          }
        });
      }
      checkPage();
    });
    it("Should check all positive cases with this section", () => {
      UserManagementPage.newUserButtonPopUpOpen().click();
      UserManagementPage.nameField().type(UserManagementGenerators.validUser.name);
      UserManagementPage.nameField().should("have.value", UserManagementGenerators.validUser.name);
      UserManagementPage.roleField().select("");
      UserManagementPage.roleOptionAdminV2().should("be.visible");
      UserManagementPage.roleOptionEditorV2().should("be.visible");
      UserManagementPage.roleOptionViewerV2().should("be.visible");
      UserManagementPage.roleField().select(UserManagementGenerators.validUser.role);
      UserManagementPage.roleField().should("have.value", UserManagementGenerators.validUser.role);
      UserManagementPage.ageField().type(String(UserManagementGenerators.validUser.age));
      UserManagementPage.ageField().should("have.value", UserManagementGenerators.validUser.age);
      UserManagementPage.emailField().type(UserManagementGenerators.validUser.email);
      UserManagementPage.emailField().should("have.value", UserManagementGenerators.validUser.email);
      UserManagementPage.genderMaleRadioButton().should("not.be.checked").check();
      UserManagementPage.genderMaleRadioButton().should("be.checked");
      UserManagementPage.productUpdatesCheckbox().should("not.be.checked").check();
      UserManagementPage.productUpdatesCheckbox().should("be.checked");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.successPopUp().should("be.visible");
      UserManagementPage.showButtonInTable(0).click();
      UserManagementPage.userViewCard().should("be.visible");
      UserManagementPage.userViewCardInfo()
        .should("be.visible")
        .within(() => {
          UserManagementPage.userCardName().should("be.visible");
          UserManagementPage.userCardRole().should("be.visible");
          UserManagementPage.userCardAge().should("be.visible");
          UserManagementPage.userCardEmail().should("be.visible");
          UserManagementPage.userCardGender().should("be.visible");
          UserManagementPage.userCardSubscriptions().should("be.visible");
          UserManagementPage.userCardStatus().should("be.visible");
        });
      UserManagementPage.userCardEditButton().click();
      UserManagementPage.userCardNameInput().should("have.value", "Alice");
      UserManagementPage.userCardRoleSelect().should("have.value", "Admin");
      UserManagementPage.userCardAgeInput().should("have.value", "30");
      UserManagementPage.userCardEmailInput().should("have.value", "alice@site.com");
      UserManagementPage.userCardGenderSelect().should("have.value", "Female");
      UserManagementPage.userCardNewsletterCheckbox().should("be.checked");
      UserManagementPage.userCardProductUpdatesCheckbox().should("not.be.checked");
      UserManagementPage.userCardStatusSelect().should("have.value", "Active");
      UserManagementPage.userCardSaveButton().click();
      UserManagementPage.successPopUp().should("be.visible");
      UserManagementPage.userCardBackButton().click();
      UserManagementPage.userViewCardInfo().should("not.be.visible");
    });
  });
  context("Negative cases", () => {
    it("Empty fields", () => {
      UserManagementMethods.fillUserFormV2({});
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.nameFieldError().should("be.visible");
      UserManagementPage.roleFieldError().should("be.visible");
      UserManagementPage.ageFieldError().should("be.visible");
      UserManagementPage.emailFieldError().should("be.visible");
      UserManagementPage.genderFieldError().should("be.visible");
    });
    it("Only name", () => {
      UserManagementMethods.fillUserFormV2({ name: "qwerty" });
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.roleFieldError().should("be.visible");
      UserManagementPage.ageFieldError().should("be.visible");
      UserManagementPage.emailFieldError().should("be.visible");
      UserManagementPage.genderFieldError().should("be.visible");
    });
    it("Name requirements", () => {
      UserManagementPage.newUserButtonPopUpOpen().click();
      UserManagementPage.nameField().type("    ");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.nameFieldError().should("be.visible");
      UserManagementPage.nameField().clear();
      UserManagementPage.nameField().type("$Joe$");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.nameFieldError().should("be.visible");
      UserManagementPage.nameField().clear();
      UserManagementPage.nameField().type("12345");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.nameFieldError().should("be.visible");
      UserManagementPage.nameField().clear();
      UserManagementPage.nameField().type("qwertyqwertyqwertyqwerty");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.nameFieldError().should("be.visible");
    });
    it("Without role", () => {
      UserManagementMethods.fillUserFormV2({
        name: "qwerty",
        age: "18",
        email: "qwerty@aa.aa",
        gender: "Male",
        subscribtion: "Newsletter",
      });
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.roleFieldError().should("be.visible");
    });
    it("Without age", () => {
      UserManagementMethods.fillUserFormV2({
        name: "qwerty",
        role: "Editor",
        email: "qwerty@aa.aa",
        gender: "Male",
        subscribtion: "Newsletter",
      });
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.ageFieldError().should("be.visible");
    });
    it("Age requirements", () => {
      UserManagementPage.newUserButtonPopUpOpen().click();
      UserManagementPage.ageField().type("   ");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.ageFieldError().should("be.visible");
      UserManagementPage.ageField().clear();
      UserManagementPage.ageField().type("0");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.ageFieldError().should("be.visible");
      UserManagementPage.ageField().clear();
      UserManagementPage.ageField().type("100");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.ageFieldError().should("be.visible");
    });
    it("Without Email", () => {
      UserManagementMethods.fillUserFormV2({ name: "qwerty", role: "Editor", age: "22", gender: "Male", subscribtion: "Newsletter" });
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.emailFieldError().should("be.visible");
    });
    it("Email requirements", () => {
      UserManagementPage.newUserButtonPopUpOpen().click();
      UserManagementPage.nameField().type("     ");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.emailFieldError().should("be.visible");
      UserManagementPage.nameField().clear();
      UserManagementPage.nameField().type("aaaa@mail");
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.emailFieldError().should("be.visible");
      UserManagementPage.nameField().clear();
    });
    it("Without gender", () => {
      UserManagementMethods.fillUserFormV2({
        name: "qwerty",
        role: "Editor",
        age: "23",
        email: "qwerty@aa.aa",
        subscribtion: "Newsletter",
      });
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.genderFieldError().should("be.visible");
    });
  });
});
describe("User table section", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Positive cases", () => {
    it("Should check user edit", () => {
      UserManagementPage.resetButton().click();
      UserManagementPage.confirmResetButton().click();
      UserManagementPage.firstEditButtonInTable().click();
      UserManagementPage.nameField().should("have.value", "Alice");
      UserManagementPage.roleField().should("have.value", "Admin");
      UserManagementPage.ageField().should("have.value", 30);
      UserManagementPage.emailField().should("have.value", "alice@site.com");
      UserManagementPage.genderFemaleRadioButton().should("be.checked");
      UserManagementPage.newsletterCheckbox().should("be.checked");
      UserManagementPage.nameField().clear().type(UserManagementGenerators.validUser.name);
      UserManagementPage.roleField().select(UserManagementGenerators.validUser.role);
      UserManagementPage.ageField().clear().type(String(UserManagementGenerators.validUser.age));
      UserManagementPage.emailField().clear().type(UserManagementGenerators.validUser.email);
      UserManagementPage.genderOtherRadioButton().check();
      UserManagementPage.newsletterCheckbox().uncheck();
      UserManagementPage.productUpdatesCheckbox().check();
      UserManagementPage.addNewUserSaveButton().click();
      UserManagementPage.firstRowInUserTable().within(() => {
        UserManagementPage.nameDataUserTable().should("contain", UserManagementGenerators.validUser.name);
        UserManagementPage.roleDataUserTable().should("contain", UserManagementGenerators.validUser.role);
        UserManagementPage.ageDataUserTable().should("contain", UserManagementGenerators.validUser.age);
        UserManagementPage.emailDataUserTable().should("contain", UserManagementGenerators.validUser.email);
        UserManagementPage.genderDataUserTable().should("contain", "Other");
        UserManagementPage.subscriptionDataUserTable().should("contain", "Product Updates");
        UserManagementPage.statusDataUserTable().should("contain", "Active");
      });
      UserManagementPage.userTableFirstStatusChangeButton().click();
      UserManagementPage.firstRowInUserTable().within(() => {
        UserManagementPage.statusDataUserTable().should("contain", "Inactive");
      });
    });
    it("Should delete user", () => {
      UserManagementPage.userTableSecondDeleteButton().click();
      UserManagementPage.popUpConfirmDeleteButton().click();
      UserManagementPage.userTableRows().should("have.length", 2);
    });
  });
  context("Negative cases", () => {
    it("Delete admin", () => {
      UserManagementPage.resetButton().click();
      UserManagementPage.confirmResetButton().click();
      UserManagementPage.userTableFirstDeleteButton().click();
      UserManagementPage.adminDeleteError().should("be.visible");
    });
  });
});
