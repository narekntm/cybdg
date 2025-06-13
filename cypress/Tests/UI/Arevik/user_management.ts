describe('User Management block', () => {

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/cybdg/Resources/htmls/CSS/user_management.html');
  });

  function adminLogin(email: string, password: string) {
    cy.get("#admin-email").type(email);
    cy.get("#admin-password").type(password);
    cy.get('#admin-login-form button[type="submit"]').click();
  }

  describe('Admin login', () => {

    it('Log in with valid data', () => {
      adminLogin("admin@example.com", "admin123");
      cy.get('#admin-controls').should('be.visible');
    });

    it('Log in with invalid email', () => {
      adminLogin("adminexample.com", "admin123");
      cy.get('#login-status').should('be.visible');
    })

    it('Try to log in with invalid password', () => {
      adminLogin("admin@example.com", "ahgfhfh");
      cy.get('#login-status').should('be.visible');
    })



    describe("Add new user", () => {

      it('get all selectors', () => {
        cy.get('#name');
        cy.get('#role');
        cy.get('#age');
        cy.get('#email');
        cy.get('#form-errors');
        cy.get('input[name="gender"][value="Male"]');
        cy.get('input[name="gender"][value="Female"]');
        cy.get('input[name="gender"][value="Other"]');
        cy.get('input[name="subscribe"][value="Newsletter"]');
        cy.get('input[name="subscribe"][value="Product Updates"]');
        cy.get('#user-form button[type="submit"]');
        cy.get('label[for="name"]');
        cy.get('label[for="role"]');
        cy.get('label[for="age"]');
        cy.get('label[for="email"]');
      });

      it('adds a new user', () => {
        cy.get('#name').type('Arevik');
        cy.get('#role').select('Editor');
        cy.get('#age').type('29');
        cy.get('#email').type('arevik@example.com');
        cy.get('input[name="gender"][value="Female"]').check();
        cy.get('input[name="subscribe"][value="Newsletter"]').check();
        cy.get('#user-form .btn-primary').click();

        cy.get('#user-table tbody tr').last().within(() => {
          cy.get('td').eq(0).should('have.text', 'Arevik');
          cy.get('td').eq(1).should('have.text', 'Editor');
          cy.get('td').eq(2).should('have.text', '29');
          cy.get('td').eq(3).should('have.text', 'arevik@example.com');
          cy.get('td').eq(4).should('have.text', 'Female');
          cy.get('td').eq(5).should('contain.text', 'Newsletter');
        });
      });

      it('Should show validation errors when saving with empty fields', () => {
        cy.get('#user-form').within(() => {
          cy.get('button[type="submit"]').click();

          cy.get('#form-errors')
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
  });
});
