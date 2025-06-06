describe('Login Page', () => {
    context('Guest User', () => {
      it('should not access dashboard', () => {
        console.log('Guest User test')
        cy.visit('/dashboard');
        cy.url().should('not.include', '/dashboard');
        cy.contains('Access Denied').should('be.visible');
      });
    });

    context('Regular User', () => {
      beforeEach(() => {
        cy.log('Login command');
        console.log('Regular User beforeEach')
      });

      it('should access dashboard with limited features', () => {
        console.log('Regular User test')
        cy.visit('/dashboard');
        cy.contains('Welcome, Regular User').should('be.visible');
        cy.get('.admin-only').should('not.exist');
      });
    });

    context('Admin User', () => {
      beforeEach(() => {
        cy.log('Login command');
        console.log('Admin User beforeEach')
      });

      it('should access dashboard with full features', () => {
        console.log('Admin User test')
        cy.visit('/dashboard');
        cy.contains('Welcome, Admin').should('be.visible');
        cy.get('.admin-only').should('exist');
      });
    });

    before(() => {
      cy.log('Login page test is started');
      console.log('Description before')
    });

    beforeEach(() => {
      console.log('Description beforeEach')
      cy.visit('/Login');
    });

    it('should load the login page correctly', () => {
      console.log('should load the login page correctly')
      cy.get('form').should('exist');
      cy.get('input[name="Email"]').should('be.visible');
      cy.get('input[name="Password"]').should('be.visible');
      cy.get('button[type="button"]').should('contain', 'Sign In');
    });
    
    it('should log in successfully with correct credentials', () => {
      console.log('should log in successfully with correct credentials')
      cy.get('input[name="Email"]').type('111');
      cy.get('input[name="Password"]').type('111');
      cy.get('button[type="button"]').click();
      cy.contains('Welcome').should('be.visible');
    });

    it('should show error with invalid credentials', () => {
      console.log('should show error with invalid credentials')
      cy.get('input[name="Email"]').type('user@example.com');
      cy.get('input[name="Password"]').type('wrongPassword');
      cy.get('button[type="button"]').click();

      cy.contains('Invalid Username or Password').should('be.visible');
    });

    it('should prevent login with empty fields', () => {
      console.log('should prevent login with empty fields')
      cy.get('button[type="button"]').click();

      cy.get('input[name="Email"]:invalid').should('exist');
      cy.get('input[name="Password"]:invalid').should('exist');
    });

    it('should mask the password by default', () => {
      console.log('should mask the password by default')
      cy.get('input[name="Password"]').should('have.attr', 'type', 'password');
    });

    it('should retain email if "Remember Me" is checked', () => {
      console.log('should retain email if "Remember Me" is checked')
      cy.get('input[name="Email"]').type('rememberme@example.com');
      
      cy.get('input[type="checkbox"][name="Remember"]')
        .check({ force: true })
        .should('be.checked');

      cy.get('input[name="Password"]').type('somePassword');
      cy.get('button[type="button"]').click();

      cy.reload();
    });

    afterEach(() => {
      console.log('Description afterEach')
      cy.log('Login page test is finished');
    });

    after(() => {
      console.log('Description after')
      cy.log('Login test completed');
      cy.clearCookies();
      cy.clearLocalStorage();
    });  
});