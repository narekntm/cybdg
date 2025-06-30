import { UserManagementBuilders } from "Builders/Lecture/UserManagementBuilders";
import Chance from "chance";
import { UserManagementEndpoints } from "EndPoints/Lecture/UserManagementEndpoints";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
import { UserManagementPageV2 } from "Pages/Lecture/UserManagementPageV2";

const chance = new Chance();
describe("User Management – Cypress Sandbox", () => {
  const baseUrl = "/";
  const users: UserManagementModels.UserInput[] = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      name: chance.name().split(" ")[0],
      role: chance.pickone(Object.values(UserManagementModels.Role)),
      age: chance.integer({ min: 1, max: 100 }),
      email: chance.email(),
      gender: chance.pickone(Object.values(UserManagementModels.Gender)),
      subscriptions: chance.pickset(
        Object.values(UserManagementModels.Subscription),
        chance.integer({
          min: 0,
          max: 3,
        })
      ),
    });
  }

  before(() => {
    UserManagementBuilders.resetData();
    UserManagementBuilders.seedData(users);
  });

  beforeEach(() => {
    cy.intercept("GET", UserManagementEndpoints.users()).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers");
  });

  it("Seed data and verify pagination", () => {
    UserManagementPageV2.paginationInfo()
      .should("be.visible")
      .and("contain.text", `Page 1 of ${Math.ceil((3 + users.length) / 5)}: (${3 + users.length} Users)`);
    UserManagementPageV2.prevPage().should("be.disabled");
    UserManagementPageV2.nextPage().should("be.enabled");
    const emails = [...users.map((u) => u.email), "alice@site.com", "bob@site.com", "eve@site.com"];

    const pageCount = Math.ceil((3 + users.length) / 5);
    for (let i = 0; i < pageCount; i++) {
      cy.get("tbody tr").each((tr) => {
        cy.wrap(tr)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((email) => {
            expect(emails.includes(email)).to.be.true;
          });
      });
      UserManagementPageV2.nextPage().click();
    }
  });
});
