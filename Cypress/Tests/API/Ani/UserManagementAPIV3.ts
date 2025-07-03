import { UserManagementBuilders } from "Builders/UserManagementBuilders";
import { UserManagementGenerators } from "Generators/Ani/UserManagementGenerators";
import { adminEmail, adminPassword, emptyString, wrongEmail, wrongFormatEmail, wrongPassword } from "TestDataAni/testData";

describe("User Management", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  describe("Login as Admin", () => {
    it("1. Admin login with valid email and invalid password", () => {
      UserManagementBuilders.AdminLogin(adminEmail, wrongPassword).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("2. Admin login with valid email and password", () => {
      UserManagementBuilders.AdminLogin(adminEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
    });
    it("3. Admin login with invalid email and valid password", () => {
      UserManagementBuilders.AdminLogin(wrongEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("4. Admin login with invalid format email and valid password", () => {
      UserManagementBuilders.AdminLogin(wrongFormatEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("5. Admin login with empty credentials", () => {
      UserManagementBuilders.AdminLogin(emptyString, emptyString).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("6. Admin login with empty email and valid password", () => {
      UserManagementBuilders.AdminLogin(emptyString, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
    it("7. Admin login with valid email and empty password", () => {
      UserManagementBuilders.AdminLogin(adminEmail, emptyString).then((xhr) => {
        expect(xhr.status).to.eq(401);
      });
    });
  });
  describe("Add New User", () => {
    it("1. User creation with valid credentials(viewer mode)", () => {
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserCreate(UserManagementGenerators.adminUser).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(4);
      });
    });
    it("2. User creation with valid credentials(logged in)", () => {
      UserManagementBuilders.AdminLogin(adminEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserCreate(UserManagementGenerators.adminUser).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(4);
      });
    });
  });
  describe("User Table", () => {
    it("1. Trying to delete a user while being logged in", () => {
      UserManagementBuilders.AdminLogin(adminEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserDeleteAsAdmin(1).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(2);
      });
    });
    it("2. Trying to delete a user while being logged out", () => {
      UserManagementBuilders.AdminLogin(adminEmail, adminPassword).then((xhr) => {
        expect(xhr.status).to.eq(200);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(3);
      });
      UserManagementBuilders.UserDeleteAsViewer(1).then((xhr) => {
        expect(xhr.status).to.eq(403);
      });
      UserManagementBuilders.GetUsers().then((xhr) => {
        expect(xhr.body.length).to.eq(3);
      });
    });
  });
  afterEach(() => {
    UserManagementBuilders.ResetData().then((xhr) => {
      expect(xhr.status).to.eq(200);
    });
  });
});
