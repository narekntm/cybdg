import {UserManagementPage} from '../../../Fixtures/Pages/UserManagementPage'
describe('User Management Test Cases', () => {
    const baseUrl = 'http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html'
    beforeEach('visit the site', ()=>{
        cy.visit(baseUrl);
    })
    const login = function(email:string, password:string){
        UserManagementPage.adminEmailInput().type(email);
        UserManagementPage.adminPasswordInput().type(password);
        UserManagementPage.loginButton().click();

    };
    const addUser = function(
        fullName: string = '',
        role: any = '',
        age: string = '',
        email: string = '',
        gender?: 'Male' | 'Female' | 'Other',
        subscriptions: string[] = []
    ) {
        if (fullName) UserManagementPage.fullNameInput().clear().type(fullName);
        if (role) UserManagementPage.roleInput().select(role);
        if (age) UserManagementPage.ageInput().clear().type(age);
        if (email) UserManagementPage.emailInput().clear().type(email);

        if (gender) {
            UserManagementPage.genderRadio(gender).check();
        }
        UserManagementPage.subscribeComponent().uncheck();

        subscriptions.forEach((subs) => {
            UserManagementPage.subscribeCheckbox(subs).check();
        });

        UserManagementPage.saveButton().click();
    };

    describe('Admin Login', () => {
        it('Login with valid credentials', () => {
            login('admin@example.com', 'admin123')
            UserManagementPage.logoutButton()
                .should('exist')
        });

        it('Login with invalid credentials', () => {
            login('test@example.com', 'test123')
            UserManagementPage.loginStatus()
                .should('contain', 'Invalid credentials')
        });

        it('Admin delete become active after login', () => {
            UserManagementPage.tableRow(0)
                .within(() => {
                UserManagementPage.deleteButton().click();
            });
            UserManagementPage.confirmModal().should("exist");
        });

        it('Admin delete errors out after logout / before login', () => {
            UserManagementPage.tableRow(0)
                .within(() => {
                    UserManagementPage.deleteButton().click();
            });
            UserManagementPage.adminDeleteErrorMessage()
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
            UserManagementPage.tableRow(3)
                .last()
                .within(() => {
                    UserManagementPage.tableData(0)
                        .should('have.text', 'Anahit');
                });
        });

        it('Submit form with all fields empty', () => {
            addUser()
            UserManagementPage.formErrorsMessage()
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
            UserManagementPage.formErrorsMessage()
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
            UserManagementPage.formErrorsMessage()
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
            UserManagementPage.formErrorsMessage()
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
            UserManagementPage.tableRow(3)
                .within(() => {
                    UserManagementPage.tableData(0)
                        .should('have.text', 'John');
                });
        });

    });

    describe('Edit Existing User', () => {
        it('Clicking "Edit" loads user data and Submitting replaces table row', () => {
            UserManagementPage.tableRow(0)
                .find('.btn-secondary.edit-btn')
                .click();
            UserManagementPage.fullNameInput().should("have.value", "Alice");
            UserManagementPage.roleInput().should("have.value", "Admin");
            UserManagementPage.ageInput().should("have.value", "30");
            UserManagementPage.emailInput().should("have.value", "alice@site.com");
            UserManagementPage.genderRadio('Female').should('be.checked');
            UserManagementPage.subscribeCheckbox('Newsletter').should("be.checked");
        addUser(
            'Alicia',
            'Editor',
            '21',
            'alicia@gmail.com',
            'Other',
            []
        )
            UserManagementPage.tableRow(0).find('td').eq(0)
                .should('have.text', 'Alicia');
            UserManagementPage.tableRow(0).find('td').eq(1)
                .should('have.text', 'Editor');
            UserManagementPage.tableRow(0).find('td').eq(2)
                .should('have.text', '21');
            UserManagementPage.tableRow(0).find('td').eq(3)
                .should('have.text', 'alicia@gmail.com');
            UserManagementPage.tableRow(0).find('td').eq(4)
                .should('have.text', 'Other');
            UserManagementPage.tableRow(0).find('td').eq(5)
                .should('not.have.text');
        });


    });

    describe('Delete User', () => {
        it('Clicking "Delete" opens confirmation modal', () => {
            UserManagementPage.tableRow(2)
                .find('.btn-danger.delete-btn')
                .click()
           UserManagementPage.modalContent()
                .should('exist')
        });

        it('Clicking "Yes" deletes the selected user', () => {
            UserManagementPage.tableRow(2)
                .find('.btn-danger.delete-btn')
                .click()
            UserManagementPage.modalContent()
                .should('exist')
            UserManagementPage.confirmDeleteButton()
                .click()
           UserManagementPage.userTable()
                .should('not.contain', 'Eve')
        });

        it('Clicking "Cancel" closes modal, no action taken', () => {
            UserManagementPage.tableRow(2)
                .find('.btn-danger.delete-btn')
                .click()
            UserManagementPage.modalContent()
                .should('exist')
            UserManagementPage.cancelDeleteButton()
                .click()
            UserManagementPage.modalContent()
                .should('not.be.visible')
        });

        it('Non-admin tries to delete Admin user', () => {
            UserManagementPage.tableRow(2)
                .find('.btn-danger.delete-btn')
                .click()
            UserManagementPage.adminDeleteErrorMessage().should('exist')
        });

        it('Admin user deletes another Admin after login', () => {
            login('admin@example.com', 'admin123')
            UserManagementPage.tableRow(0)
                .find('.btn-danger.delete-btn')
                .click()
            UserManagementPage.modalContent()
                .should('exist')
            UserManagementPage.confirmDeleteButton()
                .click()
            UserManagementPage.userTable()
                .should('not.contain', 'Alice')
        });
    });

    describe('Toggle Status', () => {
        it('Status toggles between Active/Inactive', () => {
            UserManagementPage.tableRow(2)
                .find('.btn-primary.status-btn')
                .click()
            UserManagementPage.tableRow(2)
                .find('td')
                .eq(6)
                .should('have.text', 'Inactive');


            UserManagementPage.tableRow(2)
                .find('.btn-primary.status-btn')
                .click()
            UserManagementPage.tableRow(2)
                .find('td')
                .eq(6)
                .should('have.text', 'Active');

        });
    });

})
