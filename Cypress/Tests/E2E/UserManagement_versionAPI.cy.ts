import { UserManagementPage } from "Cypress/Fixtures/UserManagementPage";
import { Columns, ColumnNames, UserRole, ActionButtons, ButtonAction, Gender, User,Login } from "Cypress/Fixtures/Models/UserManagementModels";

describe("User Management Suite", () => {
  let loginPositiveCase: Login;
  let loginNegativeCase: Login;
  let userFormPositiveCase: User;
  let userFormNegativeCase: User;

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

  const baseURL = "/";

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCase = data.loginNegativeCase;
      userFormPositiveCase = data.userFormPositiveCase;
      userFormNegativeCase = data.userFormNegativeCase;
    });
  });

  beforeEach(() => {
    cy.visit(baseURL);
  });

  afterEach(() => {
    //reset the state after each test
    cy.request({ method: "POST", url: "/api/reset" });
  });

  it("Login as Admin, Positive case", () => {
      cy.intercept({method: "POST", url: "/api/login"}).as('adminLoginPositive');

      adminLogin(loginPositiveCase);

      cy.wait('@adminLoginPositive').then(xhr => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({success: true});
      })

      UserManagementPage.logoutBtn().should('have.text', 'Logout').click();
      UserManagementPage.adminEmailInput().should('have.value', '');
      UserManagementPage.adminPasswordInput().should('have.value', '');
      UserManagementPage.adminControls().should('not.be.visible');
  });

  it('Login as Admin, Negative case', () => {
    cy.intercept({ method: "POST", url: "/api/login"}).as('adminLoginNegative');
    
    adminLogin(loginNegativeCase);

    cy.wait('@adminLoginNegative').then(xhr => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.statusMessage).to.eq('Unauthorized');
      expect(xhr.response.body).deep.equal({success: false});
    });

    UserManagementPage.loginStatus().should("have.text", "Invalid credentials");
  });

  it("User Management Test, Positive case", () => {
    cy.intercept({method: "POST", url: "/api/users"}).as('addNewUserPositive');

    fillUserForm(userFormPositiveCase);
    UserManagementPage.userTableRows().its("length").then((count: number) => {
      UserManagementPage.userFormSubmitBtn().click();
      
      cy.wait('@addNewUserPositive').then(xhr => {
        expect(xhr.response.statusCode).to.be.equal(200);
        expect(xhr.response.statusMessage).to.eq('OK');
      });
  
      UserManagementPage.userTableRows().its("length").should("be.gt", count);
    });
  });

  it('User Management Test, Negative case', () => {
    cy.intercept({method: "POST", url: "/api/users"}).as('addNewUserNegative')

      fillUserForm(userFormNegativeCase);
      UserManagementPage.userTableRows().its("length").then((count: number) => {
        UserManagementPage.userFormSubmitBtn().click();

        cy.wait('@addNewUserNegative').then(xhr => {
          expect(xhr.response.statusCode).to.be.equal(400);
          expect(xhr.response.body).deep.equal({success: false})
        });
  
        UserManagementPage.userTableRows().its("length").should("be.eq", count);
        UserManagementPage.userFormErrors().should("be.visible");
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
    cy.intercept({method: "PUT", url: "/api/users/1"}).as('updateUser');

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

      UserManagementPage.firstNameInput().clear().type('UpdatedName');
      UserManagementPage.ageInput().clear().type('23');

      UserManagementPage.userFormSubmitBtn().click();

      cy.wait('@updateUser').then(xhr => {
        expect(xhr.response.statusCode).to.be.equal(201);
        expect(xhr.response.body).deep.equal({success: true});
      });

      UserManagementPage.userTableRowTds(1).eq(Columns.Name).should('have.text', 'UpdatedName');
    });
  });

  it("User table first row toggle activate", () => {
    cy.intercept({method: "PATCH", url: "/api/users/1/status"}).as('ToggleButton');

    UserManagementPage.userTableRowStatusButton(0).as('submitBtn');

    cy.get('@submitBtn').should("be.visible").invoke("text").then((text) => {
      cy.get('@submitBtn').should("have.text", ButtonAction.Deactivate);
      cy.get('@submitBtn').click();

      cy.wait('@ToggleButton').then(xhr => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.statusMessage).to.eq('OK');
      })

      cy.get('@submitBtn').should("have.text", ButtonAction.Activate);
    });
  });

  it("User table admin row delete", () => {
    cy.intercept({method: "DELETE", url: "/api/users/1" }).as('DeleteAdminUser');
    UserManagementPage.userTableRowAdminDeleteButton().click();

    cy.wait('@DeleteAdminUser').then(xhr => {
       expect(xhr.response.statusCode).to.be.oneOf([403, 400, 409]);
       expect(xhr.response.body).deep.equal({success: false}); 
    })

    UserManagementPage.adminError().should("have.text", "Admin login required to delete Admin-level users.");
  });

  it("User table not admin row delete and cancel", () => {
    UserManagementPage.userTableRowNotAdminDeleteButton().click();
    UserManagementPage.deleteModalTitle().contains("Are you sure you want to delete this user?");
    UserManagementPage.deleteModalConfirmBtn().should("be.visible");
    UserManagementPage.deleteModalCancelBtn().should("be.visible").click();
  });

  it("User table not admin row delete and confirm", () => {
    cy.intercept({method: "DELETE", url: "/api/users/2" }).as('DeleteNotAdminUser');
    
    UserManagementPage.userTableRowNotAdminDeleteButton().click();
    UserManagementPage.deleteModalTitle().should('have.text', 'Are you sure you want to delete this user?');
    UserManagementPage.deleteModalCancelBtn().should("be.visible");

    let userTableRowCount: number;
    UserManagementPage.userTableRows().its("length").then((count: number) => {
      userTableRowCount = count;
      UserManagementPage.deleteModalConfirmBtn().should("be.visible").click();
  
      cy.wait('@DeleteNotAdminUser').then(xhr => {
         expect(xhr.response.statusCode).to.eq(200);
         expect(xhr.response.body).deep.equal({success: true}); 
      });
  
      UserManagementPage.userTableRows().its("length").should("be.lt", userTableRowCount);
    });
  });
});