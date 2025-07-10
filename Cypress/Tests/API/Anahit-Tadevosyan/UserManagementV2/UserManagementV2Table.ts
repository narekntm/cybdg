import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import { UserManagementGenerator } from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";
  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.resetData();
  });
  describe("User Table Manipulations", () => {
    it("Delete user as admin", () => {
      UserManagementBuilders.adminLogin("admin@example.com", "admin123").then((response) => {
        expect(response.status).to.eq(200);
      });
      UserManagementBuilders.deleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.getUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(UserManagementGenerator.staticUserThree.name);
      });
    });
    it("Delete user as non-admin", () => {
      UserManagementBuilders.deleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.getUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(UserManagementGenerator.staticUserThree.name);
      });
    });
    it("Delete user as admin", () => {
      UserManagementBuilders.adminLogin("admin@example.com", "admin").then((response) => {
        expect(response.status).to.eq(401);
      });
      UserManagementBuilders.deleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.getUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(UserManagementGenerator.staticUserThree.name);
      });
    });
    it("Delete admin as non admin", () => {
      UserManagementBuilders.deleteUser(1, false).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
    it("Delete admin as admin", () => {
      UserManagementBuilders.adminLogin("admin@example.com", "admin123").then((response) => {
        expect(response.status).to.eq(200);
      });
      return UserManagementBuilders.deleteUser(1, true).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq({ success: true });
        UserManagementBuilders.getUserById(1).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });
  it("Change the toggle to Inactive", () => {
    UserManagementBuilders.changeUserStatus(3, "Inactive").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        ...UserManagementGenerator.staticUserThree,
        age: UserManagementGenerator.staticUserThree.age,
        subscriptions: UserManagementGenerator.staticUserThree.subscriptions.join(", "),
        status: UserManagementModels.Status.Inactive,
      });
    });
  });
  it("Change the toggle to Active", () => {
    UserManagementBuilders.changeUserStatus(2, "Active").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        ...UserManagementGenerator.staticUserTwo,
        age: UserManagementGenerator.staticUserTwo.age,
        subscriptions: UserManagementGenerator.staticUserTwo.subscriptions.join(","),
        status: UserManagementModels.Status.Active,
      });
    });
  });
});
