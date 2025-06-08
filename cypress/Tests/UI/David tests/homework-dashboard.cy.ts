describe('Homework tests', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/homework.html')
    })
    context('Filling user form', () => {
        it('Should fill user form', () => {
            cy.get('#username').type('testuser')
            cy.get('#email').type('testuser@example.com')
            cy.get('#role').select('Editor')
            cy.get('#newsletter').check()
            cy.get('button[type="submit"]').click()
        })
    })
    context('User list', () => {
        it('Should check user list', () => {
            cy.get('table.table.user-table').find('tbody tr').should('have.length', 3)
            cy.get('button.btn.small-btn').eq(0).click()
            cy.get('#edit-modal').should('be.visible')
            cy.get('button.btn.close-modal').click()
            cy.get('#edit-modal').should('not.be.visible')
            cy.get('button.btn.small-btn').eq(1).click()
            cy.get('#edit-modal').should('be.visible')
            cy.get('button.btn.close-modal').click()
            cy.get('#edit-modal').should('not.be.visible')
            cy.get('button.btn.small-btn').eq(2).should('be.disabled')
        })
    })
    context('Navigation and Footer Checks', () => {
        it('Should check sidebar and navigations', () => {
            cy.get('aside.sidebar').find('ul li').should('have.length', 3)
            cy.get('div.footer').should('contain', '© 2025 TestCorp')
        })
    })
    context('Simulate and Interact with Modal', () => {
        it('Should do some actions with modal', () => {
            cy.get('button.btn.small-btn').eq(0).click()
            cy.get('#edit-modal').should('be.visible').should('contain', 'Edit User')
            cy.get('button.btn.close-modal').should('be.visible').click()
            cy.get('button.btn.close-modal').should('not.be.visible')
        })
    })
})