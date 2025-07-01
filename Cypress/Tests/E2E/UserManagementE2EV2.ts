import { UserManagementEndPointsV2 } from 'Cypress/Fixtures/EndPoints/UserManagementEndPointsV2';
import { ActionButtons, ButtonAction, ColumnNames, Columns, Gender, Login, User, UserRole, Subscription, Status } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementPageV2 } from "Cypress/Fixtures/Pages/UserManagementPageV2";

describe("User Management Suite", () => {
  let loginPositiveCase: Login;
  let loginNegativeCase: Login;
  let userFormPositiveCase: User;
  let userFormNegativeCase: User;

  const baseURL = "/";

  before(() => {
    cy.fixture("userData").then((data) => {
      loginPositiveCase = data.loginPositiveCase;
      loginNegativeCase = data.loginNegativeCase;
      userFormPositiveCase = data.userFormPositiveCase;
      userFormNegativeCase = data.userFormNegativeCases;
    });
  });

  beforeEach(() => {
    cy.visit(baseURL);

    cy.intercept({method: "POST", url: UserManagementEndPointsV2.adminLogin }).as('postAdmin');
    cy.intercept({method: "POST", url: UserManagementEndPointsV2.Users()}).as('postUser');
    cy.intercept({method: "DELETE", url: UserManagementEndPointsV2.Users(1)}).as('deleteUser');
    cy.intercept({method: "PUT", url: UserManagementEndPointsV2.Users(1)}).as('putUser');    
    cy.intercept({method: "PATCH", url: UserManagementEndPointsV2.Status(1)}).as('patchUser');
    cy.intercept({method: "POST",  url: UserManagementEndPointsV2.reset}).as("resetData"); 
    cy.intercept({method: "GET", url: UserManagementEndPointsV2.Users(1)}).as('getUser'); 
  });

  afterEach(() => {
    cy.request({ method: "POST", url: UserManagementEndPointsV2.reset });
  });

  function getUser(cells: JQuery<HTMLElement>): User {
    return {
      name: cells[Columns.Name].innerText.trim(),
      role: cells[Columns.Role].innerText.trim(),
      age: Number(cells[Columns.Age].innerText.trim()),
      email: cells[Columns.Email].innerText.trim(),
      gender: cells.eq(Columns.Gender).text().trim() as Gender,
      subscription: cells[Columns.Subscription].innerText.split(',').map(part => part.trim()),
      status: cells[Columns.Status].innerText.trim()
    };
  }

  function adminLogin(login: Login) {
    if (login.email !== '') {
      UserManagementPageV2.adminEmailInput().clear().type(login.email);
    }

    if (login.password !== '') {
      UserManagementPageV2.adminPasswordInput().clear().type(login.password);
    }
  }

  function fillUserForm(user: User) {
    if (user.name) UserManagementPageV2.fullNameInput().clear().type(user.name);
    if (user.role) UserManagementPageV2.roleSelect().select(user.role);
    if (user.age) UserManagementPageV2.ageInput().clear().type(user.age.toString());
    if (user.email) UserManagementPageV2.emailInput().clear().type(user.email);
    if (user.gender) UserManagementPageV2.genderInput(user.gender).check();

    user.subscription.forEach((value) => {
      UserManagementPageV2.subscriptionInput(value).check();
    });
  }

  context("Admin Login Suite", () => {
    it('Admin Login Modal Content Test', () => {
      UserManagementPageV2.loginBtn().should('be.visible').and('have.text', 'Login');
      UserManagementPageV2.adminStatus().should('be.visible').and('have.text', '🔒 Not Logged In');
      UserManagementPageV2.loginBtn().click();
      UserManagementPageV2.adminModal().should('be.visible');

      UserManagementPageV2.adminEmailLbl().should('be.visible').and("have.text", "Email");
      UserManagementPageV2.adminEmailInput().should("be.visible").and("be.enabled").and("have.attr", "required");

      UserManagementPageV2.adminPasswordLbl().should('be.visible').and("have.text", "Password");
      UserManagementPageV2.adminPasswordInput().should("be.visible").and("be.enabled").and("have.attr", "required");

      UserManagementPageV2.adminSubmitBtn().should('be.visible').and('have.text', 'Login');
      UserManagementPageV2.adminCancelBtn().should('be.visible').and('have.text', 'Cancel');
    });

    it("Login as Admin, Positive case", () => {
      UserManagementPageV2.loginBtn().click();
      UserManagementPageV2.adminTitle().should('be.visible').and("have.text", "Admin Login");

      adminLogin(loginPositiveCase);
      UserManagementPageV2.adminSubmitBtn().click();

      cy.wait('@postAdmin').then(xhr => {
        expect(xhr.request.body).to.include({
            email: loginPositiveCase.email,
            password: loginPositiveCase.password
          });        
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).deep.equal({success: true});
      });      

      UserManagementPageV2.adminModal().should('not.be.visible');
      UserManagementPageV2.adminSubmitBtn().should('not.be.visible');
      UserManagementPageV2.adminStatus().should('be.visible').and('have.text', 'Logged in as Admin');
      UserManagementPageV2.logoutBtn().should('be.visible');
    });

    it('Logout Admin', () => {
      UserManagementPageV2.loginBtn().click();
      adminLogin(loginPositiveCase);
      UserManagementPageV2.adminSubmitBtn().click();
      UserManagementPageV2.logoutBtn().click();
      UserManagementPageV2.loginBtn().should('be.visible').and('have.text', 'Login');
      UserManagementPageV2.adminStatus().should('be.visible').and('have.text', 'Not Logged In');
    });

    it('Login as Admin, Negative case', () => {
      UserManagementPageV2.loginBtn().click();

      adminLogin(loginNegativeCase);
      UserManagementPageV2.adminSubmitBtn().click();
      cy.wait('@postAdmin').then(xhr => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.statusMessage).to.eq('Unauthorized');
      });

      UserManagementPageV2.loginStatus().should('be.visible').and("have.text", "Invalid credentials.");
    });

    it('Cancel Admin Login', () => {
      UserManagementPageV2.loginBtn().click();
      UserManagementPageV2.adminModal().should('be.visible');

      adminLogin(loginPositiveCase);

      UserManagementPageV2.adminCancelBtn().click();
      UserManagementPageV2.adminModal().should('not.be.visible');
      UserManagementPageV2.loginBtn().should('be.visible').and('have.text', 'Login');
      UserManagementPageV2.adminStatus().should('be.visible').and('have.text', '🔒 Not Logged In');
    });
  });

  context('Add New User Suite', () => {
    it('Admin Login Modal Content Test', () => {
      UserManagementPageV2.addNewUserBtn().should('be.visible').and('have.text', '+ Add New User');
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.newUserModal().should('be.visible');

      UserManagementPageV2.newUserTitle().should("have.text", "Add New User");
      UserManagementPageV2.fullNameLbl().should("have.text", "Full Name");
      UserManagementPageV2.fullNameInput().should("be.visible").and("be.enabled");

      UserManagementPageV2.roleLbl().should("have.text", "Role");
      UserManagementPageV2.roleSelect().should("be.visible").and("be.enabled");

      UserManagementPageV2.ageLbl().should("have.text", "Age");
      UserManagementPageV2.ageInput().should("be.visible").and("be.enabled");

      UserManagementPageV2.emailLbl().should("have.text", "Email");
      UserManagementPageV2.emailInput().should("be.visible").and("be.enabled");

      UserManagementPageV2.genderTitle().should("have.text", "Gender");
      UserManagementPageV2.subscribeTitle().should("have.text", "Subscribe to");

      UserManagementPageV2.userFormSubmitBtn().should('be.visible').and('have.text', 'Save');
      UserManagementPageV2.userFormCancelBtn().should('be.visible').and('have.text', 'Cancel');
    });

    it('Add a user, Positive case, submit', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.newUserModal().should('be.visible');

      fillUserForm(userFormPositiveCase);

      UserManagementPageV2.userTableRows().its("length").then((count: number) => {
        UserManagementPageV2.userFormSubmitBtn().click();
        cy.wait('@postUser').then((xhr) => {
          console.log('xhr', xhr);
          expect(xhr.response.statusCode).to.be.equal(200);
          expect(xhr.response.statusMessage).to.eq('OK');
        });

        UserManagementPageV2.userTableRows().its("length").should("be.gt", count);
        UserManagementPageV2.pageInfo().should('be.visible').and('have.text', `Page 1 of ${Math.ceil(count/5)}: (${count + 1} Users)`);
      });
    });

    it('Add a user, Positive case, cancel', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.newUserModal().should('be.visible');

      fillUserForm(userFormPositiveCase);
      UserManagementPageV2.userFormCancelBtn().click();
      UserManagementPageV2.newUserModal().should('not.be.visible');
    });

    it("Add an empty user", () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.newUserModal().should('be.visible');

      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.userFormErrors().should('be.visible');
      UserManagementPageV2.toastContainer().should('be.visible');
    });

    it('Add user with wrong name format', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.fullNameInput().clear().type('Wrong Name');
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.nameError().should('be.visible');
    });

    it('Add user with no role selecting', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.roleSelect().select('Select');
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.roleError().should('be.visible');
    });

    it('Add user with wrong age format', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.ageInput().clear().type('300');
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.ageError().should('be.visible');
    });

    it('Add user with no gender checked', () => {
      UserManagementPageV2.addNewUserBtn().click();
      UserManagementPageV2.fullNameInput().clear().type('LarisaYeremyan');
      UserManagementPageV2.userFormSubmitBtn().click();
      UserManagementPageV2.genderError().should('be.visible');
    });
  });

  context('User Table Suite', () => {
    it("User Table Test", () => {
      UserManagementPageV2.userTableRows().should("have.length", 3);
      UserManagementPageV2.userTableColumnCount().should("have.length", 8);

      UserManagementPageV2.userTableHeader().each(($el: JQuery<HTMLElement>, index: number) => {
        UserManagementPageV2.userTableHeaderTd($el).should("have.text", ColumnNames[Columns[index] as keyof typeof ColumnNames]);
      });

      UserManagementPageV2.paginationBar().should('be.visible');
      UserManagementPageV2.prevPageBtn().should('be.visible').and('have.text', 'Previous');
      UserManagementPageV2.nextPageBtn().should('be.visible').and('have.text', 'Next');

      UserManagementPageV2.userTableRows().its("length").then((count: number) => {
        UserManagementPageV2.pageInfo().should('be.visible').and('have.text', `Page 1 of ${Math.ceil(count/5)}: (${count} Users)`);
      });
    });
  });

  context('User Management Editing Suite', () => {
    it("User table first row edit", () => {
      UserManagementPageV2.userTableRowTds(0).then((cells: JQuery<HTMLElement>) => {
        const user: User = getUser(cells);

        UserManagementPageV2.userTableRowEditButton(0).should("have.text", ActionButtons.Edit).should("be.visible").click();
        UserManagementPageV2.newUserModal().should('be.visible');

        UserManagementPageV2.fullNameInput().should("have.value", user.name);
        UserManagementPageV2.roleSelect().should("have.value", user.role);
        UserManagementPageV2.ageInput().should("have.value", user.age);
        UserManagementPageV2.emailInput().should("have.value", user.email);
        UserManagementPageV2.genderInput(user.gender).should("be.checked");

        user.subscription.forEach((value: string) => {
          UserManagementPageV2.subscriptionInput(value).should("be.checked");
        });

        UserManagementPageV2.fullNameInput().clear().type('NewName');
        UserManagementPageV2.roleSelect().select(UserRole.Editor)
        UserManagementPageV2.ageInput().clear().type('23');
        UserManagementPageV2.emailInput().clear().type('aaaa@gmail.com');
        UserManagementPageV2.genderInput(Gender.Male).check();
        UserManagementPageV2.subscriptionInput(Subscription.Newsletter).check();
        UserManagementPageV2.subscriptionInput(Subscription.ProductUpdates).uncheck();

        UserManagementPageV2.userFormSubmitBtn().click();
        cy.wait('@putUser').then(xhr => {
          expect(xhr.response.statusCode).to.be.equal(200);
        });

        UserManagementPageV2.newUserModal().should('not.be.visible');

        UserManagementPageV2.userTableRowTds(0).eq(Columns.Name).should('have.text', 'NewName');
        UserManagementPageV2.userTableRowTds(0).eq(Columns.Role).should('have.text', 'Editor');
        UserManagementPageV2.userTableRowTds(0).eq(Columns.Age).should('have.text', '23');
        UserManagementPageV2.userTableRowTds(0).eq(Columns.Email).should('have.text', 'aaaa@gmail.com');
        UserManagementPageV2.userTableRowTds(0).eq(Columns.Gender).should('have.text', 'Male');
        UserManagementPageV2.userTableRowTds(0).eq(Columns.Subscription).should('have.text', 'Newsletter');
      });
    });
  });

  context('User Management Delete Suite', () => {
    it('Delete admin after login', () => {
      UserManagementPageV2.loginBtn().click();
      adminLogin(loginPositiveCase);
      UserManagementPageV2.adminSubmitBtn().click();
      UserManagementPageV2.userTableRowAdminDeleteButton().click();
      UserManagementPageV2.confirmModal().should('be.visible');
    });

    it('Delete admin without login', () => {
      UserManagementPageV2.userTableRowAdminDeleteButton().click();
      UserManagementPageV2.adminDeleteError().should('be.visible').and('have.text', 'Admin login required to delete Admin-level users.');
    });

    it("User table first row delete and cancel", () => {
      UserManagementPageV2.loginBtn().click();
      adminLogin(loginPositiveCase);
      UserManagementPageV2.adminSubmitBtn().click();

      UserManagementPageV2.userTableRowDeleteButton(0).click();
      UserManagementPageV2.confirmModal().should("be.visible");
      UserManagementPageV2.deleteModalTitle().contains("Are you sure you want to delete this user?");
      UserManagementPageV2.deleteModalConfirmBtn().should("be.visible");
      UserManagementPageV2.deleteModalCancelBtn().should("be.visible").click();
    });

    it("User table first row delete and confirm", () => {
      UserManagementPageV2.loginBtn().click();
      adminLogin(loginPositiveCase);

      UserManagementPageV2.adminSubmitBtn().click();
      UserManagementPageV2.userTableRowDeleteButton(0).click();

      UserManagementPageV2.confirmModal().should("be.visible");
      UserManagementPageV2.deleteModalTitle().contains("Are you sure you want to delete this user?");

      UserManagementPageV2.userTableRows().its("length").then((count: number) => {
        UserManagementPageV2.deleteModalConfirmBtn().should("be.visible").click();
        cy.wait('@deleteUser').then(xhr => {
          expect(xhr.response.statusCode).to.eq(200);
          expect(xhr.response.body).deep.equal({success: true}); 
        }); 
        UserManagementPageV2.userTableRows().its("length").should("be.lt", count);
      });
    });
  });

  context('User Management Status Toggle Suite', () => {
    it("User table first row toggle activate", () => {
      UserManagementPageV2.userTableRowStatusButton(0).as('submitBtn');

      cy.get('@submitBtn').should("be.visible").invoke("text").then(() => {
        cy.get('@submitBtn').should("have.text", ButtonAction.Deactivate).click();
          cy.wait('@patchUser').then(xhr => {
              expect(xhr.response.statusCode).to.eq(200);
              expect(xhr.response.statusMessage).to.eq('OK');
          })

        cy.get('@submitBtn').should("have.text", ButtonAction.Activate);
      });
    });
  });

  context('User Management View Suite', () => {
    it('View User Test', () => {
      UserManagementPageV2.userTableRowTds(0).then((cells: JQuery<HTMLElement>) => {
        const user: User = getUser(cells);

        UserManagementPageV2.userTableRowViewButton(0).should("have.text", ActionButtons.View).should("be.visible").click();
        UserManagementPageV2.userProfileModal().should('be.visible');
        UserManagementPageV2.userImg().should('be.visible');

        UserManagementPageV2.userCaption().should('be.visible').and('have.text', user.name);

        UserManagementPageV2.userNameLbl().should('be.visible').and('have.text', 'Name:');
        UserManagementPageV2.userNameText().should('be.visible').and('have.text', user.name);

        UserManagementPageV2.userRoleLbl().should('be.visible').and('have.text', 'Role:');
        UserManagementPageV2.userRole().should('be.visible').and('have.text', user.role);

        UserManagementPageV2.userAgeLbl().should('be.visible').and('have.text', 'Age:');
        UserManagementPageV2.userAgeText().should('be.visible').and('have.text', user.age);

        UserManagementPageV2.userEmailLbl().should('be.visible').and('have.text', 'Email:');
        UserManagementPageV2.userEmailText().should('be.visible').and('have.text', user.email);

        UserManagementPageV2.userGenderLbl().should('be.visible').and('have.text', 'Gender:');
        UserManagementPageV2.userGenderText().should('be.visible').and('have.text', user.gender);

        UserManagementPageV2.userSubscriptionsLbl().should('be.visible').and('have.text', 'Subscriptions:');
        UserManagementPageV2.userSubscriptionsText().should('be.visible').and('have.text', user.subscription.join(', '));

        UserManagementPageV2.userStatusLbl().should('be.visible').and('have.text', 'Status:');
        UserManagementPageV2.userStatusText().should('be.visible').and('have.text', user.status);

        UserManagementPageV2.viewBackBtn().should('be.visible').and('have.text', '← Back');
        UserManagementPageV2.viewEditBtn().should('be.visible').and('have.text', '✎ Edit');
      });
    });

    it('Back from view', () => {
      UserManagementPageV2.userTableRowViewButton(0).click();
      UserManagementPageV2.userProfileModal().should('be.visible');
      UserManagementPageV2.viewBackBtn().click();
      UserManagementPageV2.userCard().should('be.visible');
    });

    it('Edit view', () => {
      UserManagementPageV2.userTableRowTds(0).then((cells: JQuery<HTMLElement>) => {
        const user: User = getUser(cells);

        UserManagementPageV2.userTableRowViewButton(0).click();
        cy.wait('@getUser').then(xhr => {
          expect(xhr.response.statusCode).to.be.equal(304);
        }); 
        UserManagementPageV2.userProfileModal().should('be.visible');
        UserManagementPageV2.viewEditBtn().should('be.visible').click();

        cy.get('#user-form input').each(($el) => {
          cy.wrap($el).should('be.visible');
        });

        cy.get('#user-form select').each(($el) => {
          cy.wrap($el).should('be.visible');
        });

        UserManagementPageV2.userNameInput().should("have.value", user.name);
        UserManagementPageV2.userRoleSelect().should("have.value", user.role);
        UserManagementPageV2.userAgeInput().should("have.value", user.age);
        UserManagementPageV2.userEmailInput().should("have.value", user.email);
        UserManagementPageV2.userGenderSelect().should("have.value", user.gender);
        UserManagementPageV2.userStatusSelect().should("have.value", user.status);

        user.subscription.forEach((value: string) => {
          UserManagementPageV2.subscriptionInput(value).should("be.checked");
        });

        UserManagementPageV2.editCancelBtn().should('be.visible').and('have.text', 'Cancel');
        UserManagementPageV2.editSaveBtn().should('be.visible').and('have.text', '💾 Save');
      });
    });

    it('Edit view, cancel', () => {
      UserManagementPageV2.userTableRowViewButton(0).click();
      cy.wait('@getUser').then(xhr => {
        expect(xhr.response.statusCode).to.be.equal(304);
      });  

      UserManagementPageV2.userProfileModal().should('be.visible');
      UserManagementPageV2.viewEditBtn().should('be.visible').click();
      UserManagementPageV2.editCancelBtn().should('be.visible').click();
      UserManagementPageV2.userCard().should('be.visible');
    });

    it('Edit view, save', () => {
      UserManagementPageV2.userTableRowViewButton(0).click();
      cy.wait('@getUser').then(xhr => {
        expect(xhr.response.statusCode).to.be.equal(304);
      });      
      UserManagementPageV2.userProfileModal().should('be.visible');
      UserManagementPageV2.viewEditBtn().click();
      
      UserManagementPageV2.editSaveBtn().click();

      cy.get('#user-form .value').each(($el) => {
        cy.wrap($el).should('be.visible');
      });
    });
  });

  context('Reset data Suite', () => {
    it('Reset data test', () => {
      UserManagementPageV2.resetBtn().click();
      UserManagementPageV2.resetModalCancelBtn().should("be.visible");
      UserManagementPageV2.resetModalConfirmBtn().should("be.visible").click();

      cy.wait("@resetData").then(xhr => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body.users).to.be.an("array").with.length(3);
      });

      UserManagementPageV2.userTableRows().should("have.length", 3);
    });
  });
});