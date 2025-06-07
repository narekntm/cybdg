describe('Describe actions on page', () => {
    beforeEach(() => {
        cy.visit('/Resources/htmls/CSS/homework.html')
    })
    
    context('Fill the User Form', () => {
        it('fill in the form fields', () => {
        cy.get('form > :nth-child(1) > input#username').type('testuser').should('have.value', 'testuser')
        cy.get('form > :nth-child(2) > input#email').type('testuser@example.com').should('have.value', 'testuser@example.com')
        cy.get('select').select('Editor').should('have.value', 'editor')
        cy.get('form > :nth-child(3) > input#newsletter').click()
        cy.get('form > :last-child > button.primary').click()
        })
    })

    context('Interact with the User Table', () => {
      it('Assert table contains 3 data rows', () => {
        cy.get('table > tbody').contains('tr:first-child')
        cy.get('table > tbody').contains('tr:nth-child(2)')
        cy.get('table > tbody').contains('tr:last-child')
        })


      it('Click “Edit” button on first and second row', () => {
        cy.get('table > tbody:first-child').find('tr:last-child > button').click()
        cy.get('table > tbody:nth-child(2)').find('tr:last-child > button').click()
        })

      it('Assert third row button is disabled', () => {
        cy.get('table > tbody:first-child').find('tr:last-child > button').click()
        cy.get('table > tbody:nth-child(2)').find('tr:last-child > button').click()
            }) 
    })



    context('Navigation and Footer Checks', () => {
        it('Assert sidebar contains exactly 3 links', () => {
          cy.get('aside > ul > li:first-child').contains('a', 'Dashboard')
          cy.get('aside > ul > li:nth-child(2)').contains('a', 'users')
          cy.get('aside > ul > li:last-child').contains('a', 'Dashboard')
          })        
    })

})
