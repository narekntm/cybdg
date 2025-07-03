import { UserManagementPage } from "Cypress/Fixtures/UserManagementPage";
import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";

describe("User Management Suite", () => {
  let loginPositiveCase: UserManagementModels.Login;
  let loginNegativeCases: UserManagementModels.Login[] = [];
  let userFormPositiveCase: UserManagementModels.User;
  let userFormNegativeCases: UserManagementModels.User[] = [];

  function adminLogin(login: UserManagementModels.Login) {
    UserManagementPage.adminTitle().should("have.text", "Login as Admin");

    UserManagementPage.adminEmailLbl().should("have.text", "Email");
    UserManagementPage.adminEmailInput().should("have.attr", "required");
    UserManagementPage.adminEmailInput().should("be.visible").and("be.enabled").clear();
    if (login.email !== "") UserManagementPage.adminEmailInput().type(login.email);

    UserManagementPage.adminPasswordLbl().should("have.text", "Password");
    UserManagementPage.adminPasswordInput().should("have.attr", "required");
    UserManagementPage.adminPasswordInput().should("be.visible").and("be.enabled").clear();
    if (login.password !== "") UserManagementPage.adminPasswordInput().type(login.password);

    UserManagementPage.adminSubmitBtn().should("have.text", "Login").click();
  }

  function fillUserForm(user: UserManagementModels.User) {
    UserManagementPage.formNewUserTitle().should("have.text", "Add New User");
    UserManagementPage.fullNameLbl().should("have.text", "Full Name");
    UserManagementPage.fullNameInput().should("have.attr", "required");
    UserManagementPage.fullNameInput().should("be.visible").and("be.enabled").clear();
    if (user.name) UserManagementPage.fullNameInput().type(user.name);

    UserManagementPage.roleLbl().should("have.text", "Role");
    UserManagementPage.roleSelect().should("have.attr", "required");
    UserManagementPage.roleSelect().should("be.visible").and("be.enabled").select("Select");
    if (user.role) UserManagementPage.roleSelect().select(user.role);

    UserManagementPage.ageLbl().should("have.text", "Age");
    UserManagementPage.ageInput().should("be.visible").and("be.enabled").clear();
    if (user.age) UserManagementPage.ageInput().type(user.age.toString());

    UserManagementPage.emailLbl().should("have.text", "Email");
    UserManagementPage.emailInput().should("have.attr", "required");
    UserManagementPage.emailInput().should("be.visible").and("be.enabled").clear();
    if (user.email) UserManagementPage.emailInput().type(user.email);

    UserManagementPage.genderTitle().should("have.text", "Gender");
    if (user.gender) UserManagementPage.genderInput(user.gender).check();

    UserManagementPage.subscribeTitle().should("have.text", "Subscribe to");
    user.subscriptions.forEach((value) => {
      UserManagementPage.subscriptionInput(value).check();
    });

    UserManagementPage.userFormSubmitBtn().should("have.text", "Save");
  }

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCases = data.loginNegativeCases;
      userFormPositiveCase = data.userFormPositiveCase;
      userFormNegativeCases = data.userFormNegativeCases;
    });
  });

  beforeEach(() => {
    cy.log("Test is starting");
    cy.visit("/Resources/htmls/CSS/user_management.html");
  });

  it("Login as Admin, Positive case", () => {
    adminLogin(loginPositiveCase);

    UserManagementPage.logoutBtn().should("have.text", "Logout").click();
    UserManagementPage.adminEmailInput().should("have.text", "");
    UserManagementPage.adminPasswordInput().should("have.text", "");
    UserManagementPage.adminControls().should("not.be.visible");
  });

  describe("Login as Admin, Negative cases", () => {
    loginNegativeCases.forEach((login: UserManagementModels.Login) => {
      it(`Login as Admin, Negative case: email: ${login.email}`, () => {
        console.log("login.email: ", login.email);
        adminLogin(login);
        UserManagementPage.loginStatus().should("have.text", "Invalid credentials");
      });
    });
  });

  it("User Management Test, Positive case", () => {
    fillUserForm(userFormPositiveCase);

    UserManagementPage.userTableRows()
      .its("length")
      .then((count: number) => {
        UserManagementPage.userFormSubmitBtn().click();
        UserManagementPage.userTableRows().its("length").should("be.gt", count);
      });
  });

  describe("User Management Test, Negative cases", () => {
    userFormNegativeCases.forEach((user: UserManagementModels.User) => {
      it(`User Management Test, Negative case: user name: ${user.name}`, () => {
        fillUserForm(user);

        UserManagementPage.userTableRows()
          .its("length")
          .then((count: number) => {
            UserManagementPage.userFormSubmitBtn().click();
            UserManagementPage.userTableRows().its("length").should("be.eq", count);
            UserManagementPage.userFormErrors().should("be.visible");
          });
      });
    });
  });

  it("User Table", () => {
    UserManagementPage.userTableRows().should("have.length", 3);
    UserManagementPage.userTableColumnCount().should("have.length", 8);

    UserManagementPage.userTableHeader().each(($el: JQuery<HTMLElement>, index: number) => {
      UserManagementPage.userTableHeaderTd($el).should(
        "have.text",
        UserManagementModels.ColumnNames[UserManagementModels.Columns[index] as keyof typeof UserManagementModels.ColumnNames]
      );
    });
  });

  it("User table first row edit", () => {
    UserManagementPage.userTableRowTds(1).then((cells: JQuery<HTMLElement>) => {
      const user: UserManagementModels.User = {
        name: cells[UserManagementModels.Columns.Name].innerText,
        role: cells.eq(UserManagementModels.Columns.Role).text() as UserManagementModels.UserRole,
        age: Number(cells[UserManagementModels.Columns.Age].innerText),
        email: cells[UserManagementModels.Columns.Email].innerText,
        gender: cells.eq(UserManagementModels.Columns.Gender).text() as UserManagementModels.Gender,
        subscriptions: cells[UserManagementModels.Columns.Subscription].innerText.split(",") as UserManagementModels.Subscription[],
      };

      UserManagementPage.userTableRowEditButton(1)
        .should("have.text", UserManagementModels.ActionButtons.Edit)
        .should("be.visible")
        .click();

      UserManagementPage.fullNameInput().should("have.value", user.name);
      UserManagementPage.roleSelect().should("have.value", user.role);
      UserManagementPage.ageInput().should("have.value", user.age);
      UserManagementPage.emailInput().should("have.value", user.email);
      UserManagementPage.genderInput(user.gender).should("be.checked");

      user.subscriptions.forEach((value: string) => {
        UserManagementPage.subscriptionInput(value).should("be.checked");
      });
    });
  });

  it("User table first row toggle activate", () => {
    it("User table first row toggle activate", () => {
      UserManagementPage.userTableRowStatusButton(0).as("submitBtn");

      cy.get("@submitBtn")
        .should("be.visible")
        .invoke("text")
        .then(() => {
          cy.get("@submitBtn").should("have.text", UserManagementModels.ButtonAction.Deactivate);
          cy.get("@submitBtn").click();

          cy.wait("@patchUser").then((xhr) => {
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.response.statusMessage).to.eq("OK");
          });

          cy.get("@submitBtn").should("have.text", UserManagementModels.ButtonAction.Activate);
        });
    });
  });

  it("User table admin row delete", () => {
    UserManagementPage.userTableRowAdminDeleteButton().click();
    UserManagementPage.adminError().should("have.text", "Admin login required to delete Admin-level users.");
  });

  it("User table not admin row delete and cancel", () => {
    UserManagementPage.userTableRowDeleteButton(2).click();
    UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
    UserManagementPage.deleteModalConfirmBtn().should("be.visible");
    UserManagementPage.deleteModalCancelBtn().should("be.visible").click();
    UserManagementPage.confirmModal().should("not.be.visible");
  });

  it("User table not admin row delete and confirm", () => {
    UserManagementPage.userTableRowDeleteButton(2).click();

    UserManagementPage.deleteModalTitle().should("have.text", "Are you sure you want to delete this user?");
    UserManagementPage.deleteModalCancelBtn().should("be.visible");

    UserManagementPage.userTableRows()
      .its("length")
      .then((count: number) => {
        UserManagementPage.deleteModalConfirmBtn().should("be.visible").click();
        UserManagementPage.confirmModal().should("not.be.visible");
        UserManagementPage.userTableRows().its("length").should("be.lt", count);
      });
  });
});
