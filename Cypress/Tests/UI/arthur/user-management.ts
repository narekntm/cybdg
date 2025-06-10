describe("User Management Test Scenarios", () => {
  const baseUrl = "http://127.0.0.1:8080/Resources/htmls/CSS/user_management.html";

  const login = (email: string, password: string) => {
    cy.get("#admin-email").type(email);
    cy.get("#admin-password").type(password);
    cy.get('button[type="submit"].btn-primary').contains("Login").click();
  };

  const loginAdmin = () => {
    login("admin@example.com", "admin123");
    cy.get("#admin-controls").should("contain", "You are logged in as admin.");
    cy.get("#logout-btn").should("be.visible").contains("Logout");
  };

  context("Admin auth test cases", () => {
    beforeEach(() => {
      cy.visit(baseUrl);
    });

    it("Login with valid credentials", () => {
      loginAdmin();
    });

    it("Check login with invalid credentials", () => {
      login("invalid@admin.test", "wrongpassword");
      cy.get("#login-status").should("be.visible").contains("Invalid credentials");
    });

    it("Verify that the delete button is working after login", () => {
      loginAdmin();
      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("button.delete-btn").click();
      });
      cy.get("#confirm-modal").should("be.visible");
    });

    it("Should check error message on delete button without login", () => {
      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("button.delete-btn").click();
      });
      cy.get("#admin-delete-error").should("be.visible").and("contain", "Admin login required to delete Admin-level users.");
    });
  });
});
