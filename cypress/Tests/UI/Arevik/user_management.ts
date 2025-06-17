
import { UserManagementPage } from 'cypress/fixtures/pages/UserManagementPage';

describe('User Management block', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html');
  });

  function adminLogin(email: string, password: string) {

    UserManagementPage.adminEmailInput().type(email);

    UserManagementPage.adminPasswordInput().type(password);

    UserManagementPage.adminLoginButton().click();
  }

  describe('Admin login', () => {

    it('Log in with valid data', () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.adminControlsSection().should('be.visible');
    });

    it('Log in with invalid email', () => {
      adminLogin("adminexample.com", "admin123");
      UserManagementPage.loginStatusMessage().should('be.visible');
    })

    it('Try to log in with invalid password', () => {
      adminLogin("admin@example.com", "ahgfhfh");
      UserManagementPage.loginStatusMessage().should('be.visible');
    })



    describe("Add new user", () => {

      it('get all selectors', () => {

        UserManagementPage.nameInput();

        UserManagementPage.roleSelect();

        UserManagementPage.ageInput();

        UserManagementPage.emailInput();

        UserManagementPage.formErrors();

        UserManagementPage.genderMale();

        UserManagementPage.genderFemale();

        UserManagementPage.genderOther();

        UserManagementPage.subscribeNewsletter();

        UserManagementPage.subscribeProductUpdates();

        UserManagementPage.submitUserFormButton();

        UserManagementPage.labelName();

        UserManagementPage.labelRole();

        UserManagementPage.labelAge();

        UserManagementPage.labelEmail();
      });


      it('adds a new user', () => {
        UserManagementPage.nameInput().type('Arevik');
        UserManagementPage.roleSelect().select('Editor');
        UserManagementPage.ageInput().type('29');
        UserManagementPage.emailInput().type('arevik@example.com');
        UserManagementPage.genderFemale().check();
        UserManagementPage.subscribeNewsletter().check();
        UserManagementPage.submitUserFormButton().click();

        UserManagementPage.userTableLastRow().within(() => {
          cy.get('td').eq(0).should('have.text', 'Arevik');
          cy.get('td').eq(1).should('have.text', 'Editor');
          cy.get('td').eq(2).should('have.text', '29');
          cy.get('td').eq(3).should('have.text', 'arevik@example.com');
          cy.get('td').eq(4).should('have.text', 'Female');
          cy.get('td').eq(5).should('contain.text', 'Newsletter');
        });
      });


      it('Should show validation errors when saving with empty fields', () => {
        UserManagementPage.submitUserFormButton().click();

        UserManagementPage.formErrors()
          .should('be.visible')
          .within(() => {
            cy.contains('Name must be 1–20 letters only');
            cy.contains('Role is required');
            cy.contains('Age must be between 1 and 99');
            cy.contains('Valid email is required');
            cy.contains('Gender selection is required');
          });
      });
    });
  });


  describe('User Table', () => {

    it('Delete a user(admin)', () => {
      adminLogin('admin@example.com', 'admin123');

      UserManagementPage.logoutButton().should('be.visible');
      UserManagementPage.userTableRows().should('have.length', 3);
      UserManagementPage.firstUserDeleteButton().click();
      UserManagementPage.deleteConfirmationModal().should('be.visible');
      UserManagementPage.confirmDeleteButton().should('be.visible').click();
      UserManagementPage.userTableRows().should('have.length', 2);
    });

    it('Deactivate a user', () => {

      UserManagementPage.logoutButton().should('not.be.visible');
      UserManagementPage.firstUserStatusCell().should('have.text', 'Active');
      UserManagementPage.firstUserStatusButton().should('have.text', 'Deactivate').click();
      UserManagementPage.firstUserStatusButton().should('have.text', 'Activate');
      UserManagementPage.firstUserStatusCell().should('have.text', 'Inactive');
    });
  });
})
