describe('Cypress Demo Test', () => {
  it('Visits the example page and checks content', () => {
    cy.visit('https://example.cypress.io')

    // Check for page title
    cy.title().should('include', 'Cypress')

    // Check for an element containing text
    cy.contains('Kitchen Sink').should('be.visible')

    // Click a link and validate navigation
    cy.contains('within').click()
    cy.url().should('include', '/commands/querying')

    // Check if a specific element exists
    cy.get('.query-btn').should('exist')
  })
})
