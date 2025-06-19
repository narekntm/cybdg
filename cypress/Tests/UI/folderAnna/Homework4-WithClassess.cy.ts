import { UserManagmentPage } from "Pages/UserManagmentPage";

describe('Tests for page "User Management Cypress Sandbox"', () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html");
  });

  function adminLogin(email: any, password: any) {
    UserManagmentPage.adminEmailInput().type(email);
    UserManagmentPage.adminPasswordInput().type(password);
    UserManagmentPage.adminLoginButton().click();
  }

  function adminLogout() {
    adminLogin("admin@example.com", "admin123");
    UserManagmentPage.userButtonLogout().click();
  }
  function userCreation() {
    UserManagmentPage.userFullName().type("Anna");
    UserManagmentPage.userRole().select("Admin");
    UserManagmentPage.userAge().type("30");
    UserManagmentPage.userEmail().type("test@test.com");
    UserManagmentPage.userGendeFemale().click();
    UserManagmentPage.userButtonSave().click();
  }

  describe("Admin Login", () => {
    it("Admin login with valid credentials", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
    });
    it("Admin login with valid email and invalid password", () => {
      adminLogin("admin@example.com", "wrongPass");
      UserManagmentPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with invalid email and valid password", () => {
      adminLogin("wrongEmail", "admin123");
      UserManagmentPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it(" Admin login with empty credentials", () => {
      adminLogin(" ", " ");
      UserManagmentPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with empty email and valid password", () => {
      adminLogin(" ", "admin123");
      UserManagmentPage.adminError().should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Admin login with valid email and empty password", () => {
      adminLogin("admin@example.com", " ");
      UserManagmentPage.adminError().should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Logout from the admin account", () => {
      adminLogout();
      UserManagmentPage.userButtonLogout().should("not.be.visible");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userTableRow()
        .eq(0)
        .within(() => {
          cy.get("button.delete-btn").click();
        });
      cy.get("#confirm-modal .modal-content");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userTableRow()
        .eq(0)
        .within(() => {
          cy.get("button.delete-btn").click();
        });
      cy.get("#confirm-modal .modal-content").should("be.visible");
    });

    it("Check the UI of the Login As Admin section", () => {
      cy.get("h2").eq(0).should("contain", "Login as Admin");
      cy.get('label[for="admin-email"]').should("be.visible").should("have.text", "Email");
      cy.get('label[for="admin-password"]').should("be.visible").should("have.text", "Password");
      UserManagmentPage.adminLoginButton().should("be.visible").should("have.text", "Login");
    });
  });

  describe("Add New User", () => {
    it("New user creation in a viewer mode", () => {
      userCreation();
      UserManagmentPage.userTableRow().last().find("td").eq(0).should("have.text", "Anna").and("be.visible");
    });
    it("New user creation (logged in as admin)", () => {
      adminLogin("admin@example.com", "admin123");
      userCreation();
      UserManagmentPage.userTableRow().last().find("td").eq(0).should("have.text", "Anna");
    });

    it("Creating a new user with empty fields", () => {
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("have.length", 5);
    });

    it("Creating a new user with filling only the Full Name", () => {
      UserManagmentPage.userFullName().type("Anna");
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("not.contain", "Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Creating a new user with selecting only Role", () => {
      UserManagmentPage.userRole().select("Admin");
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("not.contain", "Role is required.");
    });

    it("Creating a new user with filling only the Age field", () => {
      UserManagmentPage.userAge().type("30");
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("not.contain", "Age must be between 1 and 99.");
    });

    it("Creating a new user with filling only the Email field", () => {
      UserManagmentPage.userEmail().type("test@test.com");
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("not.contain", "Valid email is required.");
    });

    it("Creating a new user with choosing only Gender", () => {
      UserManagmentPage.userGendeFemale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("not.contain", "Gender selection is required.");
    });

    it("Creating a new user with wrong Full Name format", () => {
      UserManagmentPage.userFullName().type("Anna Gevorgyan @123");
      UserManagmentPage.userRole().select("Admin");
      UserManagmentPage.userAge().type("30");
      UserManagmentPage.userEmail().type("test@test.com");
      UserManagmentPage.userGendeFemale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("contain", "Name must be 1–20 letters only (no spaces or symbols).");
      UserManagmentPage.userErorrs().should("have.length", 1);
      UserManagmentPage.userTableRow().should("have.length", 3);
    });
    it("Creating a new user with wrong Age format", () => {
      UserManagmentPage.userFullName().type("Anna");
      UserManagmentPage.userRole().select("Admin");
      UserManagmentPage.userAge().type("-100");
      UserManagmentPage.userEmail().type("test@test.com");
      UserManagmentPage.userGendeFemale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("contain", "Age must be between 1 and 99.");
      UserManagmentPage.userErorrs().should("have.length", 1);
      UserManagmentPage.userTableRow().should("have.length", 3);
    });
    it("Creating a new user with wrong Email format", () => {
      UserManagmentPage.userFullName().type("Anna");
      UserManagmentPage.userRole().select("Admin");
      UserManagmentPage.userAge().type("30");
      UserManagmentPage.userEmail().type("wrongEmail@.");
      UserManagmentPage.userGendeFemale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userErorrs().should("contain", "Valid email is required.");
      UserManagmentPage.userErorrs().should("have.length", 1);
      UserManagmentPage.userTableRow().should("have.length", 3);
    });
    it(" Check the UI of the Add New User section", () => {
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userLabelFullname().should("be.visible").should("have.text", "Full Name");
      UserManagmentPage.userLabelRole().should("be.visible").should("have.text", "Role");
      UserManagmentPage.userLabelAge().should("be.visible").should("have.text", "Age");
      UserManagmentPage.userLabelEmail().should("be.visible").should("have.text", "Email");
      UserManagmentPage.userGenderMale().parents("label").parent().siblings("label").should("be.visible").should("have.text", "Gender");
      UserManagmentPage.userInputNewsletter()
        .parents("label")
        .parent()
        .siblings("label")
        .should("be.visible")
        .should("have.text", "Subscribe to");
      UserManagmentPage.userButtonSave().should("be.visible").should("have.text", "Save");
    });
  });
  describe("User Table", () => {
    it(" Trying to delete a user while being logged out", () => {
      UserManagmentPage.userButtonLogout().should("not.be.visible");
      UserManagmentPage.userTableRow().should("have.length", 3);
      UserManagmentPage.userTableDelete().click();
      UserManagmentPage.userDeleteError().should("have.text", "Admin login required to delete Admin-level users.");
    });
    it(" Trying to delete a user being an admin", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().should("have.length", 3);
      UserManagmentPage.userTableDelete().click();
      UserManagmentPage.userTableModal().should("be.visible");
      UserManagmentPage.userTableConfirm().should("be.visible").click();
      UserManagmentPage.userTableRow().should("have.length", 2);
    });
    it(' Make sure that clicking on the "Cancel" button does not delete the user', () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().should("have.length", 3);
      UserManagmentPage.userTableDelete().click();
      UserManagmentPage.userTableModal().should("be.visible");
      UserManagmentPage.userModalCancel().should("have.text", "Cansel").click();
      UserManagmentPage.userTableRow().should("have.length", 3);
    });
    it("Deactivate a user(logged out user)", () => {
      UserManagmentPage.userButtonLogout().should("not.be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(6).should("have.text", "Active");
      UserManagmentPage.userTableDeactivate().click();
      UserManagmentPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      UserManagmentPage.userTableRow().first().find("td").eq(6).should("have.text", "Inactive");
    });
    it(" Deactivate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(6).should("have.text", "Active");
      UserManagmentPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate").click();
      UserManagmentPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      UserManagmentPage.userTableRow().first().find("td").eq(6).should("have.text", "Inactive");
    });
    it(" Activate a user(logged out user)", () => {
      UserManagmentPage.userButtonLogout().should("not.be.visible");
      UserManagmentPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Inactive");
      UserManagmentPage.userTableActivate().click();
      UserManagmentPage.userTableDeactivate().should("have.text", "Deactivate");
      UserManagmentPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it(" Activate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Inactive");
      UserManagmentPage.userTableActivate().click();
      UserManagmentPage.userTableDeactivate().should("have.text", "Deactivate");
      UserManagmentPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it(" Make sure the Edit User section becomes active when clicking on the Edit button(logged out user)", () => {
      UserManagmentPage.userButtonLogout().should("not.be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableEdit().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagmentPage.userFullName().should("have.value", "Alice");
    });
    it(" Make sure the Edit User section becomes active when clicking on the Edit button(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableEdit().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagmentPage.userFullName().should("have.value", "Alice");
    });
    it(" Check that the user update flow works properly(logged out user)", () => {
      UserManagmentPage.userButtonLogout().should("not.be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagmentPage.userTableRow().first().find("td").eq(1).should("have.text", "Admin");
      UserManagmentPage.userTableRow().first().find("td").eq(2).should("have.text", "30");
      UserManagmentPage.userTableRow().first().find("td").eq(3).should("have.text", "alice@site.com");
      UserManagmentPage.userTableRow().first().find("td").eq(4).should("have.text", "Female");
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableEdit().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagmentPage.userFullName().clear().type("Max");
      UserManagmentPage.userRole().select("Viewer");
      UserManagmentPage.userAge().clear().type("26");
      UserManagmentPage.userEmail().clear().type("example@test.com");
      UserManagmentPage.userGenderMale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Max");
      UserManagmentPage.userTableRow().first().find("td").eq(1).should("have.text", "Viewer");
      UserManagmentPage.userTableRow().first().find("td").eq(2).should("have.text", "26");
      UserManagmentPage.userTableRow().first().find("td").eq(3).should("have.text", "example@test.com");
      UserManagmentPage.userTableRow().first().find("td").eq(4).should("have.text", "Male");
    });
    it(" Check that the user update flow works properly(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagmentPage.userButtonLogout().should("be.visible");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagmentPage.userTableRow().first().find("td").eq(1).should("have.text", "Admin");
      UserManagmentPage.userTableRow().first().find("td").eq(2).should("have.text", "30");
      UserManagmentPage.userTableRow().first().find("td").eq(3).should("have.text", "alice@site.com");
      UserManagmentPage.userTableRow().first().find("td").eq(4).should("have.text", "Female");
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableEdit().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagmentPage.userFullName().clear().type("Max");
      UserManagmentPage.userRole().select("Viewer");
      UserManagmentPage.userAge().clear().type("26");
      UserManagmentPage.userEmail().clear().type("example@test.com");
      UserManagmentPage.userGenderMale().click();
      UserManagmentPage.userButtonSave().click();
      UserManagmentPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagmentPage.userTableRow().first().find("td").eq(0).should("have.text", "Max");
      UserManagmentPage.userTableRow().first().find("td").eq(1).should("have.text", "Viewer");
      UserManagmentPage.userTableRow().first().find("td").eq(2).should("have.text", "26");
      UserManagmentPage.userTableRow().first().find("td").eq(3).should("have.text", "example@test.com");
      UserManagmentPage.userTableRow().first().find("td").eq(4).should("have.text", "Male");
    });
  });
});

// describe('Tests for section  "User table"', () => {

//   it('Checks the visibility of the user table', () => {
// //Checking the visibility of the table column fields

// cy.get('h2').eq(2).should('contain', "User Table").and('be.visible')
// cy.get('#user-table').should('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(0).should('contain', "Name").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(1).should('contain', "Role").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(2).should('contain', "Age").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(3).should('contain', "Email").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(4).should('contain', "Gender").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(5).should('contain', "Subscription").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(6).should('contain', "Status").and('be.visible')
// cy.get('#user-table thead tr:first').find('th').eq(7).should('contain', "Actions").and('be.visible')

// //Checking the visibility of the first row and its elements
// cy.get('#user-table tbody tr').eq(0).should('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(0).should('contain', "Alice").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(1).should('contain', "Admin").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(2).should('contain', "30").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(3).should('contain', "alice@site.com").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(4).should('contain', "Female").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(5).should('contain', "Newsletter").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td').eq(6).should('contain', "Active").and('be.visible')

// cy.get('#user-table tbody tr:first').find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
// cy.get('#user-table tbody tr:first').find('td:last').find('.status-btn').should('contain', "Deactivate").and('be.visible')
// //Checking the visibility of the second row and its elements
//  cy.get('#user-table tbody tr').eq(1).should('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(0).should('contain', "Bob").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(1).should('contain', "Viewer").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(2).should('contain', "25").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(3).should('contain', "bob@site.com").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(4).should('contain', "Male").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td').eq(5).should('contain', "Product Updates").and('be.visible')
//  //cy.get('#user-table').find('tbody tr').eq(1).find('td:last').should('contain', "Inactive").and('be.vicible') //This row is invalid

//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.btn-primary.status-btn').should('contain', "Activate").and('be.visible')

// //Checking the visibility of the third row and its elements
//  cy.get('#user-table tbody tr').eq(2).should('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(0).should('contain', "Eve").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(1).should('contain', "Editor").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(2).should('contain', "28").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(3).should('contain', "eve@site.com").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(4).should('contain', "Other").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(5).should('contain', "Newsletter, Product Updates").and('be.visible')
//  cy.get('#user-table tbody tr').eq(2).find('td').eq(6).should('contain', "Active").and('be.visible')

//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.edit-btn').should('contain', "Edit").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.delete-btn').should('contain', "Delete").and('be.visible')
//  cy.get('#user-table tbody tr').eq(1).find('td:last').find('.btn-primary.status-btn').should('contain', "Activate").and('be.visible')

//     })
//   })

// })
