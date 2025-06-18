/**
 * Cypress API Test - POST Create User
 * Uses TypeScript for type safety and clarity.
 */

type NewUser = {
  title: string;
  body: string;
  userId: number;
};

type PostResponse = NewUser & { id: number };

describe("API Test - POST Create User", () => {
  it("Should create a new user", () => {
    const newUser: NewUser = {
      title: "foo",
      body: "bar",
      userId: 1,
    };

    cy.request<PostResponse>({
      method: "POST",
      url: "https://jsonplaceholder.typicode.com/posts",
      body: newUser,
    }).then((response) => {
      expect(response.status, "Expected HTTP status to be 201 Created").to.eq(201);

      const createdPost = response.body;

      expect(createdPost, "Response should contain an ID").to.have.property("id");
      expect(createdPost, "Response body should include sent payload").to.include({
        title: newUser.title,
        body: newUser.body,
        userId: newUser.userId,
      });
    });
  });
});
