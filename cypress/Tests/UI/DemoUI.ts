describe("Intercept Example on Real Website", () => {
  beforeEach(() => {
    // Load the fixture data
    cy.fixture("example").as("commentData");
  });

  it("Should intercept and mock the GET /comments/* request using a fixture", function () {
    // Intercept the request triggered by the "Get Comment" button
    // Notice how we're using this.commentData which was loaded in beforeEach
    cy.intercept("GET", "**/comments/*", {
      statusCode: 200,
      body: {
        postId: 1,
        id: 1,
        name: this.commentData.name, // Using fixture data
        body: this.commentData.body,  // Using fixture data
      },
    }).as("getComment");

    // Visit the example Cypress page with a real network request demo
    cy.visit("https://example.cypress.io/commands/network-requests");

    // Click the "Get Comment" button to trigger the GET request
    cy.contains("Get Comment").click();

    // Wait for the intercepted call
    cy.wait("@getComment");

    // Assert mocked data (from fixture) is shown in the UI
    cy.get(".network-comment").should("contain", this.commentData.body);
  });
});
