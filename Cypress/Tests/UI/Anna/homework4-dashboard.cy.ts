describe('Tests for page "User Management Cypress Sandbox"', () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/Resources/htmls/CSS/user_management.html");
  });

  function adminLogin(email: string, password: string) {
    cy.get("#admin-email").type(email);
    cy.get("#admin-password").type(password);
    cy.get('#admin-login-form button[type="submit"]').click();
    return cy.get('form[id="admin-login-form"] button[type="submit"]').click();
  }

  function adminLogout() {
    adminLogin("admin@example.com", "admin123");
    return cy.get("#logout-btn").click();
  }

  function userCreation() {
    cy.get('input[id="name"]').type("Anna");
    cy.get('select[id="role"]').select("Admin");
    cy.get('input[id="age"]').type("30");
    cy.get('input[id="email"]').type("test@test.com");
    cy.get('input[value="Female"]').click();
    return cy.get('form[id="user-form"] button[type="submit"]').click();
  }

  describe("Admin Login", () => {
    it("Admin login with valid credentials", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
    });
    it("Admin login with valid email and invalid password", () => {
      adminLogin("admin@example.com", "wrongPass");
      cy.get("#login-status").should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with invalid email and valid password", () => {
      adminLogin("wrongEmail", "admin123");
      cy.get("#login-status").should("contain", "Invalid credentials").should("be.visible");
    });
    it(" Admin login with empty credentials", () => {
      adminLogin(" ", " ");
      cy.get("#login-status").should("contain", "Invalid credentials").should("be.visible");
    });
    it("Admin login with empty email and valid password", () => {
      adminLogin(" ", "admin123");
      cy.get("#login-status").should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Admin login with valid email and empty password", () => {
      adminLogin("admin@example.com", " ");
      cy.get("#login-status").should("have.text", "Invalid credentials").should("be.visible");
    });

    it("Logout from the admin account", () => {
      adminLogout();
      cy.get("#logout-btn").should("not.be.visible");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#user-table tbody tr")
        .eq(0)
        .within(() => {
          cy.get("button.delete-btn").click();
        });
      cy.get("#confirm-modal .modal-content");
    });

    it("Admin delete become active after login", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#user-table tbody tr")
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
      cy.get('form[id="admin-login-form"] button[type="submit"]').should("be.visible").should("have.text", "Login");
    });
  });

  describe("Add New User", () => {
    it("New user creation in a viewer mode", () => {
      userCreation();
      cy.get("#user-table tbody tr").last().find("td").eq(0).should("have.text", "Anna").and("be.visible");
    });
    it("New user creation (logged in as admin)", () => {
      adminLogin("admin@example.com", "admin123");
      userCreation();
      cy.get("#user-table tbody tr").last().find("td").eq(0).should("have.text", "Anna");
    });

    it("Creating a new user with empty fields", () => {
      cy.get('#user-form button[type="submit"]').click();
      cy.get("#form-errors ul li").should("have.length", 5);
    });

    it("Creating a new user with filling only the Full Name", () => {
      cy.get('input[id="name"]').type("Anna");
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("not.contain", "Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Creating a new user with selecting only Role", () => {
      cy.get('select[id="role"]').select("Admin");
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("not.contain", "Role is required.");
    });

    it("Creating a new user with filling only the Age field", () => {
      cy.get('input[id="age"]').type("30");
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("not.contain", "Age must be between 1 and 99.");
    });

    it("Creating a new user with filling only the Email field", () => {
      cy.get('input[id="email"]').type("test@test.com");
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("not.contain", "Valid email is required.");
    });

    it("Creating a new user with choosing only Gender", () => {
      cy.get('input[value="Female"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("not.contain", "Gender selection is required.");
    });

    it("Creating a new user with wrong Full Name format", () => {
      cy.get('input[id="name"]').type("Anna Gevorgyan @123");
      cy.get('select[id="role"]').select("Admin");
      cy.get('input[id="age"]').type("30");
      cy.get('input[id="email"]').type("test@test.com");
      cy.get('input[value="Female"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("contain", "Name must be 1–20 letters only (no spaces or symbols).");
      cy.get("#form-errors ul li").should("have.length", 1);
      cy.get("#user-table tbody tr").should("have.length", 3);
    });
    it("Creating a new user with wrong Age format", () => {
      cy.get('input[id="name"]').type("Ani");
      cy.get('select[id="role"]').select("Admin");
      cy.get('input[id="age"]').type("-100");
      cy.get('input[id="email"]').type("test@test.com");
      cy.get('input[value="Female"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("contain", "Age must be between 1 and 99.");
      cy.get("#form-errors ul li").should("have.length", 1);
      cy.get("#user-table tbody tr").should("have.length", 3);
    });
    it("Creating a new user with wrong Email format", () => {
      cy.get('input[id="name"]').type("Ani");
      cy.get('select[id="role"]').select("Admin");
      cy.get('input[id="age"]').type("15");
      cy.get('input[id="email"]').type("wrongEmail@.");
      cy.get('input[value="Female"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-errors ul li").should("contain", "Valid email is required.");
      cy.get("#form-errors ul li").should("have.length", 1);
      cy.get("#user-table tbody tr").should("have.length", 3);
    });
    it(" Check the UI of the Add New User section", () => {
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get('label[for="name"]').should("be.visible").should("have.text", "Full Name");
      cy.get('label[for="role"]').should("be.visible").should("have.text", "Role");
      cy.get('label[for="age"]').should("be.visible").should("have.text", "Age");
      cy.get('label[for="email"]').should("be.visible").should("have.text", "Email");
      cy.get('input[value="Male"]').parents("label").parent().siblings("label").should("be.visible").should("have.text", "Gender");
      cy.get('input[value="Newsletter"]')
        .parents("label")
        .parent()
        .siblings("label")
        .should("be.visible")
        .should("have.text", "Subscribe to");
      cy.get('form[id="user-form"] button[type="submit"]').should("be.visible").should("have.text", "Save");
    });
  });
  describe("User Table", () => {
    it("1. Trying to delete a user while being logged out", () => {
      cy.get("#logout-btn").should("not.be.visible");
      cy.get("#user-table tbody tr").should("have.length", 3);
      cy.get("#user-table tbody tr").first().find("td").find(".btn-danger.delete-btn").click();
      cy.get("#admin-delete-error").should("have.text", "Admin login required to delete Admin-level users.");
    });
    it("2. Trying to delete a user being an admin", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").should("have.length", 3);
      cy.get("#user-table tbody tr").first().find("td").find(".btn-danger.delete-btn").click();
      cy.get(".modal-content").should("be.visible");
      cy.get("#confirm-delete").should("be.visible").click();
      cy.get("#user-table tbody tr").should("have.length", 2);
    });
    it('3. Make sure that clicking on the "Cancel" button does not delete the user', () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").should("have.length", 3);
      cy.get("#user-table tbody tr").first().find("td").find(".btn-danger.delete-btn").click();
      cy.get(".modal-content").should("be.visible");
      cy.get("#cancel-delete").should("be.visible").click();
      cy.get("#user-table tbody tr").should("have.length", 3);
    });
    it("4. Deactivate a user(logged out user)", () => {
      cy.get("#logout-btn").should("not.be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(6).should("have.text", "Active");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate").click();
      cy.get("#user-table tbody tr").first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      cy.get("#user-table tbody tr").first().find("td").eq(6).should("have.text", "Inactive");
    });
    it("5. Deactivate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(6).should("have.text", "Active");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate").click();
      cy.get("#user-table tbody tr").first().find("td").find(".btn-primary.status-btn").should("have.text", "Activate");
      cy.get("#user-table tbody tr").first().find("td").eq(6).should("have.text", "Inactive");
    });
    it("6. Activate a user(logged out user)", () => {
      cy.get("#logout-btn").should("not.be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(6).should("have.text", "Inactive");
      cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn").should("have.text", "Activate").click();
      cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it("7. Activate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(6).should("have.text", "Inactive");
      cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn").should("have.text", "Activate").click();
      cy.get("#user-table tbody tr").eq(1).find("td").find(".btn-primary.status-btn").should("have.text", "Deactivate");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(6).should("have.text", "Active");
    });
    it("8. Make sure the Edit User section becomes active when clicking on the Edit button(logged out user)", () => {
      cy.get("#logout-btn").should("not.be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Alice");
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn").click();
      cy.get("#form-title").should("be.visible").should("have.text", "Edit User");
      cy.get('input[id="name"]').should("have.value", "Alice");
    });
    it("9. Make sure the Edit User section becomes active when clicking on the Edit button(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Alice");
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn").click();
      cy.get("#form-title").should("be.visible").should("have.text", "Edit User");
      cy.get('input[id="name"]').should("have.value", "Alice");
    });
    it("10. Check that the user update flow works properly(logged out user)", () => {
      cy.get("#logout-btn").should("not.be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Alice");
      cy.get("#user-table tbody tr").first().find("td").eq(1).should("have.text", "Admin");
      cy.get("#user-table tbody tr").first().find("td").eq(2).should("have.text", "30");
      cy.get("#user-table tbody tr").first().find("td").eq(3).should("have.text", "alice@site.com");
      cy.get("#user-table tbody tr").first().find("td").eq(4).should("have.text", "Female");
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn").click();
      cy.get("#form-title").should("be.visible").should("have.text", "Edit User");
      cy.get('input[id="name"]').clear().type("Max");
      cy.get('select[id="role"]').select("Viewer");
      cy.get('input[id="age"]').clear().type("26");
      cy.get('input[id="email"]').clear().type("example@test.com");
      cy.get('input[value="Male"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Max");
      cy.get("#user-table tbody tr").first().find("td").eq(1).should("have.text", "Viewer");
      cy.get("#user-table tbody tr").first().find("td").eq(2).should("have.text", "26");
      cy.get("#user-table tbody tr").first().find("td").eq(3).should("have.text", "example@test.com");
      cy.get("#user-table tbody tr").first().find("td").eq(4).should("have.text", "Male");
    });
    it("11. Check that the user update flow works properly(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.get("#logout-btn").should("be.visible");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Alice");
      cy.get("#user-table tbody tr").first().find("td").eq(1).should("have.text", "Admin");
      cy.get("#user-table tbody tr").first().find("td").eq(2).should("have.text", "30");
      cy.get("#user-table tbody tr").first().find("td").eq(3).should("have.text", "alice@site.com");
      cy.get("#user-table tbody tr").first().find("td").eq(4).should("have.text", "Female");
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").find(".btn-secondary.edit-btn").click();
      cy.get("#form-title").should("be.visible").should("have.text", "Edit User");
      cy.get('input[id="name"]').clear().type("Max");
      cy.get('select[id="role"]').select("Viewer");
      cy.get('input[id="age"]').clear().type("26");
      cy.get('input[id="email"]').clear().type("example@test.com");
      cy.get('input[value="Male"]').click();
      cy.get('form[id="user-form"] button[type="submit"]').click();
      cy.get("#form-title").should("be.visible").should("have.text", "Add New User");
      cy.get("#user-table tbody tr").first().find("td").eq(0).should("have.text", "Max");
      cy.get("#user-table tbody tr").first().find("td").eq(1).should("have.text", "Viewer");
      cy.get("#user-table tbody tr").first().find("td").eq(2).should("have.text", "26");
      cy.get("#user-table tbody tr").first().find("td").eq(3).should("have.text", "example@test.com");
      cy.get("#user-table tbody tr").first().find("td").eq(4).should("have.text", "Male");
    });
  });

  describe('Tests for section  "User table"', () => {
    it("Checks the visibility of the user table", () => {
      //Checking the visibility of the table column fields

      cy.get("h2").eq(2).should("contain", "User Table").and("be.visible");
      cy.get("#user-table").should("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(0).should("contain", "Name").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(1).should("contain", "Role").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(2).should("contain", "Age").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(3).should("contain", "Email").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(4).should("contain", "Gender").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(5).should("contain", "Subscription").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(6).should("contain", "Status").and("be.visible");
      cy.get("#user-table thead tr:first").find("th").eq(7).should("contain", "Actions").and("be.visible");

      //Checking the visibility of the first row and its elements
      cy.get("#user-table tbody tr").eq(0).should("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(0).should("contain", "Alice").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(1).should("contain", "Admin").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(2).should("contain", "30").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(3).should("contain", "alice@site.com").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(4).should("contain", "Female").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(5).should("contain", "Newsletter").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td").eq(6).should("contain", "Active").and("be.visible");

      cy.get("#user-table tbody tr:first").find("td:last").find(".edit-btn").should("contain", "Edit").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td:last").find(".delete-btn").should("contain", "Delete").and("be.visible");
      cy.get("#user-table tbody tr:first").find("td:last").find(".status-btn").should("contain", "Deactivate").and("be.visible");
      //Checking the visibility of the second row and its elements
      cy.get("#user-table tbody tr").eq(1).should("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(0).should("contain", "Bob").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(1).should("contain", "Viewer").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(2).should("contain", "25").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(3).should("contain", "bob@site.com").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(4).should("contain", "Male").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td").eq(5).should("contain", "Product Updates").and("be.visible");
      //cy.get('#user-table').find('tbody tr').eq(1).find('td:last').should('contain', "Inactive").and('be.vicible') //This row is invalid

      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".edit-btn").should("contain", "Edit").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".delete-btn").should("contain", "Delete").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".btn-primary.status-btn").should("contain", "Activate").and("be.visible");

      //Checking the visibility of the third row and its elements
      cy.get("#user-table tbody tr").eq(2).should("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(0).should("contain", "Eve").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(1).should("contain", "Editor").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(2).should("contain", "28").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(3).should("contain", "eve@site.com").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(4).should("contain", "Other").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(5).should("contain", "Newsletter, Product Updates").and("be.visible");
      cy.get("#user-table tbody tr").eq(2).find("td").eq(6).should("contain", "Active").and("be.visible");

      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".edit-btn").should("contain", "Edit").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".delete-btn").should("contain", "Delete").and("be.visible");
      cy.get("#user-table tbody tr").eq(1).find("td:last").find(".btn-primary.status-btn").should("contain", "Activate").and("be.visible");
    });
  });
});
