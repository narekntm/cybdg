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

  function fillUserForm(user: { name: string; role: string; age: string; email: string; gender: string; subscriptions?: string[] }) {
    cy.get("#name").clear().type(user.name);
    cy.get("#role").select(user.role);
    cy.get("#age").clear().type(user.age);
    cy.get("#email").clear().type(user.email);
    cy.get(`input[name="gender"][value="${user.gender}"]`).check();

    if (user.subscriptions && user.subscriptions.length > 0) {
      user.subscriptions.forEach((sub) => {
        cy.get(`input[name="subscribe"][value="${sub}"]`).uncheck().check();
      });
    }
  }

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

  context("Adding new user", () => {
    beforeEach(() => {
      cy.visit(baseUrl);
    });

    it("Should add user with valid input", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");

      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthur@example.com",
        gender: "Male",
        subscriptions: ["Newsletter", "Product Updates"],
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();

      cy.contains("#user-table tr", "Arthur").within(() => {
        cy.get("button.delete-btn").should("be.visible").contains("Delete");
      });
    });

    it("Should submit form with all fields empty", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible");
      cy.get("#form-errors").within(() => {
        cy.contains("Name must be 1–20 letters only (no spaces or symbols).").should("exist");
        cy.contains("Role is required.").should("exist");
        cy.contains("Age must be between 1 and 99.").should("exist");
        cy.contains("Valid email is required.").should("exist");
        cy.contains("Gender selection is required.").should("exist");
      });
    });

    it("Should show error when name contains symbols", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");
      fillUserForm({
        name: "John@",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when name contains numbers", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");
      fillUserForm({
        name: "John123",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when name is too long", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");
      fillUserForm({
        name: "ArthurTheGreatAndPowerfulKingOfTheBrits",
        role: "Admin",
        age: "25",
        email: "test@example.com",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Name must be 1–20 letters only (no spaces or symbols).");
    });

    it("Should show error when no @ symbol", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");

      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthurtest.com",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when no domain", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");

      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "arthurtest@",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when no username part", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");

      fillUserForm({
        name: "Arthur",
        role: "Admin",
        age: "30",
        email: "@test.test",
        gender: "Male",
      });
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Valid email is required.");
    });

    it("Should show error when gender is not selected", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");
      cy.get("#name").type("Arthur");
      cy.get("#role").select("Admin");
      cy.get("#age").type("30");
      cy.get("#email").type("arthur@test.test");
      cy.get('button[type="submit"].btn-primary').contains("Save").click();
      cy.get("#form-errors").should("be.visible").contains("Gender selection is required.");
    });
  });

  context("Edit,Delete, Deactivate user", () => {
    beforeEach(() => {
      cy.visit(baseUrl);
    });

    it("Should edit existing user and update in the table", () => {
      loginAdmin();
      cy.get("#form-title").should("be.visible");

      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("button.edit-btn").click();
      });

      cy.get("#name").should("have.value", "Alice");
      cy.get("#role").should("have.value", "Admin");
      cy.get("#age").should("have.value", "30");
      cy.get("#email").should("have.value", "alice@site.com");
      cy.get(`input[name="subscribe"][value="Newsletter"]`).should("be.checked");

      fillUserForm({
        name: "AliceUpdatedName",
        role: "Editor",
        age: "35",
        email: "alice.updated@test.test",
        gender: "Female",
        subscriptions: ["Product Updates"],
      });

      cy.get('button[type="submit"].btn-primary').contains("Save").click();

      cy.contains("#user-table tr", "AliceUpdatedName").within(() => {
        cy.contains("Editor");
        cy.contains("35");
        cy.contains("alice.updated@test.test");
        cy.contains("Female");
        cy.contains("Product Updates");
      });
    });

    it("Should delete existing user and remove from the table", () => {
      loginAdmin();
      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("button.delete-btn").click();
      });

      cy.get("#confirm-modal").should("be.visible");
      cy.get("#cancel-delete").should("be.visible").click();
      cy.get("#confirm-modal").should("not.be.visible");
      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("button.delete-btn").should("be.visible").click();
      });
      cy.get("#confirm-modal").should("be.visible");
      cy.get("#confirm-delete").should("be.visible").click();
      cy.contains("#user-table tr", "Alice").should("not.exist");
    });

    it("Should deactivate and activate user", () => {
      loginAdmin();

      cy.contains("#user-table tr", "Alice").within(() => {
        cy.contains("Deactivate").click();
      });

      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("td").eq(6).should("contain", "Inactive");
        cy.contains("Activate").click();
      });

      cy.contains("#user-table tr", "Alice").within(() => {
        cy.get("td").eq(6).should("contain", "Active");
        cy.contains("Deactivate");
      });
    });
  });
});
