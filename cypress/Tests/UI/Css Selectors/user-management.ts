


describe('Add new user', () => {


    beforeEach('visit the site', ()=>{
        cy.visit('http://192.168.88.154:8080/Resources/htmls/CSS/user_management.html')
    })
    it('gets all the form selectors', () =>{
// Add New User label
        cy.get('#form-title');

// Full Name label
        cy.get('label[for="name"]');

// Full Name input
        cy.get('#name');

// Role label
        cy.get('label[for="role"]');

// Role input
        cy.get('#role');

// Age label
        cy.get('label[for="age"]');

// Age input
        cy.get('#age');

// Email label
        cy.get('label[for="email"]');

// Email input
        cy.get('#email');

// Gender label
        cy.get('#Gender')

// Gender Male radio button
        cy.get('input[name="gender"][value="Male"]');

// Gender Female radio button
        cy.get('input[name="gender"][value="Female"]');

// Gender Other radio button
        cy.get('input[name="gender"][value="Other"]');

// Subsribe to labe
        cy.get('#Subscribe')
// Subscribe to Newsletter checkbox
        cy.get('input[name="subscribe"][value="Newsletter"]');

// Subscribe to Product Updates checkbox
        cy.get('input[name="subscribe"][value="Product Updates"]');
// Save button
        cy.get('#user-form .btn-primary')
    })

    describe('test cases for add new user', ()=>{
    it('positive cases', () =>{
        cy.get('#name')
            .type('Anahit')
        cy.get('#role')
            .select('Editor')
        cy.get('#age')
            .type('26')
        cy.get('#email')
            .type('anahit.ru@gmail.com')
        cy.get('input[name="gender"][value="Female"]')
            .check();
        cy.get('input[name="subscribe"][value="Newsletter"]')
            .check()
        cy.get('#user-form .btn-primary')
            .click()
        cy.get('#user-table tbody tr')
            .should('have.length', 4);
        cy.get('#user-table tbody tr')
            .last()
            .within( () =>{
                cy.get('td').eq(0).should('have.value', 'Anahit')
        })

    })
    })
})


