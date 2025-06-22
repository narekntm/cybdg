describe("Intercept Example on Real Website", () => {
  it("Should intercept and mock the GET /comments/* request", () => {
    // Intercept the request triggered by the "Get Comment" button
    cy.intercept("GET", "**/comments/*", {
      statusCode: 200,
      body: {
        postId: 1,
        id: 1,
        name: "Mocked Name",
        body: "This is a mocked comment body.",
      },
    }).as("getComment");

    // Visit the example Cypress page with a real network request demo
    cy.visit("https://example.cypress.io/commands/network-requests");

    // Click the "Get Comment" button to trigger the GET request
    cy.contains("Get Comment").click();

    // Wait for the intercepted call
    cy.wait("@getComment");

    // Assert mocked data is shown in the UI
    cy.get(".network-comment").should("contain", "This is a mocked comment body.");
  });
});
