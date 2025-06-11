describe ('homework html test cases', () => {
    beforeEach('visting the page', () => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/homework.html?#')
    });
    it('Fills the User Form', () => {
        cy.get('#username')
            .type('testuser')
            .should('have.value', 'testuser');
        cy.get('#email')
            .type('testuser@example.com')
            .should('have.value', 'testuser@example.com')
        cy.get('#role')
            .select('Editor')
        cy.get('#newsletter')
            .check()
        cy.get('.btn.primary')
            .click()
    });
    it('Interacts with the User Table', () => {
        cy.get('.user-table tbody tr')
            .should('have.length', 3);
        cy.get('.user-table tbody tr')
            .eq(0)
            .find('.btn.small-btn')
            .click()
        cy.get('.user-table tbody tr')
            .eq(1)
            .find('.btn.small-btn')
            .click()
        cy.get('.user-table tbody tr')
            .eq(2)
            .find('.btn.small-btn')
            .should('be.disabled')
    });
    it('Navigation and Footer Checks', ()=> {
        cy.get('.sidebar ul li a').should('have.length', 3)
        cy.get('.sidebar ul li')
            .eq(0)
            .find('a')
            .should('have.text', 'Dashboard');
        cy.get('.sidebar ul li')
            .eq(1)
            .find('a')
            .should('have.text', 'Users');
        cy.get('.sidebar ul li')
            .eq(2)
            .find('a')
            .should('have.text', 'Settings');
        cy.get('.footer')
            .should('be.visible')
            .and('contain', '© 2025 TestCorp');
    })
    it('Simulate and Interact with Modal', () => {
        cy.get('.user-table tbody tr')
            .eq(0)
            .find('.btn.small-btn')
            .click()

        cy.get('.modal')
            .should('be.visible')
        cy.get('#edit-modal h2')
            .should('contain', 'Edit User');

        cy.get('.close-modal')
            .should('exist')
            .and('be.visible');
        cy.get('.close-modal').click();

        cy.get('#edit-modal').should('not.be.visible');

    })
})