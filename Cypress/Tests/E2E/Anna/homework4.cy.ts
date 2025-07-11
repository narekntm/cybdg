import { UserManagementPage } from "Pages/Anna/UserManagementPage";

describe('Tests for page "User Management Cypress Sandbox"', () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html");
  });

  function adminLogin(email: string, password: string) {
    UserManagementPage.adminEmailInput().type(email);
    UserManagementPage.adminPasswordInput().type(password);
    return UserManagementPage.adminLoginButton().click();
  }

  function adminLogout() {
    adminLogin("admin@example.com", "admin123");
    return UserManagementPage.userButtonLogout().click();
  }
  function userCreation() {
    UserManagementPage.userFullName().type("Anna");
    UserManagementPage.userRole().select("Admin");
    UserManagementPage.userAge().type("30");
    UserManagementPage.userEmail().type("test@test.com");
    UserManagementPage.userGendeFemale().click();
    return UserManagementPage.userButtonSave().click();
  }

  describe("Admin Login", () => {
    it("Admin login with valid credentials", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
    });
    it("Admin login with valid email and invalid password", () => {
      adminLogin("admin@example.com", "wrongPass");
      UserManagementPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with invalid email and valid password", () => {
      adminLogin("wrongEmail", "admin123");
      UserManagementPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it(" Admin login with empty credentials", () => {
      adminLogin(" ", " ");
      UserManagementPage.adminError().should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with empty email and valid password", () => {
      adminLogin(" ", "admin123");
      UserManagementPage.adminError().should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Admin login with valid email and empty password", () => {
      adminLogin("admin@example.com", " ");
      UserManagementPage.adminError().should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Logout from the admin account", () => {
      adminLogout();
      UserManagementPage.userButtonLogout().should("not.be.visible");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userTableRow()
        .eq(0)
        .within(() => {
          cy.get("button.delete-btn").click();
        });
      cy.get("#confirm-modal .modal-content");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userTableRow()
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
      UserManagementPage.adminLoginButton().should("be.visible").should("have.text", "Login");
    });
  });

  describe("Add New User", () => {
    it("New user creation in a viewer mode", () => {
      userCreation();
      UserManagementPage.userTableRow().last().find("td").eq(0).should("have.text", "Anna").and("be.visible");
    });
    it("New user creation (logged in as admin)", () => {
      adminLogin("admin@example.com", "admin123");
      userCreation();
      UserManagementPage.userTableRow().last().find("td").eq(0).should("have.text", "Anna");
    });

    it("Creating a new user with empty fields", () => {
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("have.length", 5);
    });

    it("Creating a new user with filling only the Full Name", () => {
      UserManagementPage.userFullName().type("Anna");
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("not.contain", "Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Creating a new user with selecting only Role", () => {
      UserManagementPage.userRole().select("Admin");
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("not.contain", "Role is required.");
    });

    it("Creating a new user with filling only the Age field", () => {
      UserManagementPage.userAge().type("30");
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("not.contain", "Age must be between 1 and 99.");
    });

    it("Creating a new user with filling only the Email field", () => {
      UserManagementPage.userEmail().type("test@test.com");
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("not.contain", "Valid email is required.");
    });

    it("Creating a new user with choosing only Gender", () => {
      UserManagementPage.userGendeFemale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("not.contain", "Gender selection is required.");
    });

    it("Creating a new user with wrong Full Name format", () => {
      UserManagementPage.userFullName().type("Anna Gevorgyan @123");
      UserManagementPage.userRole().select("Admin");
      UserManagementPage.userAge().type("30");
      UserManagementPage.userEmail().type("test@test.com");
      UserManagementPage.userGendeFemale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("contain", "Name must be 1–20 letters only (no spaces or symbols).");
      UserManagementPage.userErorrs().should("have.length", 1);
      UserManagementPage.userTableRow().should("have.length", 3);
    });
    it("Creating a new user with wrong Age format", () => {
      UserManagementPage.userFullName().type("Anna");
      UserManagementPage.userRole().select("Admin");
      UserManagementPage.userAge().type("-100");
      UserManagementPage.userEmail().type("test@test.com");
      UserManagementPage.userGendeFemale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("contain", "Age must be between 1 and 99.");
      UserManagementPage.userErorrs().should("have.length", 1);
      UserManagementPage.userTableRow().should("have.length", 3);
    });
    it("Creating a new user with wrong Email format", () => {
      UserManagementPage.userFullName().type("Anna");
      UserManagementPage.userRole().select("Admin");
      UserManagementPage.userAge().type("30");
      UserManagementPage.userEmail().type("wrongEmail@.");
      UserManagementPage.userGendeFemale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userErorrs().should("contain", "Valid email is required.");
      UserManagementPage.userErorrs().should("have.length", 1);
      UserManagementPage.userTableRow().should("have.length", 3);
    });
    it(" Check the UI of the Add New User section", () => {
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userLabelFullname().should("be.visible").should("have.text", "Full Name");
      UserManagementPage.userLabelRole().should("be.visible").should("have.text", "Role");
      UserManagementPage.userLabelAge().should("be.visible").should("have.text", "Age");
      UserManagementPage.userLabelEmail().should("be.visible").should("have.text", "Email");
      UserManagementPage.userGenderMale().parents("label").parent().siblings("label").should("be.visible").should("have.text", "Gender");
      UserManagementPage.userInputNewsletter()
        .parents("label")
        .parent()
        .siblings("label")
        .should("be.visible")
        .should("have.text", "Subscribe to");
      UserManagementPage.userButtonSave().should("be.visible").should("have.text", "Save");
    });
  });
  describe("User Table", () => {
    it(" Trying to delete a user while being logged out", () => {
      UserManagementPage.userButtonLogout().should("not.be.visible");
      UserManagementPage.userTableRow().should("have.length", 3);
      UserManagementPage.userTableDelete().click();
      UserManagementPage.userDeleteError().should("have.text", "Admin login required to delete Admin-level users.");
    });
    it(" Trying to delete a user being an admin", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().should("have.length", 3);
      UserManagementPage.userTableDelete().click();
      UserManagementPage.userTableModal().should("be.visible");
      UserManagementPage.userTableConfirm().should("be.visible").click();
      UserManagementPage.userTableRow().should("have.length", 2);
    });
    it(' Make sure that clicking on the "Cancel" button does not delete the user', () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().should("have.length", 3);
      UserManagementPage.userTableDelete().click();
      UserManagementPage.userTableModal().should("be.visible");
      UserManagementPage.userModalCancel().should("have.text", "Cansel").click();
      UserManagementPage.userTableRow().should("have.length", 3);
    });
    it("Deactivate a user(logged out user)", () => {
      UserManagementPage.userButtonLogout().should("not.be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(6).should("have.text", "Active");
      UserManagementPage.userTableDeactivate().click();
      UserManagementPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      UserManagementPage.userTableRow().first().find("td").eq(6).should("have.text", "Inactive");
    });
    it(" Deactivate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(6).should("have.text", "Active");
      UserManagementPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate").click();
      UserManagementPage.userTableRow().first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      UserManagementPage.userTableRow().first().find("td").eq(6).should("have.text", "Inactive");
    });
    it(" Activate a user(logged out user)", () => {
      UserManagementPage.userButtonLogout().should("not.be.visible");
      UserManagementPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Inactive");
      UserManagementPage.userTableActivate().click();
      UserManagementPage.userTableDeactivate().should("have.text", "Deactivate");
      UserManagementPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it(" Activate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Inactive");
      UserManagementPage.userTableActivate().click();
      UserManagementPage.userTableDeactivate().should("have.text", "Deactivate");
      UserManagementPage.userTableRow().eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it(" Make sure the Edit User section becomes active when clicking on the Edit button(logged out user)", () => {
      UserManagementPage.userButtonLogout().should("not.be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableEdit().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullName().should("have.value", "Alice");
    });
    it(" Make sure the Edit User section becomes active when clicking on the Edit button(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableEdit().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullName().should("have.value", "Alice");
    });
    it(" Check that the user update flow works properly(logged out user)", () => {
      UserManagementPage.userButtonLogout().should("not.be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagementPage.userTableRow().first().find("td").eq(1).should("have.text", "Admin");
      UserManagementPage.userTableRow().first().find("td").eq(2).should("have.text", "30");
      UserManagementPage.userTableRow().first().find("td").eq(3).should("have.text", "alice@site.com");
      UserManagementPage.userTableRow().first().find("td").eq(4).should("have.text", "Female");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableEdit().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullName().clear().type("Max");
      UserManagementPage.userRole().select("Viewer");
      UserManagementPage.userAge().clear().type("26");
      UserManagementPage.userEmail().clear().type("example@test.com");
      UserManagementPage.userGenderMale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Max");
      UserManagementPage.userTableRow().first().find("td").eq(1).should("have.text", "Viewer");
      UserManagementPage.userTableRow().first().find("td").eq(2).should("have.text", "26");
      UserManagementPage.userTableRow().first().find("td").eq(3).should("have.text", "example@test.com");
      UserManagementPage.userTableRow().first().find("td").eq(4).should("have.text", "Male");
    });
    it(" Check that the user update flow works properly(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      UserManagementPage.userButtonLogout().should("be.visible");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Alice");
      UserManagementPage.userTableRow().first().find("td").eq(1).should("have.text", "Admin");
      UserManagementPage.userTableRow().first().find("td").eq(2).should("have.text", "30");
      UserManagementPage.userTableRow().first().find("td").eq(3).should("have.text", "alice@site.com");
      UserManagementPage.userTableRow().first().find("td").eq(4).should("have.text", "Female");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableEdit().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullName().clear().type("Max");
      UserManagementPage.userRole().select("Viewer");
      UserManagementPage.userAge().clear().type("26");
      UserManagementPage.userEmail().clear().type("example@test.com");
      UserManagementPage.userGenderMale().click();
      UserManagementPage.userButtonSave().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableRow().first().find("td").eq(0).should("have.text", "Max");
      UserManagementPage.userTableRow().first().find("td").eq(1).should("have.text", "Viewer");
      UserManagementPage.userTableRow().first().find("td").eq(2).should("have.text", "26");
      UserManagementPage.userTableRow().first().find("td").eq(3).should("have.text", "example@test.com");
      UserManagementPage.userTableRow().first().find("td").eq(4).should("have.text", "Male");
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
