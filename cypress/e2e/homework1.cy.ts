import { should } from "chai"

describe('Homework-my first Test', () => {
    it('should visit the page and check somy actions', ()=>{
        cy.visit('https://example.cypress.io/commands/querying')
        cy.get('button') //select element using tag name
        cy.get('.query-btn').should('contain', 'Button') // select element using class name
        cy.get('#query-btn').should('contain', 'Button') //select element using ID
        cy.get('#querying .well>button:first').should('contain', 'Button') // using CSS selectors just like jQuery
        cy.get('[data-test-id="test-example"]').should('have.class', 'example')  // using the attribute selector
        cy.get('#inputName').type('Hello World').should('have.value', 'Hello World') //type text into an input field and assert the value
        cy.get('.query-form').within(() => {   //use .within() to scope selections inside a form
            cy.get('#inputEmail').should('have.attr', 'placeholder', 'Email').type('test@gmail.com')
            cy.get('#inputPassword').should('have.attr', 'placeholder', 'Password').type('pass_123qwerty')
          })
          cy.get('[data-cy=submit]').click() // click a button and verify the result
          cy.get('.query-list').contains('apples').should('be.visible') // check visibility

    })
})