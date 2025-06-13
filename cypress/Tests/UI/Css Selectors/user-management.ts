describe('User Management Test Cases', () => {
    const baseUrl = 'http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html'
    beforeEach('visit the site', ()=>{
        cy.visit(baseUrl);
    })
    const login = function(email:string, password:string){
        cy.get('#admin-email').type(email);
        cy.get('#admin-password').type(password);
        cy.get('#admin-login-form .btn-primary').click();
    };
    const addUser = function(
        fullName: string = '',
        role: any = '',
        age: string = '',
        email: string = '',
        gender?: 'Male' | 'Female' | 'Other',
        subscriptions: string[] = []
    ) {
        if (fullName) cy.get('#name').clear().type(fullName);
        if (role) cy.get('#role').select(role);
        if (age) cy.get('#age').clear().type(age);
        if (email) cy.get('#email').clear().type(email);

        if (gender) {
            cy.get(`input[name="gender"][value="${gender}"]`).check();
        }
        cy.get('input[name="subscribe"]').uncheck();

        subscriptions.forEach((sub) => {
            cy.get(`input[name="subscribe"][value="${sub}"]`).check();
        });

        cy.get('#user-form .btn-primary').click();
    };

    it('gets ..login as admin.. selectors',() =>{
// Login as Admin label
        cy.get('section h2').eq(0)

// Admin Email label
        cy.get('label[for="admin-email"]')

// Admin Email input
        cy.get('#admin-email')

// Admin Password label
        cy.get('label[for="admin-password"]')

// Admin Password input
        cy.get('#admin-password')

// Login button
        cy.get('#admin-login-form .btn-primary')
//Logout button
        cy.get('#logout-btn')
//Login status
        cy.get('#login-status')
    })

    it('gets ..add new user.. selectors', () =>{
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

// Subsribe to label
        cy.get('#Subscribe')
// Subscribe to Newsletter checkbox
        cy.get('input[name="subscribe"][value="Newsletter"]');

// Subscribe to Product Updates checkbox
        cy.get('input[name="subscribe"][value="Product Updates"]');
// Save button
        cy.get('#user-form .btn-primary')
    })
    it('gets ..user table.. selectors',() =>{
// User Table Section
     cy.get('section h2').eq(1) // User Table label

// Error Message
     cy.get('#admin-delete-error') // Admin delete error message

// User Table
     cy.get('#user-table') // User table container

// Table Header Cells
     cy.get('#user-table thead th').eq(0) // Name column header
     cy.get('#user-table thead th').eq(1) // Role column header
     cy.get('#user-table thead th').eq(2) // Age column header
     cy.get('#user-table thead th').eq(3) // Email column header
     cy.get('#user-table thead th').eq(4) // Gender column header
     cy.get('#user-table thead th').eq(5) // Subscription column header
     cy.get('#user-table thead th').eq(6) // Status column header
     cy.get('#user-table thead th').eq(7) // Actions column header

// Table Body Rows (example for the first row)
     cy.get('#user-table tbody tr').eq(0) // First row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(0) // Name cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(1) // Role cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(2) // Age cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(3) // Email cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(4) // Gender cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(5) // Subscription cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(6) // Status cell in first row
     cy.get('#user-table tbody tr').eq(0).find('td').eq(7) // Actions cell in first row


// Delete Edit and Deactivate/Activate buttons
     cy.get('.btn-secondary.edit-btn'); //Edit Button
     cy.get('.btn-danger.delete-btn'); //Delete button
     cy.get('.btn-primary.status-btn'); // Deactivate/Activate button

// Modal for Delete Confirmation
     cy.get('#confirm-modal') // Modal container
     cy.get('#confirm-modal .modal-content') // Modal content container
     cy.get('#confirm-modal .modal-content p') // Modal message paragraph
     cy.get('#confirm-delete') // Confirm delete button
     cy.get('#cancel-delete') // Cancel delete button
 })

    describe('Admin Login', () => {
        it('Login with valid credentials', () => {
            login('admin@example.com', 'admin123')
            cy.get('#logout-btn')
                .should('exist')
        });

        it('Login with invalid credentials', () => {
            login('test@example.com', 'test123')
            cy.get('#login-status')
                .should('contain', 'Invalid credentials')
        });

        it('Admin delete become active after login', () => {
            cy.get('#user-table tbody tr')
                .eq(0)
                .within(() => {
                cy.get("button.delete-btn").click();
            });
            cy.get("#confirm-modal").should("exist");
        });

        it('Admin delete errors out after logout / before login', () => {
            cy.get('#user-table tbody tr')
                .eq(0)
                .within(() => {
                cy.get("button.delete-btn").click();
            });
            cy.get("#admin-delete-error")
                .should("exist")
                .and("contain", "Admin login required to delete Admin-level users.");
        });
    });

    describe('Add New User', () => {
        it('Add user with valid input', () => {
        addUser(
            'Anahit',
            'Admin',
            '24',
            'anahit.ru@gmail.com',
            'Female',
            ['Newsletter'])
            cy.get('#user-table tbody tr')
                .last()
                .within(() => {
                    cy.get('td')
                        .eq(0)
                        .should('have.text', 'Anahit');
                });
        });

        it('Submit form with all fields empty', () => {
            addUser()
            cy.get('#form-errors')
                .should('exist')
        });

        it('Invalid name (e.g. symbols, numbers)', () => {
            addUser(
                '@tes%',
                'Editor',
                '35',
                'anahit.com@gmail.com',
                'Other',
                ['Newsletter'])
            cy.get('#form-errors')
                .should('contain','Name must be 1–20 letters only (no spaces or symbols).' )
        });

        it('Invalid email format', () => {
            addUser(
                'Mary',
                'Editor',
                '35',
                'maryodno$2as',
                'Other',
                ['Newsletter'])
            cy.get('#form-errors')
                .should('contain','Valid email is required.')
        });

        it('No gender selected', () => {
            addUser(
            'John',
            'Admin',
            '35',
            'john@gmail.com',
            null,
            ['Newsletter'])
            cy.get('#form-errors')
                .should('contain','Gender selection is required.')
       });

        it('Submit without selecting subscriptions', () => {
            addUser(
                'John',
                'Admin',
                '35',
                'john@gmail.com',
                'Male',
                [])
            cy.get('#user-table tbody tr')
                .last()
                .within(() => {
                    cy.get('td')
                        .eq(0)
                        .should('have.text', 'John');
                });
        });

    });

    describe('Edit Existing User', () => {
        it('Clicking "Edit" loads user data and Submitting replaces table row', () => {
            cy.get('#user-table tbody tr')
                .eq(0)
                .find('.btn-secondary.edit-btn')
                .click();
            cy.get("#name").should("have.value", "Alice");
            cy.get("#role").should("have.value", "Admin");
            cy.get("#age").should("have.value", "30");
            cy.get("#email").should("have.value", "alice@site.com");
            cy.get('input[name="gender"][value="Female"]').should('be.checked');
            cy.get(`input[name="subscribe"][value="Newsletter"]`).should("be.checked");
        addUser(
            'Alicia',
            'Editor',
            '21',
            'alicia@gmail.com',
            'Other',
            []
        )
            cy.get('#user-table tbody tr').eq(0).find('td').eq(0)
                .should('have.text', 'Alicia');
            cy.get('#user-table tbody tr').eq(0).find('td').eq(1)
                .should('have.text', 'Editor');
            cy.get('#user-table tbody tr').eq(0).find('td').eq(2)
                .should('have.text', '21');
            cy.get('#user-table tbody tr').eq(0).find('td').eq(3)
                .should('have.text', 'alicia@gmail.com');
            cy.get('#user-table tbody tr').eq(0).find('td').eq(4)
                .should('have.text', 'Other');
            cy.get('#user-table tbody tr').eq(0).find('td').eq(5)
                .should('not.have.text');
        });


    });

    describe('Delete User', () => {
        it('Clicking "Delete" opens confirmation modal', () => {
            cy.get('#user-table tbody tr').eq(2)
                .find('.btn-danger.delete-btn')
                .click()
            cy.get('.modal-content')
                .should('exist')
        });

        it('Clicking "Yes" deletes the selected user', () => {
            cy.get('#user-table tbody tr').eq(2)
                .find('.btn-danger.delete-btn')
                .click()
            cy.get('.modal-content')
                .should('exist')
            cy.get('#confirm-delete')
                .click()
            cy.get('#user-table')
                .should('not.contain', 'Eve')
        });

        it('Clicking "Cancel" closes modal, no action taken', () => {
            cy.get('#user-table tbody tr').eq(2)
                .find('.btn-danger.delete-btn')
                .click()
            cy.get('.modal-content')
                .should('exist')
            cy.get('#cancel-delete')
                .click()
            cy.get('.modal-content')
                .should('not.be.visible')
        });

        it('Non-admin tries to delete Admin user', () => {
            cy.get('#user-table tbody tr').eq(0)
                .find('.btn-danger.delete-btn')
                .click()
            cy.get('#admin-delete-error')
                .should('be.visible')
        });

        it('Admin user deletes another Admin after login', () => {
            login('admin@example.com', 'admin123')
            cy.get('#user-table tbody tr').eq(0)
                .find('.btn-danger.delete-btn')
                .click()
            cy.get('.modal-content')
                .should('exist')
            cy.get('#confirm-delete')
                .click()
            cy.get('#user-table')
                .should('not.contain', 'Alice')
        });
    });

    describe('Toggle Status', () => {
        it('Status toggles between Active/Inactive', () => {
            cy.get('#user-table tbody tr').eq(2)
                .find('.btn-primary.status-btn')
                .click()
            cy.get('#user-table tbody tr').eq(2)
                .find('td')
                .eq(6)
                .should('have.text', 'Inactive');


            cy.get('#user-table tbody tr').eq(2)
                .find('.btn-primary.status-btn')
                .click()
            cy.get('#user-table tbody tr').eq(2)
                .find('td')
                .eq(6)
                .should('have.text', 'Active');

        });
    });

})



