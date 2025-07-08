import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import { UserData, Role, Gender, Subscription } from "Models/Anahit Tadevosyan/UserManagementV2Model";
import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import {UserManagementGenerator} from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";

const Chance = require("chance");

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
      subscriptions: chance.pickset(Object.values(Subscription), chance.integer({ min: 0, max: 2 })),
    });
  }

  beforeEach("visit the site and seed data", () => {
    cy.intercept({ method: "GET", url: UserManagementEndpoints.users() }).as("getUsers");
    UserManagementBuilders.seedData(users);
    cy.visit(baseUrl);
    cy.wait("@getUsers")
  });

  it("Seed data and check pagination", () => {
    const totalUsers = users.length + 3;
    const pageCount = Math.ceil(totalUsers / 5);
    UserManagementPage.pageInfo().should("be.visible").and("contain.text", `1 of ${pageCount}: (${totalUsers} Users`);
    const emails = [UserManagementGenerator.staticUserOne.email, UserManagementGenerator.staticUserTwo.email, UserManagementGenerator.staticUserThree.email, ...users.map((user) => user.email)];
    console.log(emails);
    UserManagementPage.nextPageButton().should("be.enabled");
    UserManagementPage.prevPageButton().should("be.disabled");

    function validatePageAndNext(pageIndex: number, totalPages: number, emails: string[]) {
      if (pageIndex >= totalPages) return;

      UserManagementPage.tableTr().each((tr) => {
        cy.wrap(tr)
          .find("td")
          .eq(3)
          .invoke("text")
          .then((email) => {
            expect(emails.includes(email)).to.be.true;
          });
      });
    }
    validatePageAndNext(0, pageCount, emails);

  });
});
