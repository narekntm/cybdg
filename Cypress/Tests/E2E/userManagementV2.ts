import { Gender, Role, SubscribeTo, UserFormInput } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementPage } from "Cypress/Fixtures/Pages/UserManagementPage";

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
describe("User Management", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:3000/");
    cy.intercept({ method: "POST", url: "/api/login" }).as("adminLogin");
    cy.intercept({ method: "POST", url: "/api/users" }).as("userCreate");
    cy.intercept({ method: "PATCH", url: "/api/users/1/status" }).as("userStatusUpdate");
    cy.intercept({ method: "PATCH", url: "/api/users/2/status" }).as("userStatusUpdate");
    cy.intercept({ method: "PUT", url: "/api/users/1" }).as("userUpdate");
  });
  function adminLogin(email: string, password: string) {
    UserManagementPage.adminEmailInput().type(email);
    UserManagementPage.adminPasswordInput().type(password).should("have.value", password);
    return UserManagementPage.adminLoginBtn().click();
  }
  function adminLogout() {
    adminLogin("admin@example.com", "admin123");
    cy.on("window:confirm", () => true);
    return UserManagementPage.adminLogoutBtn().click();
  }
  function userCreation() {
    UserManagementPage.userFullNameInput().type("Ani");
    UserManagementPage.userRoleDropdown().select("Admin");
    UserManagementPage.userAgeInput().type("15");
    UserManagementPage.userEmailInput().type("test@test.com");
    UserManagementPage.userGenderFemaleBtn().click();
    return UserManagementPage.userSaveBtn().click();
  }
  function userCreationDynamic(user: UserFormInput) {
    UserManagementPage.userFullNameInput().type(user.name);
    UserManagementPage.userRoleDropdown().select(user.role);
    UserManagementPage.userAgeInput().type(user.age.toString());
    UserManagementPage.userEmailInput().type(user.email);
    UserManagementPage.userGenderBtn(user.gender).click();
    return UserManagementPage.userSaveBtn().click();
  }
  describe("Login As Admin", () => {
    it("1. Admin login with valid email and password", () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
    });
    it("2. Admin login with valid email and invalid password", () => {
      adminLogin("admin@example.com", "wrongPassword");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      });
      UserManagementPage.adminLoginStatusMsg().should("have.text", "Invalid credentials").should("be.visible");
    });
    it("3. Admin login with invalid email and valid password", () => {
      adminLogin("wrongEmail", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      });
      UserManagementPage.adminLoginStatusMsg().should("have.text", "Invalid credentials").should("be.visible");
    });
    it("4. Admin login with empty credentials", () => {
      adminLogin(" ", " ");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      });
      UserManagementPage.adminLoginStatusMsg().should("have.text", "Invalid credentials").should("be.visible");
    });
    it("5. Admin login with empty email and valid password", () => {
      adminLogin(" ", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      });
      UserManagementPage.adminLoginStatusMsg().should("have.text", "Invalid credentials").should("be.visible");
    });
    it("6. Admin login with valid email and empty password", () => {
      adminLogin("admin@example.com", " ");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(401);
        expect(xhr.response.body).to.have.property("success", false);
      });
      UserManagementPage.adminLoginStatusMsg().should("have.text", "Invalid credentials").should("be.visible");
    });
    it("7. Logging out from the admin account", () => {
      adminLogout();
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
    });
    it("8. Check the UI of the Login As Admin section", () => {
      UserManagementPage.loginAsAdminTitle().should("be.visible").should("have.text", "Login as Admin");
      UserManagementPage.adminEmailLabel().should("be.visible").should("have.text", "Email");
      UserManagementPage.adminPasswordLabel().should("be.visible").should("have.text", "Password");
      UserManagementPage.adminLoginBtn().should("be.visible").should("have.text", "Login");
    });
  });
  describe("Add New User", () => {
    it("1. New user creation in a viewer mode", () => {
      userCreation();
      cy.wait("@userCreate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("name", "Ani");
      });
      UserManagementPage.userTableLastUserName().should("have.text", "Ani");
    });
    it("2. New user creation (logged in as admin)", () => {
      adminLogin("admin@example.com", "admin123");
      userCreation();
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      cy.wait("@userCreate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("name", "Ani");
      });
      UserManagementPage.userTableLastUserName().should("have.text", "Ani");
    });
    it("3. New user creation not filling all required fields", () => {
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("have.length", 5);
    });
    it("4. Creating a new user with filling only the Full Name", () => {
      UserManagementPage.userFullNameInput().type("Ani");
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("not.contain", "Name must be 1–20 letters only (no spaces or symbols).");
    });
    it("5. Creating a new user with selecting only Role", () => {
      UserManagementPage.userRoleDropdown().select("Admin");
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("not.contain", "Role is required.");
    });
    it("6. Creating a new user with filling only the Age field", () => {
      UserManagementPage.userAgeInput().type("14");
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("not.contain", "Age must be between 1 and 99.");
    });
    it("7. Creating a new user with filling only the Email field", () => {
      UserManagementPage.userEmailInput().type("test@test.com");
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("not.contain", "Valid email is required.");
    });
    it("8. Creating a new user with choosing only Gender", () => {
      UserManagementPage.userGenderFemaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("not.contain", "Gender selection is required.");
    });
    it("9. Creating a new user with wrong Full Name format", () => {
      UserManagementPage.userFullNameInput().type("Ani Harutyunyan 1");
      UserManagementPage.userRoleDropdown().select("Admin");
      UserManagementPage.userAgeInput().type("15");
      UserManagementPage.userEmailInput().type("test@test.com");
      UserManagementPage.userGenderFemaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("contain", "Name must be 1–20 letters only (no spaces or symbols).");
      UserManagementPage.userValidationErrors().should("have.length", 1);
      UserManagementPage.userTableData().should("have.length", 3);
    });
    it("10. Creating a new user with wrong Age format", () => {
      UserManagementPage.userFullNameInput().type("Ani");
      UserManagementPage.userRoleDropdown().select("Admin");
      UserManagementPage.userAgeInput().type("150");
      UserManagementPage.userEmailInput().type("test@test.com");
      UserManagementPage.userGenderFemaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("contain", "Age must be between 1 and 99.");
      UserManagementPage.userValidationErrors().should("have.length", 1);
      UserManagementPage.userTableData().should("have.length", 3);
    });
    it("11. Creating a new user with wrong Email format", () => {
      UserManagementPage.userFullNameInput().type("Ani");
      UserManagementPage.userRoleDropdown().select("Admin");
      UserManagementPage.userAgeInput().type("15");
      UserManagementPage.userEmailInput().type("wrongEmail_format");
      UserManagementPage.userGenderFemaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      UserManagementPage.userValidationErrors().should("contain", "Valid email is required.");
      UserManagementPage.userValidationErrors().should("have.length", 1);
      UserManagementPage.userTableData().should("have.length", 3);
    });
    it("12. Check the UI of the Add New User section", () => {
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userNameLabel().should("be.visible").should("have.text", "Full Name");
      UserManagementPage.userRoleLabel().should("be.visible").should("have.text", "Role");
      UserManagementPage.userAgeLabel().should("be.visible").should("have.text", "Age");
      UserManagementPage.userEmailLabel().should("be.visible").should("have.text", "Email");
      UserManagementPage.userGenderTitle().should("be.visible").should("have.text", "Gender");
      UserManagementPage.userSubscriptionLabel().should("be.visible").should("have.text", "Subscribe to");
      UserManagementPage.userSaveBtn().should("be.visible").should("have.text", "Save");
    });
  });
  describe("Add New User(dynamic)", () => {
    it("1. New user creation in a viewer mode", () => {
      userCreationDynamic(viewerUser);
      UserManagementPage.userTableLastUserName().should("have.text", viewerUser.name);
    });
    it("2. New user creation (logged in as admin)", () => {
      adminLogin("admin@example.com", "admin123");
      userCreationDynamic(adminUser);
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.userTableLastUserName().should("have.text", adminUser.name);
    });
  });
  describe("User Table", () => {
    it("1. Trying to delete a user while being logged out", () => {
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
      UserManagementPage.userTableData().should("have.length", 3);
      UserManagementPage.userTableFirstUsersDeleteBtn().click();
      UserManagementPage.userDeleteValidationError().should("have.text", "Admin login required to delete Admin-level users.");
    });
    it("2. Trying to delete a user being an admin", () => {
      cy.intercept({ method: "DELETE", url: "/api/users/1" }).as("userDelete");
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableData().should("have.length", 3);
      UserManagementPage.userTableFirstUsersDeleteBtn().click();
      UserManagementPage.userDeleteConfirmationModal().should("be.visible");
      UserManagementPage.userDeleteConfirmBtn().should("be.visible").should("have.text", "Yes").click();
      cy.wait("@userDelete").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.userTableData().should("have.length", 2);
    });
    it('3. Make sure that clicking on the "Cancel" button does not delete the user', () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableData().should("have.length", 3);
      UserManagementPage.userTableFirstUsersDeleteBtn().click();
      UserManagementPage.userDeleteConfirmationModal().should("be.visible");
      UserManagementPage.userDeleteCancelBtn().should("be.visible").click();
      UserManagementPage.userTableData().should("have.length", 3);
    });
    it("4. Deactivate a user(logged out user)", () => {
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
      UserManagementPage.userTableFirstUserActiveRow().should("have.text", "Active");
      UserManagementPage.userTableFirstUserStatusBtn().should("have.text", "Deactivate").click();
      cy.wait("@userStatusUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("status", "Inactive");
      });
      UserManagementPage.userTableFirstUserStatusBtn().should("have.text", "Activate");
      UserManagementPage.userTableFirstUserActiveRow().should("have.text", "Inactive");
    });
    it("5. Deactivate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableFirstUserActiveRow().should("have.text", "Active");
      UserManagementPage.userTableFirstUserStatusBtn().should("have.text", "Deactivate").click();
      cy.wait("@userStatusUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("status", "Inactive");
      });
      UserManagementPage.userTableFirstUserStatusBtn().should("have.text", "Activate");
      UserManagementPage.userTableFirstUserActiveRow().should("have.text", "Inactive");
    });
    it("6. Activate a user(logged out user)", () => {
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
      UserManagementPage.userTableSecondUserActiveRow().should("have.text", "Inactive");
      UserManagementPage.userTableSecondUserStatusBtn().should("have.text", "Activate").click();
      cy.wait("@userStatusUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("status", "Active");
      });
      UserManagementPage.userTableSecondUserStatusBtn().should("have.text", "Deactivate");
      UserManagementPage.userTableSecondUserActiveRow().should("have.text", "Active");
    });
    it("7. Activate a user(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableSecondUserActiveRow().should("have.text", "Inactive");
      UserManagementPage.userTableSecondUserStatusBtn().should("have.text", "Activate").click();
      cy.wait("@userStatusUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("status", "Active");
      });
      UserManagementPage.userTableSecondUserStatusBtn().should("have.text", "Deactivate");
      UserManagementPage.userTableSecondUserActiveRow().should("have.text", "Active");
    });
    it("8. Make sure the Edit User section becomes active when clicking on the Edit button(logged out user)", () => {
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
      UserManagementPage.userTableFirstUserName().should("have.text", "Alice");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserEditBtn().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullNameInput().should("have.value", "Alice");
    });
    it("9. Make sure the Edit User section becomes active when clicking on the Edit button(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableFirstUserName().should("have.text", "Alice");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserEditBtn().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullNameInput().should("have.value", "Alice");
    });
    it("10. Check that the user update flow works properly(logged out user)", () => {
      UserManagementPage.adminLogoutBtn().should("not.be.visible");
      UserManagementPage.userTableFirstUserName().should("have.text", "Alice");
      UserManagementPage.userTableFirstUserRole().should("have.text", "Admin");
      UserManagementPage.userTableFirstUserAge().should("have.text", "30");
      UserManagementPage.userTableFirstUserEmail().should("have.text", "alice@site.com");
      UserManagementPage.userTableFirstUserGender().should("have.text", "Female");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserEditBtn().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullNameInput().clear().type("Max");
      UserManagementPage.userRoleDropdown().select("Viewer");
      UserManagementPage.userAgeInput().clear().type("26");
      UserManagementPage.userEmailInput().clear().type("example@test.com");
      UserManagementPage.userGenderMaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      cy.wait("@userUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("name", "Max");
      });
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserName().should("have.text", "Max");
      UserManagementPage.userTableFirstUserRole().should("have.text", "Viewer");
      UserManagementPage.userTableFirstUserAge().should("have.text", "26");
      UserManagementPage.userTableFirstUserEmail().should("have.text", "example@test.com");
      UserManagementPage.userTableFirstUserGender().should("have.text", "Male");
    });
    it("11. Check that the user update flow works properly(logged in as Admin)", () => {
      adminLogin("admin@example.com", "admin123");
      cy.wait("@adminLogin").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("success", true);
      });
      UserManagementPage.adminLogoutBtn().should("be.visible");
      UserManagementPage.userTableFirstUserName().should("have.text", "Alice");
      UserManagementPage.userTableFirstUserRole().should("have.text", "Admin");
      UserManagementPage.userTableFirstUserAge().should("have.text", "30");
      UserManagementPage.userTableFirstUserEmail().should("have.text", "alice@site.com");
      UserManagementPage.userTableFirstUserGender().should("have.text", "Female");
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserEditBtn().click();
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Edit User");
      UserManagementPage.userFullNameInput().clear().type("Max");
      UserManagementPage.userRoleDropdown().select("Viewer");
      UserManagementPage.userAgeInput().clear().type("26");
      UserManagementPage.userEmailInput().clear().type("example@test.com");
      UserManagementPage.userGenderMaleBtn().click();
      UserManagementPage.userSaveBtn().click();
      cy.wait("@userUpdate").then((xhr) => {
        expect(xhr.response.statusCode).to.eq(200);
        expect(xhr.response.body).to.have.property("name", "Max");
      });
      UserManagementPage.userFormTitle().should("be.visible").should("have.text", "Add New User");
      UserManagementPage.userTableFirstUserName().should("have.text", "Max");
      UserManagementPage.userTableFirstUserRole().should("have.text", "Viewer");
      UserManagementPage.userTableFirstUserAge().should("have.text", "26");
      UserManagementPage.userTableFirstUserEmail().should("have.text", "example@test.com");
      UserManagementPage.userTableFirstUserGender().should("have.text", "Male");
    });
  });
  afterEach(() => {
    cy.request({
      method: "POST",
      url: "/api/reset",
    });
  });
});
