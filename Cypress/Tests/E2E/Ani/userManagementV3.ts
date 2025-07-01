import { UserManagementPageV3 } from "Pages/UserManagementPageV3";
import { Gender, Role, SubscribeTo, UserFormInput } from "Models/UserManagementModels";
function getUserFormInput(
  name: string,
  role: Role,
  age: number,
  email: string,
  gender: Gender,
  subscription?: SubscribeTo[]
): UserFormInput {
  return { name: name, role: role, age: age, email: email, gender: gender, subscription: subscription };
}
const adminUser: UserFormInput = getUserFormInput("Admin", Role.admin, 5, "admin@test.test", Gender.other);
const viewerUser: UserFormInput = getUserFormInput("Viewer", Role.viewer, 50, "viewer@test.com", Gender.male);
describe("User Management – Cypress Sandbox", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/index.html");
    cy.intercept({ method: "POST", url: "/api/login" }).as("adminLogin");
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
    adminLogin("admin@example.com", "admin123");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.response.body).to.have.property("success", true);
      UserManagementPageV3.adminStatusText().should("contain.text", "Logged in as Admin");
      adminLogout();
    });
  });
  it("2. Admin login with valid email and invalid password", () => {
    adminLogin("admin@example.com", "wrongPassword");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal(["Invalid credentials."]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("3. Admin login with invalid email and valid password", () => {
    adminLogin("wrongEmail", "admin123");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal(["Invalid credentials."]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("4. Admin login with empty credentials", () => {
    adminLogin(" ", " ");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal(["Invalid credentials."]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("5. Admin login with empty email and valid password", () => {
    adminLogin(" ", "admin123");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal(["Invalid credentials."]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("6. Admin login with valid email and empty password", () => {
    adminLogin("admin@example.com", " ");
    cy.wait("@adminLogin").then((xhr) => {
      expect(xhr.response.statusCode).to.eq(401);
      expect(xhr.response.body.errors).to.deep.equal(["Invalid credentials."]);
    });
    UserManagementPageV3.loginBtn().should("be.visible");
  });
  it("7. Create a Viewer and make sure the user is successfully displayed on the table ", () => {
    userCreation(viewerUser);
    UserManagementPageV3.userTableList().should("have.length", 4)
  });
  it("8. Create an Admin and make sure the user is successfully displayed on the table ", () => {
    userCreation(adminUser);
    UserManagementPageV3.userTableList().should("have.length", 4)
  });
  afterEach(() => {
    cy.request({
      method: "POST",
      url: "/api/reset",
    });
  });
})