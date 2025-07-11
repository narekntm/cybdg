import { UserManagementBuilders } from "Builders/Lecture/UserManagementBuilders";
import { UserManagementGenerators } from "Generators/Anna/UserManagementGenerators";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";

/**
 * API Test Suite for User Management endpoints.
 * Validates core CRUD operations and login/auth logic via direct API calls.
 */
describe("User Management API – Cypress Sandbox", () => {
  const adminEmail = "admin@example.com";
  const adminPass = "admin123";
  let createdUserId: number;

  before(() => {
    console.log(UserManagementGenerators.userDataPositive());
    console.log(UserManagementGenerators.userDataPositive());
    console.log(UserManagementGenerators.userDataPositive());
    console.log(UserManagementGenerators.userDataPositive());
    console.log(UserManagementGenerators.userDataPositive());
    console.log(UserManagementGenerators.userDataPositive());
  });

  before(() => {
    // 🌐 Reset the entire data set before running tests
    UserManagementBuilders.resetData().its("status").should("eq", 200);
  });

  /**
   * @test Verifies that calling reset API clears and resets server state
   */
  it("POST /api/reset should reset all data", () => {
    UserManagementBuilders.resetData().then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  /**
   * @test Successful login attempt with valid admin credentials
   */
  it("POST /api/login succeeds with valid credentials", () => {
    UserManagementBuilders.adminLogin(adminEmail, adminPass).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("success", true);
    });
  });

  /**
   * @test Login attempt with wrong credentials should fail
   */
  it("POST /api/login fails with invalid credentials", () => {
    UserManagementBuilders.adminLogin("wrong@admin.com", "badpass").then((resp) => {
      expect(resp.status).to.eq(401);
      expect(resp.body).to.have.property("success", false);
    });
  });

  /**
   * @test Fetches list of users and confirms at least one default user (Alice) exists
   */
  it("GET /api/users returns initial user list", () => {
    UserManagementBuilders.getUsers().then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.be.an("array");

      const alice = resp.body.find((u: UserManagementModels.User) => u.id === 1);
      expect(alice, "Alice user should exist").to.exist;
      expect(alice).to.have.property("name", "Alice");
    });
  });

  /**
   * @test Creates a new user via API
   */
  it("POST /api/users creates a new user", () => {
    const user = UserManagementGenerators.userDataPositive();
    UserManagementBuilders.createUser(user).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.name).eq(user.name);
      expect(resp.body.email).eq(user.email);
      expect(resp.body.role).eq(user.role);
      expect(resp.body.age).eq(user.age);
      expect(resp.body.subscriptions).to.be.an("array");
      createdUserId = resp.body.id;
    });
  });

  /**
   * @test Updates name and age of an existing user
   */
  it("PUT /api/users/:id updates an existing user", () => {
    const updatedData = { name: "ApiUserEdited", age: 25 };

    UserManagementBuilders.updateUser(createdUserId, updatedData).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.include({ id: createdUserId, name: updatedData.name, age: updatedData.age });
    });
  });

  /**
   * @test Toggles user status to Active then back to Inactive
   */
  it("PATCH /api/users/:id/status toggles user status", () => {
    UserManagementBuilders.toggleStatus(createdUserId, UserManagementModels.Status.Active).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("status", UserManagementModels.Status.Active);
    });

    UserManagementBuilders.toggleStatus(createdUserId, UserManagementModels.Status.Inactive).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("status", UserManagementModels.Status.Inactive);
    });
  });

  /**
   * @test Deletes a user by ID and confirms their removal from user list
   */
  it("DELETE /api/users/:id removes the user", () => {
    UserManagementBuilders.deleteUser(createdUserId).then((resp) => {
      expect(resp.status).to.eq(200);
    });

    UserManagementBuilders.getUsers().then((resp) => {
      const deleted = resp.body.find((u: UserManagementModels.User) => u.id === createdUserId);
      expect(deleted, "User should no longer exist").to.be.undefined;
    });
  });
});
