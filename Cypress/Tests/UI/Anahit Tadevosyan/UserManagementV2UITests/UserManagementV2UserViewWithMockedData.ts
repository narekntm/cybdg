import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";

describe("Editing mocked user data", () => {
  const baseUrl = "http://localhost:3000/index.html";
  const fakeUser = {
    id: 2,
    name: "Anahit",
    role: "Editor",
    age: 30,
    email: "anahit.ru@gmail.com",
    gender: "Female",
    subscriptions: "Newsletter",
    status: "Active"
  };
  it("should load user details from mocked data and verify UI", () => {

    cy.intercept("GET", "/api/users", [fakeUser]).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers");

    cy.intercept("GET", UserManagementEndpoints.users(2), fakeUser).as("getUserById");
    UserManagementPage.viewButton(2).click();
    cy.wait("@getUserById");


    UserManagementPage.editUserButton().click();

    UserManagementPage.fullNameInput().should("have.value", fakeUser.name);
    UserManagementPage.roleInput().should("have.value", fakeUser.role);
    UserManagementPage.ageInput().should("have.value", fakeUser.age.toString());
    UserManagementPage.emailInput().should("have.value", fakeUser.email);
    UserManagementPage.genderDropdown(fakeUser.gender).should("have.value", fakeUser.gender);
    UserManagementPage.subscriptionOption("Newsletter").should("exist");
    UserManagementPage.statusDropDown(fakeUser.status).should("have.value", fakeUser.status);
  });

  it("should edit the mocked user and verify the updated data", () => {

    const fakeSecondUser = {
      id: 2,
      name: "Mary",
      role: "Viewer",
      age: 40,
      email: "mary@example.com",
      gender: "Female",
      subscriptions: "Product Updates",
      status: "Inactive"
    };


    cy.intercept("GET", "/api/users", [fakeUser]).as("getUsers");
    cy.visit(baseUrl);
    cy.wait("@getUsers");

    cy.intercept("GET", UserManagementEndpoints.users(2), fakeUser).as("getUserById");
    UserManagementPage.viewButton(2).click();
    cy.wait("@getUserById");
    UserManagementPage.editUserButton().click();

    UserManagementPage.fullNameInput().clear().type(fakeSecondUser.name);
    UserManagementPage.roleInput().select(fakeSecondUser.role);
    UserManagementPage.ageInput().clear().type(fakeSecondUser.age.toString());
    UserManagementPage.emailInput().clear().type(fakeSecondUser.email);
    UserManagementPage.genderDropdown(fakeSecondUser.gender).select(fakeSecondUser.gender);

    UserManagementPage.subscribeComponentFromPage().uncheck();
    UserManagementPage.subscribeCheckboxFromPage("Product Updates").check();

    UserManagementPage.statusDropDown(fakeSecondUser.status).select(fakeSecondUser.status);

    cy.intercept("PUT", UserManagementEndpoints.users(2), fakeSecondUser).as("updateUser");
    UserManagementPage.saveFromUser().click();
    UserManagementPage.toastSuccess().should("exist");

    cy.wait("@updateUser").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.deep.eq(fakeSecondUser);
    });
    UserManagementPage.backButton().click();
    UserManagementPage.tableData(0, 0).should("have.text", fakeSecondUser.name);
    UserManagementPage.tableData(0, 1).should("have.text", fakeSecondUser.role);
    UserManagementPage.tableData(0, 2).should("have.text", fakeSecondUser.age.toString());
    UserManagementPage.tableData(0, 3).should("have.text", fakeSecondUser.email);
    UserManagementPage.tableData(0, 4).should("have.text", fakeSecondUser.gender);
    UserManagementPage.tableData(0, 5).should("have.text", fakeSecondUser.subscriptions);
    UserManagementPage.tableData(0, 6).should("have.text", fakeSecondUser.status);
  });
});
