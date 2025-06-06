describe('Actions page', () => {
     before('Runs once before all tests', () => {
        cy.visit('https://example.cypress.io');
     });
    beforeEach('Run before each it', () => {
        cy.visit('https://example.cypress.io/commands/actions')
     });
     afterEach('Run after each it', () => {
        cy.log('The case is successfully finished')
     });
     after('Runs once after all tests in describe', () => {
        cy.log('All tests are completed!')
     });
     describe('Inputs', () => {
         beforeEach('Check that the input fields are empty', () => {
            cy.get('#email1').should('have.value', '');
            cy.get('#password1').should('have.value', '');
         })
         it('Take all input fields in the UI and type something inside the input', () => {
            cy.get('#email1').type('simpleText').should('have.value', 'simpleText');
            cy.get('#password1').type('textttt').should('have.value', 'textttt');
         })
         afterEach('Clean the inputted texts', () => {
            cy.get('#email1').clear();
            cy.get('#password1').clear();
         })
     });
     describe('Paragraphs/ texts', () => {
         before('', () => {
            cy.log('Take all plain texts and validate that they are visible (filter by unique class or text)')
         })
         it('First paragraph', () => {
            cy.get(':nth-child(20) > .well').should('contain', 'Double click to edit')
         })
         it('Second paragraph', () => {
            cy.get(':nth-child(23) > .well').should('contain', 'Right click to edit')
         })
         after('', () => {
            cy.log('All textes are visible')
         })
     });
     describe('Checkboxes', () => {
         before('', () => {
            cy.log('Take multiple checkboxes and verify that they are visible and click on them')
         })
         it('Checkbox is visible', () => {
            cy.get('.action-checkboxes > :nth-child(1) > label').should('contain.text', 'Checkbox')
         })
         it('Checkbox is clickable', () => {
            cy.get('.action-checkboxes > :nth-child(1) > label > input').click()
         })
         after('', () => {
            cy.log('All checkboxes are visible and clickable')
         })
     });
});

describe('Assertions page', () => {
     before('Runs one time before all tests', () => {
        cy.visit('https://example.cypress.io');
     });
    beforeEach('Run before each it', () => {
        cy.visit('https://example.cypress.io/commands/assertions')
     });
     afterEach('Run after each it', () => {
        cy.log('The case is successfully finished')
     });
     after('Runs once after all tests in describe', () => {
        cy.log('All tests are completed!')
        cy.visit('https://example.cypress.io')
     });
     describe('Paragraphs/ texts', () => {
         before('', () => {
            cy.log('Tests regarding to the texts')
         })
         it('1st section', () => {
            cy.get(':nth-child(17) > .well').should('contain', 'Some text from')
         });
         it('2nd text section', () => {
            cy.get(':nth-child(25) > .well').should('contain', 'Foo Bar')
         });
         after('', () => {
            cy.log('All texts are properly visible')
         })
     });
     describe('Table', () => {
         before('', () => {
            cy.log('Tests regarding to the table')
         });
         it('', () => {
            cy.get(':nth-child(3) > .well').should('exist').and('be.visible')
         });
         after('', () => {
            cy.log('The table is visible')
         })
     })
});
