describe("Admin Dashboard", () => {
    beforeEach(() => {
        cy.visit("http://127.0.0.1:5500/Resources/htmls/CSS/homework.html");
    });

    it("should fill out the user form correctly", () => {
        cy.get('#username').type('testuser');;
        cy.get('#email').type('testuser@example.com');
        cy.get('#role').select('editor');
        cy.get('#newsletter').check();
        cy.get('#newsletter').should('be.checked');
        cy.get('button[type="submit"]').click();
    })

    it("should verify there are exactly 3 rows in the user table", () => {
        cy.get(".user-table tbody tr").should("have.length", 3);
        cy.get(".user-table tbody tr").eq(0).find("button").click();
        cy.get(".user-table tbody tr").eq(1).find("button").click();
        cy.get(".user-table tbody tr").eq(2).find("button").should ('be.disabled');
    });

 it("should check sidebar and footer stext", () => {
    cy.get(".sidebar ul li a").should("have.length", 3);
    cy.get(".footer").should("contain.text", "© 2025 TestCorp");
 });

 it("should simulate and interact with modal", () => {
    cy.get(".user-table tbody tr").first().find(".btn.small-btn").click();
    cy.get('#edit-modal').should('be.visible');
    cy.get('#edit-modal').contains('Edit User');
    cy.get('.btn.close-modal').should('be.visible').click();
 });
});
