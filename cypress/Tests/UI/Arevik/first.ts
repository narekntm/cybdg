import Chance from "chance";
import { log } from "console";

let text = [];
let chance = new Chance();
describe("Actions page block", () => {
    before(() => {
        for (let i = 0; i < 10; i++) {
            text.push(chance.paragraph({ sentences: 3 }));
        }
    });

    beforeEach(() => {
        cy.visit("/commands/actions");
    });

    afterEach(() => {
        cy.visit("/utilities");
    });

    after(() => {
        text = []
    })

    describe("inputs", () => {
        it("should type values into each input field", () => {
            cy.get('.action-email').type('fake@email.com')
            cy.get('.action-email').should('have.value', 'fake@email.com');
        });
    });

    describe("paragraphs", () => {
        it('should verify that all paragraph texts are visible', () => {
            cy.get('p').each(($paragraph) => {
                cy.wrap($paragraph).should('be.visible');
            });
        });

        describe("checkboxes", () => {
            it('should check enabled radio buttons and verify they are checked', () => {
                cy.get('.action-radios [type="radio"]')
                    .not('[disabled]')
                    .check();

                cy.get('.action-radios [type="radio"]')
                    .not('[disabled]')
                    .should('be.checked');
            });
        });
    })
})




describe("Assertions page block", () => {
    before(() => {
        cy.log('Starting Assertions page tests');
    });

    beforeEach(() => {
        cy.visit("/commands/assertions");
    });

    after(() => {
        cy.log('Finished Assertions page tests');
    });
    
    afterEach(() => {
        cy.visit("/utilities");
    });


    describe("Paragraphs and text blocks", () => {
        it("should verify that key paragraphs are visible", () => {
            cy.get("p").each(($p) => {
                cy.wrap($p).should("be.visible");
            })
        })
        it('should verify that the link has class, attribute and correct href', () => {
            cy.get('a')
                .should('have.class', 'active')
                .and('have.attr', 'href')
                .and('include', 'cypress.io');
        });
    });

    describe("Tables block", () => {
        it('should ensure that tables are visible and have rows', () => {
            cy.get('.assertion-table').should('be.visible');
            cy.get('.assertion-table tbody tr').should('have.length.greaterThan', 0);
        });
        it('should check the text content of the element in various ways', () => {
            cy.get('.assertions-td')
                .should('have.text', 'Column content')
                .should('contain', 'Column content')
                .should('have.html', 'Column content');
        });
    })

})