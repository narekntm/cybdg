describe('Iterating all controls on page', () => {
    before(() => {
        cy.log('All test are staring');
    });

    beforeEach(() => {
        cy.visit('https://example.cypress.io/commands/actions');
        cy.log('Test is starting');
    });

    it('Get all Inputs', () => {
        cy.get('input:not([type="checkbox"]):not([type="radio"]):visible').each(($el, index) => {
            cy.wrap($el)
                .invoke('css', 'background-color', 'lightyellow')
                .type(`Input number ${index + 1}`);
        });
    });

    it('Get all Checkbox', () => {
        cy.get('input[type="checkbox"]:visible:enabled')
            .check()
            .should('be.checked');
    });

    it('Get all Radio', () => {
        cy.get('input[type="radio"]:visible:enabled')
            .check()
            .should('be.checked');
    });

    it('Get all Paragraph', () => {
        cy.get('p')
            .invoke('css', 'color', 'green');
    });

    it('Get all Dropdown', () => {
        cy.get('select').each(($select, index) => {
            if ($select.length > 0) {
                cy.wrap($select).find('option').eq(1).then(($option) => {
                    const value = $option.val();
                    if (value) {
                        cy.wrap($select).select(value);
                    }
                });
            }
        });
    });

    it('Get all RangeInput', () => {
        cy.get('input[type="range"]').each(($el) => {
            cy.wrap($el)
                .invoke('val', Math.floor(Math.random() * 100) + 1)
                .trigger('input')
                .trigger('change');
        });
    });

    afterEach(() => {
        cy.visit('https://example.cypress.io/utilities');
        cy.log('Test completed');
    });

    after(() => {
        cy.log('All tests finished');
    });
});