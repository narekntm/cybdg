import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementEndpoints } from "EndPoints/UserManagementEndpoints";
import { UserManagementGenerators } from "Generators/Ani/UserManagementGenerators";
import { AdminLoginStatus, UserFormInput } from "Models/UserManagementModels";
import { UserManagementPageV3 } from "Pages/UserManagementPageV3";
import { adminEmail, adminPassword, wrongEmail, wrongPassword } from "TestDataAni/testData";

describe("User Management – Cypress Sandbox", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept({ method: "POST", url: UserManagementEndpoints.adminLogin }).as("adminLogin");
  });
  function adminLogin(email: string, password: string) {
    UserManagementPageV3.loginBtn().click();
    UserManagementPageV3.adminEmailInput().type(email);
    UserManagementPageV3.adminPasswordInput().type(password);
    UserManagementPageV3.loginSubmitBtn().click();
  }
  function adminLogout() {
    UserManagementPageV3.logoutBtn().click();
  }
  function userCreation(user: UserFormInput) {
    UserManagementPageV3.addNewUserBtn().click();
    UserManagementPageV3.fullNameInput().type(user.name);
    UserManagementPageV3.roleSelect().select(user.role);
    UserManagementPageV3.ageInput().type(user.age.toString());
    UserManagementPageV3.emailInput().type(user.email);
    UserManagementPageV3.userGenderBtn(user.gender).click();
    UserManagementPageV3.saveBtn().click();
  }
  it("1. Admin login with valid email and password", () => {
    adminLogin(adminEmail, adminPassword);
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
      UserManagementPageV3.adminStatusText().should("contain.text", AdminLoginStatus.successTitle);
      adminLogout();
    });
  });
  it("2. Admin login with valid email and invalid password", () => {
    adminLogin(adminEmail, wrongPassword);
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal([AdminLoginStatus.errorText]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("3. Admin login with invalid email and valid password", () => {
    adminLogin(wrongEmail, adminPassword);
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal([AdminLoginStatus.errorText]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("4. Admin login with empty credentials", () => {
    adminLogin(" ", " ");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal([AdminLoginStatus.errorText]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("5. Admin login with empty email and valid password", () => {
    adminLogin(" ", adminPassword);
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal([AdminLoginStatus.errorText]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("6. Admin login with valid email and empty password", () => {
    adminLogin(adminEmail, " ");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal([AdminLoginStatus.errorText]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("7. Create a Viewer and make sure the user is successfully displayed on the table ", () => {
    userCreation(UserManagementGenerators.viewerUser);
    UserManagementPageV3.userTableList().should("have.length", 4);
  });
  it("8. Create an Admin and make sure the user is successfully displayed on the table ", () => {
    userCreation(UserManagementGenerators.adminUser);
    UserManagementPageV3.userTableList().should("have.length", 4);
  });
  afterEach(() => {
    UserManagementBuilders.ResetData();
  });
});
