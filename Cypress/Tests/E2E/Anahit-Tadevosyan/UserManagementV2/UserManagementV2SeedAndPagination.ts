import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import { UserData, Role, Gender, Subscription } from "Models/Anahit Tadevosyan/UserManagementV2Model";
import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";

const Chance = require('chance');

describe("User Management Test Cases", () => {
  const baseUrl = "http://localhost:3000/index.html";
  const chance = new Chance();
  const users: UserData[] = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      name: chance.name().split(" ")[0],
      role: chance.pickone(Object.values(Role)),
      age: chance.integer({ min: 1, max: 100 }),
      email: chance.email(),
      gender: chance.pickone(Object.values(Gender)),
      subscriptions: chance.pickset(Object.values(Subscription))
    });
  }

  beforeEach("visit the site", () => {
    cy.intercept({ method: "GET", url: "/api/users" }).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers").then((interception) => {
      expect(interception.response.statusCode).to.eq(304);
    });

    UserManagementBuilders.seedData(users);


  });

  it("Seed data and check pagination", () => {

  });
});
