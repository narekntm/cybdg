describe('Check UI cases', () => {

    after("Visit querying page ", () => {
        cy.visit('/commands/querying');
    });

    context('Tests for /commands/actions page', () => {

        beforeEach(() => {
            cy.visit('/commands/actions');
        });

        context('Should check and type in input fields', () => {

            it('Should get and check email address field', () => {
                cy.get('.action-email').type('fake@email.com')
                cy.get('.action-email').should('have.value', 'fake@email.com')
            });

            it('Should get and check password field', () => {
                cy.get('#password1').type('123456')
                cy.get('#password1').should('have.value', '123456')
            });

            it('Should get and check full name field', () => {
                cy.get('#fullName1').type('Arthur')
                cy.get('#fullName1').should('have.value', 'Arthur')
            });

            it('Should get and check describe field', () => {
                cy.get('#description').type('some description')
                cy.get('#description').should('have.value', 'some description')
            });

        });

        context('Should take all plain texts and validate that they are visible', () => {

            it('Should get text for double click', () => {
                cy.get('.action-div').should('have.text', "Double click to edit")
            });

            it('Should get text for right click', () => {
                cy.get('.rightclick-action-div').should('be.visible')
            });


        });

        context('Should check multiple checkboxes verify visibility and checkability', () => {

            it('Should get and click on checkboxes', () => {
                cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').check()
                cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('be.checked')
            });

            it('Should get and click on radio buttons', () => {
                cy.log('Finding enabled radio buttons');
                cy.get('.action-radios [type="radio"]').not('[disabled]').check()
                cy.get('.action-radios [type="radio"]').not('[disabled]').should('be.checked')
            });

        });

    });

    context('Tests for /commands/assertions page', () => {

        beforeEach(() => {
            cy.visit('/commands/assertions');
        });

        context('Should check texts for /assertions page', () => {

            it('Should check text for table content', () => {
                cy.get('.assertion-table')
                    .find('tbody tr:last')
                    .should('contain.text', 'Column content');
            });

        });

        context('Should check links for /assertions page', () => {

            it('Should check Cypress Docs link', () => {
                cy.get('.assertions-link')
                    .should('have.class', 'active')
                    .and('have.attr', 'href')
                    .and('include', 'cypress.io')
            });


        });

    });


});
