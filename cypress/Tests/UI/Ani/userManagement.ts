//import { should } from "chai"

describe.only('User Management', () => {
    beforeEach(() => {
            cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html')
        })
    function adminLogin(email : any, password : any){
            cy.get('input[id="admin-email"]').type(email) //.should('have.value', email) - դատարկ space-ի դեպքում fail ա լինում
            cy.get('input[id="admin-password"]').type(password).should('have.value', password)
            return cy.get('form[id="admin-login-form"] button[type="submit"]').click()
    }
    function adminLogout(){
            adminLogin('admin@example.com', 'admin123')
            cy.on('window:confirm', () => true)
            return cy.get('#logout-btn').click()
    }
    function userCreation() {
            cy.get('input[id="name"]').type('Ani')
            cy.get('select[id="role"]').select('Admin')
            cy.get('input[id="age"]').type('15')
            cy.get('input[id="email"]').type('test@test.com')
            cy.get('input[value="Female"]').click()
            return cy.get('form[id="user-form"] button[type="submit"]').click()
    }
    describe('Login As Admin', () => {
        it('1. Admin login with valid email and password', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
        })
        it('2. Admin login with valid email and invalid password', () => {
            adminLogin('admin@example.com', 'wrongPassword')
            cy.get('#login-status').should('have.text', 'Invalid credentials').should('be.visible')
        })
        it('3. Admin login with invalid email and valid password', () => {
            adminLogin('wrongEmail', 'admin123')
            cy.get('#login-status').should('have.text', 'Invalid credentials').should('be.visible')
        })
        it('4. Admin login with empty credentials', () => {
            adminLogin(' ', ' ')
            cy.get('#login-status').should('have.text', 'Invalid credentials').should('be.visible')
        })
        it('5. Admin login with empty email and valid password', () => {
            adminLogin(' ', 'admin123')
            cy.get('#login-status').should('have.text', 'Invalid credentials').should('be.visible')
        })
        it('6. Admin login with valid email and empty password', () => {
            adminLogin('admin@example.com', ' ')
            cy.get('#login-status').should('have.text', 'Invalid credentials').should('be.visible')
        })
        it('7. Logging out from the admin account', () => {
            adminLogout()
            cy.get('#logout-btn').should('not.be.visible')
        })
        it('8. Check the UI of the Login As Admin section', () => {
            cy.get('#admin-controls').prev().should('be.visible').should('have.text', 'Login as Admin')
            cy.get('label[for="admin-email"]').should('be.visible').should('have.text', 'Email')
            cy.get('label[for="admin-password"]').should('be.visible').should('have.text', 'Password')
            cy.get('form[id="admin-login-form"] button[type="submit"]').should('be.visible')
            .should('have.text', 'Login')
        })
    })
    describe('Add New User', () => {
        it('1. New user creation in a viewer mode', () => {
            userCreation()
            cy.get('#user-table tbody tr').last().find('td').eq(0).should('have.text', 'Ani')
        })
        it('2. New user creation (logged in as admin)', () => {
            adminLogin('admin@example.com', 'admin123')
            userCreation()
            cy.get('#user-table tbody tr').last().find('td').eq(0).should('have.text', 'Ani')
        })
        it('3. New user creation not filling all required fields', () => {
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('have.length', 5)
        })
        it('4. Creating a new user with filling only the Full Name', () => {
            cy.get('input[id="name"]').type('Ani')
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('not.contain', 'Name must be 1–20 letters only (no spaces or symbols).')
        })
        it('5. Creating a new user with selecting only Role', () => {
            cy.get('select[id="role"]').select('Admin')
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('not.contain', 'Role is required.')
        })
        it('6. Creating a new user with filling only the Age field', () => {
            cy.get('input[id="age"]').type('14')
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('not.contain', 'Age must be between 1 and 99.')
        })
        it('7. Creating a new user with filling only the Email field', () => {
            cy.get('input[id="email"]').type('test@test.com')
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('not.contain', 'Valid email is required.')
        })
        it('8. Creating a new user with choosing only Gender', () => {
            cy.get('input[value="Female"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('not.contain', 'Gender selection is required.')
        })
        it('9. Creating a new user with wrong Full Name format', () => {
            cy.get('input[id="name"]').type('Ani Harutyunyan 1')
            cy.get('select[id="role"]').select('Admin')
            cy.get('input[id="age"]').type('15')
            cy.get('input[id="email"]').type('test@test.com')
            cy.get('input[value="Female"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('contain', 'Name must be 1–20 letters only (no spaces or symbols).')
            cy.get('#form-errors ul li').should('have.length', 1)
            cy.get('#user-table tbody tr').should('have.length', 3)
        })
        it('10. Creating a new user with wrong Age format', () => {
            cy.get('input[id="name"]').type('Ani')
            cy.get('select[id="role"]').select('Admin')
            cy.get('input[id="age"]').type('150')
            cy.get('input[id="email"]').type('test@test.com')
            cy.get('input[value="Female"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('contain', 'Age must be between 1 and 99.')
            cy.get('#form-errors ul li').should('have.length', 1)
            cy.get('#user-table tbody tr').should('have.length', 3)
        })
        it('11. Creating a new user with wrong Email format', () => {
            cy.get('input[id="name"]').type('Ani')
            cy.get('select[id="role"]').select('Admin')
            cy.get('input[id="age"]').type('15')
            cy.get('input[id="email"]').type('wrongEmail_format')
            cy.get('input[value="Female"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-errors ul li').should('contain', 'Valid email is required.')
            cy.get('#form-errors ul li').should('have.length', 1)
            cy.get('#user-table tbody tr').should('have.length', 3)
        })
        it('12. Check the UI of the Add New User section', () => {
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('label[for="name"]').should('be.visible').should('have.text', 'Full Name')
            cy.get('label[for="role"]').should('be.visible').should('have.text', 'Role')
            cy.get('label[for="age"]').should('be.visible').should('have.text', 'Age')
            cy.get('label[for="email"]').should('be.visible').should('have.text', 'Email')
            cy.get('input[value="Male"]').parents('label').parent().siblings('label').should('be.visible')
            .should('have.text', 'Gender')
            cy.get('input[value="Newsletter"]').parents('label').parent().siblings('label')
            .should('be.visible').should('have.text', 'Subscribe to')
            cy.get('form[id="user-form"] button[type="submit"]').should('be.visible')
            .should('have.text', 'Save')
        })
    })
    describe('User Table', () => {
        it('1. Trying to delete a user while being logged out', () => {
            cy.get('#logout-btn').should('not.be.visible')
            cy.get('#user-table tbody tr').should('have.length', 3)
            cy.get('#user-table tbody tr').first().find('td').find('.btn-danger.delete-btn').click()
            cy.get('#admin-delete-error').should('have.text', 'Admin login required to delete Admin-level users.')
        })
        it('2. Trying to delete a user being an admin', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').should('have.length', 3)
            cy.get('#user-table tbody tr').first().find('td').find('.btn-danger.delete-btn').click()
            cy.get('.modal-content').should('be.visible')
            cy.get('#confirm-delete').should('be.visible').click()
            cy.get('#user-table tbody tr').should('have.length', 2)
        })
        it('3. Make sure that clicking on the "Cancel" button does not delete the user', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').should('have.length', 3)
            cy.get('#user-table tbody tr').first().find('td').find('.btn-danger.delete-btn').click()
            cy.get('.modal-content').should('be.visible')
            cy.get('#cancel-delete').should('be.visible').click()
            cy.get('#user-table tbody tr').should('have.length', 3)
        })
        it('4. Deactivate a user(logged out user)', () => {
            cy.get('#logout-btn').should('not.be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(6).should('have.text', 'Active')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Deactivate').click()
            cy.get('#user-table tbody tr').first().find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Activate')
            cy.get('#user-table tbody tr').first().find('td').eq(6).should('have.text', 'Inactive')
        })
        it('5. Deactivate a user(logged in as Admin)', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(6).should('have.text', 'Active')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Deactivate').click()
            cy.get('#user-table tbody tr').first().find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Activate')
            cy.get('#user-table tbody tr').first().find('td').eq(6).should('have.text', 'Inactive')
        })
        it('6. Activate a user(logged out user)', () => {
            cy.get('#logout-btn').should('not.be.visible')
            cy.get('#user-table tbody tr').eq(1).find('td').eq(6).should('have.text', 'Inactive')
            cy.get('#user-table tbody tr').eq(1).find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Activate').click()
            cy.get('#user-table tbody tr').eq(1).find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Deactivate')
            cy.get('#user-table tbody tr').eq(1).find('td').eq(6).should('have.text', 'Active')
        })
        it('7. Activate a user(logged in as Admin)', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').eq(1).find('td').eq(6).should('have.text', 'Inactive')
            cy.get('#user-table tbody tr').eq(1).find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Activate').click()
            cy.get('#user-table tbody tr').eq(1).find('td').find('.btn-primary.status-btn')
            .should('have.text', 'Deactivate')
            cy.get('#user-table tbody tr').eq(1).find('td').eq(6).should('have.text', 'Active')
        })
        it('8. Make sure the Edit User section becomes active when clicking on the Edit button(logged out user)', () => {
            cy.get('#logout-btn').should('not.be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Alice')
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-secondary.edit-btn').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Edit User')
            cy.get('input[id="name"]').should('have.value', 'Alice')
        })
        it('9. Make sure the Edit User section becomes active when clicking on the Edit button(logged in as Admin)', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Alice')
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-secondary.edit-btn').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Edit User')
            cy.get('input[id="name"]').should('have.value', 'Alice')
        })
        it('10. Check that the user update flow works properly(logged out user)', () => {
            cy.get('#logout-btn').should('not.be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Alice')
            cy.get('#user-table tbody tr').first().find('td').eq(1).should('have.text', 'Admin')
            cy.get('#user-table tbody tr').first().find('td').eq(2).should('have.text', '30')
            cy.get('#user-table tbody tr').first().find('td').eq(3).should('have.text', 'alice@site.com')
            cy.get('#user-table tbody tr').first().find('td').eq(4).should('have.text', 'Female')
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-secondary.edit-btn').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Edit User')
            cy.get('input[id="name"]').clear().type('Max')
            cy.get('select[id="role"]').select('Viewer')
            cy.get('input[id="age"]').clear().type('26')
            cy.get('input[id="email"]').clear().type('example@test.com')
            cy.get('input[value="Male"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Max')
            cy.get('#user-table tbody tr').first().find('td').eq(1).should('have.text', 'Viewer')
            cy.get('#user-table tbody tr').first().find('td').eq(2).should('have.text', '26')
            cy.get('#user-table tbody tr').first().find('td').eq(3).should('have.text', 'example@test.com')
            cy.get('#user-table tbody tr').first().find('td').eq(4).should('have.text', 'Male')
        })
        it('11. Check that the user update flow works properly(logged in as Admin)', () => {
            adminLogin('admin@example.com', 'admin123')
            cy.get('#logout-btn').should('be.visible')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Alice')
            cy.get('#user-table tbody tr').first().find('td').eq(1).should('have.text', 'Admin')
            cy.get('#user-table tbody tr').first().find('td').eq(2).should('have.text', '30')
            cy.get('#user-table tbody tr').first().find('td').eq(3).should('have.text', 'alice@site.com')
            cy.get('#user-table tbody tr').first().find('td').eq(4).should('have.text', 'Female')
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').find('.btn-secondary.edit-btn').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Edit User')
            cy.get('input[id="name"]').clear().type('Max')
            cy.get('select[id="role"]').select('Viewer')
            cy.get('input[id="age"]').clear().type('26')
            cy.get('input[id="email"]').clear().type('example@test.com')
            cy.get('input[value="Male"]').click()
            cy.get('form[id="user-form"] button[type="submit"]').click()
            cy.get('#form-title').should('be.visible').should('have.text', 'Add New User')
            cy.get('#user-table tbody tr').first().find('td').eq(0).should('have.text', 'Max')
            cy.get('#user-table tbody tr').first().find('td').eq(1).should('have.text', 'Viewer')
            cy.get('#user-table tbody tr').first().find('td').eq(2).should('have.text', '26')
            cy.get('#user-table tbody tr').first().find('td').eq(3).should('have.text', 'example@test.com')
            cy.get('#user-table tbody tr').first().find('td').eq(4).should('have.text', 'Male')
        })
    })
})



describe('Selectors', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html')
    })
    it('Add New User', () => {
        
        //Add New User title
        cy.get('#form-title')

        //Full Name label
        cy.get('label[for="name"]')

        //Full Name input
        cy.get('input[id="name"]')

        //Role label
        cy.get('label[for="role"]')

        //Role dropdown
        cy.get('select[id="role"]')

        //Age label
        cy.get('label[for="age"]')

        //Age input
        cy.get('input[id="age"]')

        //Email label
        cy.get('label[for="email"]')

        //Email input
        cy.get('input[id="email"]')

        //Gender label
        cy.get('input[value="Male"]').parents('label').parent().siblings('label')

        //Male label
        cy.get('input[value="Male"]').parent()

        //Male radio button
        cy.get('input[value="Male"]')

        //Female label
        cy.get('input[value="Female"]').parent()

        //Female radio button
        cy.get('input[value="Female"]')

        //Other label
        cy.get('input[value="Other"]').parent()

        //Other radio button
        cy.get('input[value="Other"]')

        //Subscribe To label
        cy.get('input[value="Newsletter"]').parents('label').parent().siblings('label')

        //Newsletter label
        cy.get('input[value="Newsletter"]').parent()

        //Newsletter checkbox
        cy.get('input[value="Newsletter"]')

        //Product Updates label
        cy.get('input[value="Product Updates"]').parent()

        //Product Updates checkbox
        cy.get('input[value="Product Updates"]')

        //Save button
        cy.get('form[id="user-form"] button[type="submit"]')
    })
    it('Login As Admin', () => {
        
        //Login As Admin title
        cy.get('#admin-controls').prev()

        //Email label
        cy.get('label[for="admin-email"]')

        //Email input
        cy.get('input[id="admin-email"]')

        //Password label
        cy.get('label[for="admin-password"]')

        //Password input
        cy.get('input[id="admin-password"]')

        //Login button
        cy.get('form[id="admin-login-form"] button[type="submit"]')
    })
    it('User Table', () => {

        //User Table table
        cy.get('#user-table')

        //User Table title
        cy.get('#admin-delete-error').prev()

        //Name
        cy.get('#user-table thead tr th').eq(0)

        //Role
        cy.get('#user-table thead tr th').eq(1)

        //Age
        cy.get('#user-table thead tr th').eq(2)

        //Email
        cy.get('#user-table thead tr th').eq(3)

        //Gender
        cy.get('#user-table thead tr th').eq(4)

        //Subscription
        cy.get('#user-table thead tr th').eq(5)

        //Status
        cy.get('#user-table thead tr th').eq(6)

        //Actions
        cy.get('#user-table thead tr th').eq(7)

        //Table data
        cy.get('#user-table tbody')
    })
})

