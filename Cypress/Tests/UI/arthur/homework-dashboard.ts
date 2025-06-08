describe("Test scenarios for Admin Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://192.168.1.43:8080/Resources/htmls/CSS/homework.html");
  });

  it("Should fill in and submit the user form with valid data", () => {
    cy.get("#username").should("be.visible").type("testuser").should("have.value", "testuser");

    cy.get("#email").type("testuser@example.com").should("have.value", "testuser@example.com");

    cy.get("#role").select("Editor").should("have.value", "editor");

    cy.get("#newsletter").check().should("be.checked");

    cy.get('button[type="submit"]').contains("Submit").click();

    cy.get("#username").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#role").should("have.value", "");
    cy.get("#newsletter").should("not.be.checked");
  });

  it("Should check User table and edit data", () => {
    cy.get("table.user-table tbody tr").should("have.length", 3);
    cy.get("table.user-table tbody tr").eq(0).find("button").contains("Edit").click();
    cy.get("table.user-table tbody tr").eq(1).find("button").contains("Edit").click();
    cy.get("table.user-table tbody tr").eq(2).find("button").should("be.disabled");
  });

  it("Should check navigation and footer", () => {
    cy.get("aside.sidebar ul li a").should("have.length", 3);
    cy.get(".footer").should("contain", "© 2025 TestCorp");
  });

  it("Should check existence of modal and close it", () => {
    cy.get("table.user-table tbody tr").eq(0).find(".btn.small-btn").click();
    cy.get("#edit-modal").should("have.class", "active");
    cy.get("#edit-modal h2").should("have.text", "Edit User");
    cy.get("#edit-modal .close-modal").should("exist");
    cy.get("#edit-modal .close-modal").click();
    cy.get("#edit-modal").should("not.have.class", "active");
  });
});
