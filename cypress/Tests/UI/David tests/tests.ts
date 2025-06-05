describe('Describe Actions', () => {
    before(() => {
        cy.visit('https://example.cypress.io/')
    })
    after(() => {
        cy.visit('https://example.cypress.io/')
    })

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions')
    })
    afterEach(() => {
        cy.visit('https://example.cypress.io/utilities')
    })

    context('Tests for Checkboxes', () => {
        it('Should do some actions with checkboxes', () => {
            cy.get('.action-checkboxes > :nth-child(1) > label > input').check()
            cy.get('.action-checkboxes > :nth-child(3) > label > input').check()
            cy.get('.action-multiple-checkboxes > :nth-child(1) > label > input').check()
            cy.get('.action-multiple-checkboxes > :nth-child(2) > label > input').check()
            cy.get('.action-multiple-checkboxes > :nth-child(3) > label > input').check()
            cy.get('#optionsRadios1').check()
            cy.get('#optionsRadios2').check()
        })
    })
    context('Tests for Texts', () => {
        it('Should do some actions with texts', () => {
            cy.get(':nth-child(2) > .well > form > :nth-child(1) > label').should('be.visible')
            cy.get('form > :nth-child(2) > label').should('be.visible')
            cy.get(':nth-child(5) > .well > form > .form-group > label').should('be.visible')
            cy.get(':nth-child(8) > .well > form > .form-group > label').should('be.visible')
            cy.get(':nth-child(11) > .well > form > .form-group > label').should('be.visible')
            cy.get('.action-div').dblclick()
            cy.get('.action-div').should('not.be.visible')
            cy.get('.action-input-hidden').should('be.visible')
        })
    })
    context('Tests for Inputs', () => {
        it('Should do some actions with inputs', () => {
            cy.get('#email1').type('qwerty@123.com')
            cy.get('#password1').type('pass123')
            cy.get('#fullName1').type('Joe Smith')
            cy.get('#description').type('Some description')
            cy.get('.action-form').find('#couponCode1').type('12345678910')
        })
    })
})

describe('Describe Assertions', () => {
    before(() => {
        cy.visit('https://example.cypress.io/')
    })
    after(() => {
        cy.visit('https://example.cypress.io/')
    })

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/assertions')
    })
    afterEach(() => {
        cy.visit('https://example.cypress.io/utilities')
    })

    context('Tests for Table', () => {
        it('Should select and check table', () => {
            cy.get(':nth-child(3) > .well')
            .find('.success > :nth-child(2)')
            .should('have.text', 'Column content')
        })
        it('Should find link and do some checks', () => {
            cy.get('.assertions-link').should('have.class', 'active')
            .and('have.attr', 'href')
            .and('include', 'cypress.io')
        })
    })
    context('Tests for Texts', () => {
        it('Should check first text', () => {
            cy.get(':nth-child(17) > .well').find('.assertions-p > :nth-child(1)')
            .should('contain.text', 'first')
        })
        it('Should check second text', () => {
            cy.get(':nth-child(17) > .well').find('.assertions-p > :nth-child(2)')
            .should('contain.text', 'second')
        })
        it('Should check third text', () => {
            cy.get(':nth-child(17) > .well').find('.assertions-p > :nth-child(3)')
            .should('contain.text', 'third')
        })
    })
})