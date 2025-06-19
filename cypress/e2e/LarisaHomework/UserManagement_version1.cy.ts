import { UserManagementPage } from "../../fixtures/UserManagementPage";
import { Columns, ColumnNames, UserRole, ActionButtons, ButtonAction, Gender, User,Login } from "../../fixtures/Models/UserManagementModels";

describe("User Management Suite", () => {
  let loginPositiveCase: Login;
  let loginNegativeCases: Login[] = [];
  let userFormPositiveData: User;
  let userFormNegativeData: User[] = [];

  function adminLogin(login: Login) {
    UserManagementPage.adminTitle().should("have.text", "Login as Admin");

    UserManagementPage.adminEmailLbl().should("have.text", "Email");
    UserManagementPage.adminEmailInput().should("have.attr", "required");
    UserManagementPage.adminEmailInput().should("be.visible").and("be.enabled").clear();
    if (login.email !== '') UserManagementPage.adminEmailInput().type(login.email);

    UserManagementPage.adminPasswordLbl().should("have.text", "Password");
    UserManagementPage.adminPasswordInput().should("have.attr", "required");
    UserManagementPage.adminPasswordInput().should("be.visible").and("be.enabled").clear();
    if (login.password !== '') UserManagementPage.adminPasswordInput().type(login.password);

    UserManagementPage.adminSubmitBtn().should("have.text", "Login").click();
  }

  function fillUserForm(user: User) {
    UserManagementPage.formNewUserTitle().should("have.text", "Add New User");
    UserManagementPage.firstNameLbl().should("have.text", "Full Name");
    UserManagementPage.firstNameInput().should("have.attr", "required");
    UserManagementPage.firstNameInput().should("be.visible").and("be.enabled").clear();
    if (user.name) UserManagementPage.firstNameInput().type(user.name);

    UserManagementPage.roleLbl().should("have.text", "Role");
    UserManagementPage.roleSelect().should("have.attr", "required");
    UserManagementPage.roleSelect().should("be.visible").and("be.enabled").select('Select');
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
    user.subscription.forEach((value) => {
      UserManagementPage.subscriptionInput(value).check();
    });

    UserManagementPage.userFormSubmitBtn().should("have.text", "Save");
  }

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCases = data.loginNegativeCases;
      userFormPositiveData = data.userFormPositiveData;
      userFormNegativeData = data.userFormNegativeData;
    });
  });

  beforeEach(() => {
    cy.log("Test is starting");
    cy.visit("http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html");
  });

  it("Login as Admin, Positive case", () => {
    adminLogin(loginPositiveCase);

    UserManagementPage.logoutBtn().should('have.text', 'Logout').click();
    UserManagementPage.adminEmailInput().should('have.text', '');
    UserManagementPage.adminPasswordInput().should('have.text', '');
    UserManagementPage.adminControls().should('not.be.visible');
  });

  describe('Login as Admin, Negative cases', () => {
    loginNegativeCases.forEach((login: Login) => {
      it(`Login as Admin, Negative case: email: ${login.email}`, () => {
        console.log('login.email: ', login.email);
        adminLogin(login);
        UserManagementPage.loginStatus().should("have.text", "Invalid credentials");
      });
    });
  });

  it("User Management Test, Positive case", () => {
    fillUserForm(userFormPositiveData);

    UserManagementPage.userTableRows().its("length").then((count: number) => {
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.userTableRows().its("length").should("be.gt", count);
    });
  });

  describe('User Management Test, Negative cases', () => {
    userFormNegativeData.forEach((user: User) => {
      it(`User Management Test, Negative case: user name: ${user.name}`, () => {
          fillUserForm(user);

          UserManagementPage.userTableRows().its("length")
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
      UserManagementPage.userTableHeaderTd($el).should("have.text", ColumnNames[Columns[index] as keyof typeof ColumnNames]);
    });
  });

  it("User table first row edit", () => {
    UserManagementPage.userTableRowTds(1).then((cells: JQuery<HTMLElement>) => {
      const user: User = {
        name: cells[Columns.Name].innerText.trim(),
        role: cells[Columns.Role].innerText.trim(),
        age: Number(cells[Columns.Age].innerText.trim()),
        email: cells[Columns.Email].innerText.trim(),
        gender: cells.eq(Columns.Gender).text().trim() as Gender,
        subscription: cells[Columns.Subscription].innerText.split(',').map(part => part.trim())
      };

      UserManagementPage.userTableRowEditButton(1).should("have.text", ActionButtons.Edit).should("be.visible").click();

      UserManagementPage.firstNameInput().should("have.value", user.name);
      UserManagementPage.roleSelect().should("have.value", user.role);
      UserManagementPage.ageInput().should("have.value", user.age);
      UserManagementPage.emailInput().should("have.value", user.email);
      UserManagementPage.genderInput(user.gender).should("be.checked");

      user.subscription.forEach((value: string) => {
        UserManagementPage.subscriptionInput(value).should("be.checked");
      });
    });
  });

  it("User table first row toggle activate", () => {
    UserManagementPage.userTableRowStatusButton(0).as('submitBtn');

    cy.get('@submitBtn').should("be.visible").invoke("text").then((text) => {
      cy.get('@submitBtn').click();

      if (text === ButtonAction.Activate) {
        cy.get('@submitBtn').should("have.text", ButtonAction.Deactivate);
        cy.get('@submitBtn').click();
        cy.get('@submitBtn').should("have.text", ButtonAction.Activate);

      } else {
        cy.get('@submitBtn').should("have.text", ButtonAction.Activate);
        cy.get('@submitBtn').click();
        cy.get('@submitBtn').should("have.text", ButtonAction.Deactivate);        
      }
    });
  });

  it("User table admin row delete", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>, index: number) => {
      if ($row.text().includes(UserRole.Admin)) {
        UserManagementPage.userTableRowDeleteButton(index).should("have.text", "Delete").should("be.visible").click();
        UserManagementPage.adminError().should("have.text", "Admin login required to delete Admin-level users.");

        return false;
      }
    });
  });

  it("User table not admin row delete and cancel", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>, index: number) => {
      if (!$row.text().includes(UserRole.Admin)) {
        UserManagementPage.userTableRowDeleteButton(index).should("have.text", "Delete").should("be.visible").click();

        UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
        UserManagementPage.deleteModalConfirmBtn().should("be.visible");
        UserManagementPage.deleteModalCancelBtn().should("be.visible").click();
        UserManagementPage.confirmModal().should("not.be.visible");

        return false;
      }
    });
  });

  it("User table not admin row delete and confirm", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>, index: number) => {
      if (!$row.text().includes(UserRole.Admin)) {
        UserManagementPage.userTableRowDeleteButton(index).should("have.text", "Delete").should("be.visible").click();

        UserManagementPage.deleteModalTitle().should('have.text', 'Are you sure you want to delete this user?');
        UserManagementPage.deleteModalCancelBtn().should("be.visible");

        UserManagementPage.userTableRows().its("length")
          .then((count: number) => {
            UserManagementPage.deleteModalConfirmBtn().should("be.visible").click();
            UserManagementPage.confirmModal().should("not.be.visible");
            UserManagementPage.userTableRows().its("length").should("be.lt", count);
          });

        return false;
      }
    });
  });
});