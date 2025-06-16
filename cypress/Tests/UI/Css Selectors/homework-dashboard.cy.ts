import { AdminDashboardPage } from "Cypress/fixtures/Pages/AdminDashboardPage"
describe('Admin Dashboard', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/homework.html')
    });
    it('1. Fill the User Form', () => {
        AdminDashboardPage.usernameInput().type('testuser')
        AdminDashboardPage.emailInput().type('testuser@example.com')
        AdminDashboardPage.roleDropdown().select('editor')
        AdminDashboardPage.subscriptionCheckbox().check()
        AdminDashboardPage.submitBtn().click()
    })
    it('2. Interact with the User Table', () => {
        AdminDashboardPage.userTable().find('tbody').find('tr').should('have.length', 3)
        AdminDashboardPage.userTable().find('tbody').find('tr').eq(0).get('.btn.small-btn').contains('Edit').click()
        AdminDashboardPage.userTable().find('tbody').find('tr').eq(1).get('.btn.small-btn').contains('Edit').click()
        AdminDashboardPage.userTable().find('tbody').find('tr').eq(2).get('.btn.small-btn:disabled')
    })
    it('3. Navigation and Footer Checks', () => {
        AdminDashboardPage.sidebarSubSections().should('have.length', 3)
        AdminDashboardPage.dashboardFooter().should('contain', '© 2025 TestCorp')
    })
    it('4. Simulate and Interact with Modal', () => {
        AdminDashboardPage.userTable().find('tbody').find('tr').eq(0).get('.btn.small-btn').contains('Edit').click()
        AdminDashboardPage.userEditModal().should('be.visible').contains('Edit User')
        AdminDashboardPage.userEditModalCloseBtn().should('be.visible').click()
    })
    after(() => {
        cy.log('The test cases are successfully passed')
    })
})