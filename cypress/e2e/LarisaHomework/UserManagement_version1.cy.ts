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
    cy.visit('http://127.0.0.1:5500/resources/htmls/css/user_management.html');
  });

  it("Login as Admin, Positive case", () => {
    adminLogin(loginPositiveCase);
    UserManagementPage.logoutBtn().should('have.text', 'Logout').click();
  });

  it("Login as Admin, Negative case", () => {
    loginNegativeCases.forEach((login: Login) => {
      adminLogin(login);
      UserManagementPage.loginStatus().should("have.text", "Invalid credentials");
    });
  });

  it("User Management Test, Positive case", () => {
    fillUserForm(userFormPositiveData);

    UserManagementPage.userTableRows().its("length").then((count: number) => {
      UserManagementPage.userFormSubmitBtn().click();
      UserManagementPage.userTableRows().its("length").should("be.gt", count);
    });
  });

  it("User Management Test, Negative case", () => {
    userFormNegativeData.forEach((user: User) => {
      fillUserForm(user);

      UserManagementPage.userTableRows().its("length")
        .then((count: number) => {
          UserManagementPage.userFormSubmitBtn().click();
          UserManagementPage.userTableRows().its("length").should("be.eq", count);
          UserManagementPage.userFormErrors().should("be.visible");
        });
    });
  });

  it("User Table", () => {
    UserManagementPage.userTableRows().should("have.length", 3);
    UserManagementPage.userTableColumnCount().should("have.length", 8);

    UserManagementPage.userTableHeader().each(($el: JQuery<HTMLElement>, index: number) => {
      cy.wrap($el).should("have.text", ColumnNames[Columns[index] as keyof typeof ColumnNames]);
    });
  });

  it("User table first row edit", () => {
    UserManagementPage.userTableRows().then((rows: JQuery<HTMLElement>) => {
      cy.wrap(rows).first().find('td').then((cells: JQuery<HTMLElement>) => {
        
        const user: User = {
          name: cells.eq(Columns.Name).text().trim(),
          role: cells.eq(Columns.Role).text().trim(),
          age: Number(cells.eq(Columns.Age).text().trim()),
          email: cells.eq(Columns.Email).text().trim(),
          gender: cells.eq(Columns.Gender).text().trim() as Gender,
          subscription: cells.eq(Columns.Subscription).toArray().map(el => el.textContent?.trim() || '') ,          
        };

        cy.wrap(cells).find("button.edit-btn").should("have.text", ActionButtons.Edit).should("be.visible").click();

        UserManagementPage.firstNameInput().should("have.value", user.name);
        UserManagementPage.roleSelect().should("have.value", user.role);
        UserManagementPage.ageInput().should("have.value", user.age);
        UserManagementPage.emailInput().should("have.value", user.email);
        UserManagementPage.genderInput(userFormPositiveData.gender).should("be.checked");

        user.subscription.forEach((value: string) => {
          UserManagementPage.subscriptionInput(value).should("be.checked");
        });
      });
    });
  });

  it("User table first row toggle activate", () => {
    UserManagementPage.userTableRows().then((rows: JQuery<HTMLElement>) => {
      cy.wrap(rows).first().find("td").find("button.status-btn").as('submitBtn');
      
     cy.get('@submitBtn').should("be.visible").invoke("text").then((text) => {
        cy.get('@submitBtn').click();
        if (text === ButtonAction.Activate) {
          cy.get('@submitBtn').should("have.text", ButtonAction.Deactivate);
        } else {
          cy.get('@submitBtn').should("have.text", ButtonAction.Activate);
        }
      });
    });
  });

  it("User table admin row delete", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
      cy.wrap($row).find("td").eq(Columns.Role).then(($cell) => {
        if ($cell.text().trim() === UserRole.Admin) {
          cy.wrap($row).find("td").find("button.delete-btn").should("have.text", "Delete").should("be.visible").click();
          UserManagementPage.adminError().should("have.text", "Admin login required to delete Admin-level users.");
        }
      });
    });
  });

  it("User table not admin row delete and cancel", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
      cy.wrap($row).find("td").eq(Columns.Role).then(($cell) => {
        if ($cell.text().trim() !== UserRole.Admin) {
          cy.wrap($row).find("td").find("button.delete-btn").should("have.text", "Delete").should("be.visible").click();

          UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
          UserManagementPage.deleteModalConfirmBtn().should("be.visible");
          UserManagementPage.deleteModalCancelBtn().should("be.visible").click();
          UserManagementPage.confirmModal().should("not.be.visible");
        }
      });
    });
  });

  it("User table not admin row delete and confirm", () => {
    UserManagementPage.userTableRows().each(($row: JQuery<HTMLElement>) => {
      cy.wrap($row).find("td").eq(Columns.Role).then(($cell) => {
        if ($cell.text().trim() !== UserRole.Admin) {
          cy.wrap($row).find("td").find("button.delete-btn").should("have.text", "Delete").should("be.visible").click();

          UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
          UserManagementPage.deleteModalCancelBtn().should("be.visible");

          UserManagementPage.userTableRows().its("length")
            .then((count: number) => {
              UserManagementPage.deleteModalConfirmBtn().should("be.visible").click();
              UserManagementPage.confirmModal().should("not.be.visible");

              UserManagementPage.userTableRows().its("length").should("be.lt", count);
            });
        }
      });
    });
  });
});