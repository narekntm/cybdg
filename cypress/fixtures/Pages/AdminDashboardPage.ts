export class AdminDashboardPage {
    static usernameInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#username')

    static emailInput = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#email')

    static roleDropdown = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#role')

    static subscriptionCheckbox = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#newsletter')

    static submitBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('[type="submit"]')

    static userTable = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('.table.user-table')

    static userEditModal = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('#edit-modal')

    static userEditModalCloseBtn = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('.btn.close-modal')

    static sidebarSubSections = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('.sidebar').get('ul > li')

    static dashboardFooter = ():Cypress.Chainable<JQuery<HTMLElement>> => cy.get('.footer')
}