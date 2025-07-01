import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";

describe("User Management Test Cases", () => {
  const baseUrl = "http://localhost:3000/index.html";
  beforeEach("visit the site", () => {
    cy.intercept({ method: "GET", url: UserManagementEndpoints.users() }).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers").then((interception) => {
      expect(interception.response.statusCode).to.eq(304);
    });
  });

  afterEach("Reset the filled in data", () => {
    cy.intercept({ method: "POST", url: UserManagementEndpoints.reset() }).as("postReset");
    UserManagementPage.resetButton().click();
    UserManagementPage.confirmResetButton().click();
    cy.wait("@postReset").then((interception) => {
      expect(interception.response.body).to.deep.eq({
        success: true,
        users: [
          {
            id: 1,
            name: "Alice",
            role: "Admin",
            age: 30,
            email: "alice@site.com",
            gender: "Female",
            subscriptions: "Newsletter",
            status: "Active",
          },
          {
            id: 2,
            name: "Bob",
            role: "Viewer",
            age: 25,
            email: "bob@site.com",
            gender: "Male",
            subscriptions: "Product Updates",
            status: "Inactive",
          },
          {
            id: 3,
            name: "Eve",
            role: "Editor",
            age: 28,
            email: "eve@site.com",
            gender: "Other",
            subscriptions: "Newsletter, Product Updates",
            status: "Active",
          },
        ],
      });
      expect(interception.response.statusCode).to.eq(200);
    });
  });
  const addUserFromPage = function (
    fullName: string = "",
    role: string = "",
    age: string = "",
    email: string = "",
    gender?: "Male" | "Female" | "Other",
    subscriptions: string[] = [],
    status: string = "Inactive"
  ) {
    if (fullName) UserManagementPage.fullNameInput().clear().type(fullName);
    if (role) UserManagementPage.roleInput().select(role);
    if (age) UserManagementPage.ageInput().clear().type(age);
    if (email) UserManagementPage.emailInput().clear().type(email);

    if (gender) {
      UserManagementPage.genderDropdown(gender).select(gender);
    }
    UserManagementPage.subscribeComponentFromPage().uncheck();

    subscriptions.forEach((subs) => {
      UserManagementPage.subscribeCheckboxFromPage(subs).check();
    });
    if (status) {
      UserManagementPage.statusDropDown(status).select(status);
    }
    UserManagementPage.saveFromUser().click();
  };

  describe("View screen test cases", () => {
    it("Clicking on the view button", () => {
      cy.intercept({ method: "GET", url: UserManagementEndpoints.users(2) }).as("getUserById");
      UserManagementPage.viewButton(2).click();
      cy.wait("@getUserById").then((interception) => {
        cy.wrap(interception.response.body).as("userDetails");
      });
      cy.get("@userDetails").then((user) => {
        console.log("User loaded from the request:", user);
        UserManagementPage.fullNameInput().should("not.exist");
        UserManagementPage.roleInput().should("not.exist");
        UserManagementPage.ageInput().should("not.exist");
        UserManagementPage.emailInput().should("not.exist");
        UserManagementPage.genderDropdown("Male").should("not.exist");
        UserManagementPage.subscriptionOption("Newsletter").should("not.exist");
        UserManagementPage.statusDropDown("Active").should("not.exist");

        UserManagementPage.editUserButton().click();

        UserManagementPage.fullNameInput().should("exist").and("have.value", user.name);
        UserManagementPage.roleInput().should("exist").and("have.value", user.role);
        UserManagementPage.ageInput().should("exist").and("have.value", user.age);
        UserManagementPage.emailInput().should("exist").and("have.value", user.email);
        UserManagementPage.genderDropdown("Male").should("exist").and("have.value", user.gender);
        UserManagementPage.subscriptionOption("Newsletter").should("exist");
        UserManagementPage.statusDropDown("Active").should("exist").and("have.value", user.status);

        cy.intercept({ method: "PUT", url: UserManagementEndpoints.users(2) }).as("updateUserById");
        addUserFromPage("Mary", "Editor", "45", "mary@gmail.com", "Female", ["Newsletter"], "Active");
        UserManagementPage.toastSuccess().should("exist");
        cy.wait("@updateUserById").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.include({
            name: "Mary",
            role: "Editor",
            age: 45,
            email: "mary@gmail.com",
            gender: "Female",
            subscriptions: "Newsletter",
            status: "Active",
          });
        });

        UserManagementPage.backButton().click();
        UserManagementPage.tableData(1, 0).should("have.text", "Mary");
        UserManagementPage.tableData(1, 1).should("have.text", "Editor");
        UserManagementPage.tableData(1, 2).should("have.text", "45");
        UserManagementPage.tableData(1, 3).should("have.text", "mary@gmail.com");
        UserManagementPage.tableData(1, 4).should("have.text", "Female");
        UserManagementPage.tableData(1, 5).should("have.text", "Newsletter");
        UserManagementPage.tableData(1, 6).should("have.text", "Active");
      });
    });
  });
});
