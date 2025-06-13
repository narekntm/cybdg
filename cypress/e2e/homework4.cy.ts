describe('Tests for page "User Management Cypress Sandbox"', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html')
    })


    context('Tests for section  "Login is Admin"', () => {


  it('visibility of elements on the page', () => {

cy.get('h2').eq(0).should('contain', 'Login as Admin')

cy.get('#admin-controls').find('strong').should('contain', "You are logged in as admin.").and('be.hidden')
cy.get('#logout-btn').should('contain', "Logout").and('be.hidden')

cy.get('[for = "admin-email"]').should('contain', 'Email').and('be.visible')
cy.get('#admin-email').should('be.visible')
cy.get('[for="admin-password"]').should('contain', 'Password').and('be.visible')
cy.get('#admin-password').should('be.visible')
cy.get('#login-status').should('be.hidden').and('contain', "Invalid credentials")
cy.get('section:first').find('button.btn-primary').should('contain', "Login").and('not.be.disabled').click()
cy.get('#login-status').should('contain', "Invalid credentials")

  })

  it('Test Case -> Admin Login with valid credentials', () => {
cy.get('[for = "admin-email"]').type('admin@example.com')
cy.get('#admin-password').type('admin123')
cy.get('section:first').find('button.btn-primary').click()
cy.get('#admin-controls').find('strong').should('contain', "You are logged in as admin.").and('be.visible')
cy.get('#logout-btn').should('contain', "Logout").and('be.visible').click().should('not.be.visible')
  })

  it('Test Case -> Admin login with valid email and invalid password', () => {
cy.get('[for = "admin-email"]').type('admin@example.com')
cy.get('#admin-password').type('qwerty123')
cy.get('section:first').find('button.btn-primary').click()
cy.get('#login-status').should('contain', "Invalid credentials")

  })

  it('Test Case -> Admin login with invalid email and valid password', () => {
cy.get('[for = "admin-email"]').type('.com')
cy.get('#admin-password').type('admin123')
cy.get('section:first').find('button.btn-primary').click()
cy.get('#login-status').should('contain', "Invalid credentials")

  })
  it('Test Case -> Admin login with empty credentials', () => {
cy.get('[for = "admin-email"]').type(' 0')
cy.get('#admin-password').type(' 0')
cy.get('section:first').find('button.btn-primary').click()
cy.get('#login-status').should('contain', "Invalid credentials")
  })

  it('Test Case -> Admin login with empty email and valid password', () => {
cy.get('[for = "admin-email"]').type(' 0')
cy.get('#admin-password').type('admin123')
cy.get('section:first').find('button.btn-primary').click()
cy.get('#login-status').should('contain', "Invalid credentials")
  })

  it('Test Case -> Admin login with valid email and empty password', () => {
 cy.get('[for = "admin-email"]').type('adminexample.com')
 cy.get('#admin-password').type(' 0')
 cy.get('section:first').find('button.btn-primary').click()
 cy.get('#login-status').should('contain', "Invalid credentials")
      })

    })
    





      context('Tests for section  "Add new User"', () => {
  it('Should check the  visibility of elements for  section "Add New User"', () => {

cy.get('#user-form > .full-width > .btn-primary[type ="submit"]').click()
cy.get('#form-errors >ul>li').eq(0).should('contain', "Name must be 1–20 letters only (no spaces or symbols)").and('be.visible')
cy.get('#form-errors >ul>li').eq(1).should('contain', "Role is required.").and('be.visible')
cy.get('#form-errors >ul>li').eq(2).should('contain', "Age must be between 1 and 99.").and('be.visible')
cy.get('#form-errors >ul>li').eq(3).should('contain', "Valid email is required.").and('be.visible')
cy.get('#form-errors >ul>li').eq(4).should('contain', "Gender selection is required.").and('be.visible')

cy.get('#form-title').should('contain', "Add New User").and('be.visible')


cy.get('[for = "name"]').should('contain', "Full Name").and('be.visible')
cy.get('#name').should('be.visible')
cy.get('[for = "role"]').should('contain', "Role").and('be.visible')
cy.get('#role').should('be.visible')
cy.get('[for = "age"]').should('contain', "Age").and('be.visible')
cy.get('#age').should('be.visible')
cy.get('[for = "email"]').should('contain', "Email").and('be.visible')
cy.get('#email').should('be.visible')

cy.get('[value = "Male"]').parent().parent().parent().find('label').eq(0)

cy.get('[value = "Male"]').and('be.visible')
cy.get('[value = "Male"]').parent().should('contain', "Male").and('be.visible')
cy.get('[value = "Female"]').and('be.visible')
cy.get('[value = "Female"]').parent().should('contain', "Female").and('be.visible')
cy.get('[value = "Other"]').and('be.visible')
cy.get('[value = "Other"]').parent().should('contain', "Other").and('be.visible')

cy.get('[value = "Newsletter"]').parent().parent().parent().find('label').eq(0)

cy.get('[value = "Newsletter"]').and('be.visible')
cy.get('[value = "Newsletter"]').parent('label').should('contain', "Newsletter").and('be.visible')

cy.get('[value = "Product Updates"]').and('be.visible')
cy.get('[value = "Product Updates"]').parent().should('contain', "Product Updates").and('be.visible')
cy.get(':checkbox').should('not.be.disabled')

cy.get('#user-form > .full-width > .btn-primary[type ="submit"]').should('have.text', "Save").and('be.visible')


}) 
    })


context('Tests for section  "User table"', () => {

  it('Checks the visibility of the user table', () => {
//Checking the visibility of the table column fields

cy.get('h2').eq(2).should('contain', "User Table").and('be.visible')
cy.get('#user-table').should('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(0).should('contain', "Name").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(1).should('contain', "Role").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(2).should('contain', "Age").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(3).should('contain', "Email").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(4).should('contain', "Gender").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(5).should('contain', "Subscription").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(6).should('contain', "Status").and('be.visible')
cy.get('#user-table thead tr:first').find('th').eq(7).should('contain', "Actions").and('be.visible')
//Checking the visibility of the first row and its elements
cy.get('#user-table tbody tr').eq(0).should('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(0).should('contain', "Alice").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(1).should('contain', "Admin").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(2).should('contain', "30").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(3).should('contain', "alice@site.com").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(4).should('contain', "Female").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(5).should('contain', "Newsletter").and('be.visible')
cy.get('#user-table tbody tr:first').find('td').eq(6).should('contain', "Active").and('be.visible')

cy.get('#user-table tbody tr:first').find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
cy.get('#user-table tbody tr:first').find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
cy.get('#user-table tbody tr:first').find('td:last').find('.status-btn').should('contain', "Deactivate").and('be.visible')
//Checking the visibility of the second row and its elements
 cy.get('#user-table tbody tr').eq(1).should('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(0).should('contain', "Bob").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(1).should('contain', "Viewer").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(2).should('contain', "25").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(3).should('contain', "bob@site.com").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(4).should('contain', "Male").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td').eq(5).should('contain', "Product Updates").and('be.visible')
 //cy.get('#user-table').find('tbody tr').eq(1).find('td:last').should('contain', "Inactive").and('be.vicible') //This row is invalid

 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.btn-primary.status-btn').should('contain', "Activate").and('be.visible')
 

//Checking the visibility of the third row and its elements
 cy.get('#user-table tbody tr').eq(2).should('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(0).should('contain', "Eve").and('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(1).should('contain', "Editor").and('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(2).should('contain', "28").and('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(3).should('contain', "eve@site.com").and('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(4).should('contain', "Other").and('be.visible')
 cy.get('#user-table tbody tr').eq(2).find('td').eq(5).should('contain', "Newsletter, Product Updates").and('be.visible') 
 cy.get('#user-table tbody tr').eq(2).find('td').eq(6).should('contain', "Active").and('be.visible') 

 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
 cy.get('#user-table tbody tr').eq(1).find('td:last').find('.btn-primary.status-btn').should('contain', "Activate").and('be.visible')
 




    })
  }) 

})






