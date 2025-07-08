import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import {UserManagementGenerator} from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";

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
        const user = interception.response.body
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
        const userForm = UserManagementGenerator.userFormPositiveCase
        addUserFromPage(userForm.name, userForm.role, userForm.age, userForm.email, userForm.gender, userForm.subscriptions, userForm.status);
        UserManagementPage.toastSuccess().should("exist");
        cy.wait("@updateUserById").then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.include({
           ...userForm,
            age: Number(userForm.age),
            subscriptions: userForm.subscriptions.join(',')
          });
        });

        UserManagementPage.backButton().click();
        UserManagementPage.tableData(1, 0).should("have.text", userForm.name);
        UserManagementPage.tableData(1, 1).should("have.text", userForm.role);
        UserManagementPage.tableData(1, 2).should("have.text", userForm.age);
        UserManagementPage.tableData(1, 3).should("have.text", userForm.email);
        UserManagementPage.tableData(1, 4).should("have.text", userForm.gender);
        UserManagementPage.tableData(1, 5).should("have.text", userForm.subscriptions.join(','));
        UserManagementPage.tableData(1, 6).should("have.text", userForm.status);
      });
    });
  });
});
