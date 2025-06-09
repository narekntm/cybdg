describe('homework', () => {
    beforeEach(() => {
        cy.log("Test is starting")  
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/homework.html');
    })

    it('Fill the User Form', () =>{
        cy.get('form.user-form input#username').type('testuser');

        cy.get('form input[type="email"]').type('testuser@example.com');

        cy.get('select').then(($select) => {
            const option = $select.find('option');
            if (option.length >= 2) {
                cy.wrap($select).select(option.eq(1).val());
            }
        });

        cy.get('input[type="checkbox"]#newsletter').check().should('be.checked');

        cy.get('button[type="submit"]').click();
    });

    it('Interuct with the UserTable', () =>{
        cy.get('table.user-table tr').not(':first').should('have.length', 3);
        cy.get('table.user-table tr').eq(1).find('.small-btn').click();
        cy.get('table.user-table tr').eq(2).find('.small-btn').click();
        cy.get('table.user-table tr').eq(3).find('.small-btn').should('be.disabled');

    });    

    it('Navigation and Footer Checks', () => {
        cy.get('div.container aside.sidebar ul li').should('have.length', 3);
        cy.get('div.footer').should('have.text', '© 2025 TestCorp');
    });

    it('Simulate and Interact with Modal', ()=> {
        cy.get('table.user-table tr').eq(1).find('.small-btn').click();

        cy.get('div#edit-modal').should('be.visible');
        cy.get('div#edit-modal h2').should('have.text','Edit User');
        cy.get('div#edit-modal .close-modal').should('exist');
        cy.get('div#edit-modal .close-modal').click();
    });

    afterEach(() => {
        cy.log("Test is finished")  
    })    
});
