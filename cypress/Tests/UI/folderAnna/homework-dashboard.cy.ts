describe('Describe actions on page', () => {
    beforeEach(() => {
        cy.visit('/Resources/htmls/CSS/homework.html')
    })
    
    context('Fill the User Form', () => {
        it('Should fill in the form fields', () => {
        cy.get('#username').should('be.visible').type('testuser').should('have.value', 'testuser')
        cy.get('#email').type('testuser@example.com').should('have.value', 'testuser@example.com')
        cy.get('select').select('Editor').should('have.value', 'editor')
        cy.get('#newsletter').check().should('be.checked')
        cy.get('button[type = "submit"]').contains("Submit").click()
        })
    })

    context('Interact with the User Table', () => {
      it('Should check User table "Edit" button', () => {
        cy.get('table.user-table tbody tr').should('have.length', 3)
        cy.get('table.user-table tbody tr:nth-child(1)').find("button").should('contain', 'Edit').click()
        cy.get('table.user-table tbody tr').eq(1).find("button").should('contain', 'Edit').click()
        cy.get('table.user-table tbody tr').eq(2).find("button").should("be.disabled")
        
      })
    })


    context('Navigation and Footer Checks', () => {
        it('Should assert sidebar contains exactly 3 links and footer text', () => {
          cy.get('aside.sidebar ul li a').should('have.length', 3)
          cy.get('.footer').contains('© 2025 TestCorp').should('have.text', '© 2025 TestCorp')
        })
    })


    context('Simulate and Interact with Modal', () => {
      it('Should iteract with modal', () => {
        cy.get('table.user-table tbody tr:nth-child(1)').find('button.small-btn').click()
        cy.get('#edit-modal').should('be.visible').contains('have.class', 'active')
        cy.get('#edit-modal h2').should('be.visible').should('contain', 'Edit User')
        cy.get('#edit-modal > button').should('be.visible').click()
        cy.get('#edit-modal').should('not.be.visible')
      })
  })



  })

