describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/homework.html')
    });
    it('1. Fill the User Form', () => {
        cy.get('#username').type('testuser')
        cy.get('#email').type('testuser@example.com')
        cy.get('#role').select('editor')
        cy.get('#newsletter').check()
        cy.get('[type="submit"]').click()
    })
    it('2. Interact with the User Table', () => {
        cy.get('.table.user-table').find('tbody').find('tr').should('have.length', 3)
        cy.get('.table.user-table').find('tbody').find('tr').eq(0).get('.btn.small-btn').contains('Edit').click()
        cy.get('.table.user-table').find('tbody').find('tr').eq(1).get('.btn.small-btn').contains('Edit').click()
        cy.get('.table.user-table').find('tbody').find('tr').eq(2).get('.btn.small-btn:disabled')
    })
    it('3. Navigation and Footer Checks', () => {
        cy.get('.sidebar').get('ul > li').should('have.length', 3)
        cy.get('.footer').should('contain', '© 2025 TestCorp')
    })
    it('4. Simulate and Interact with Modal', () => {
        cy.get('.table.user-table').find('tbody').find('tr').eq(0).get('.btn.small-btn').contains('Edit').click()
        cy.get('#edit-modal').should('be.visible').contains('Edit User')
        cy.get('.btn.close-modal').should('be.visible').click()
    })
    after(() => {
        cy.log('The test cases are successfully passed')
    })
})