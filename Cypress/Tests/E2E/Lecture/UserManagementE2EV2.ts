import { UserManagementBuilders } from "Builders/Lecture/UserManagementBuilders";
import Chance from "chance";
import { UserManagementEndpoints } from "EndPoints/Lecture/UserManagementEndpoints";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
import { UserManagementPageV2 } from "Pages/Lecture/UserManagementPageV2";

const chance = new Chance();
describe("User Management – Cypress Sandbox", () => {
  const baseUrl = "/";
  let users: UserManagementModels.UserInput[] = [];


  before(() => {
    UserManagementBuilders.resetData();
    UserManagementBuilders.seedData();
  });

  beforeEach(() => {
    UserManagementBuilders.getUsers().then((res) => {
      users = res.body;
    });
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
