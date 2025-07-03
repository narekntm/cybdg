import { UserManagementBuilders } from "Builders/Anahit Tadevosyan/UserManagementV2Builders";
import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import { UserManagementPage } from "Pages/Anahit Tadevosyan/UserManagementV2Page";
import {UserManagementGenerator} from "Generators/Anahit_Tadevosyan/UserManagementV2Generators";

describe("User Management API Testing", () => {
  const baseUrl = "http://127.0.0.1:3000/";
  const user1 = UserManagementGenerator.staticUserOne;
  const user2 = UserManagementGenerator.staticUserTwo;
  const user3 = UserManagementGenerator.staticUserThree;
  beforeEach(() => {
    cy.visit(baseUrl);
  });
  afterEach(() => {
    UserManagementBuilders.ResetData();
  });
  describe("User Table Manipulations", () => {
    it("Delete user as admin", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((response) => {
        expect(response.status).to.eq(200);
      });
      UserManagementBuilders.DeleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.GetUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(user3.name);
      });
    });
    it("Delete user as non-admin", () => {

      UserManagementBuilders.DeleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.GetUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(user3.name);
      });
    });
    it("Delete user as admin", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin").then((response) => {
        expect(response.status).to.eq(401);
      });
      UserManagementBuilders.DeleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.GetUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include(user3.name);
      });
    });
    it("Delete admin as non admin", () => {
      UserManagementBuilders.DeleteUser(1, false).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
    it("Delete admin as admin", () => {
      UserManagementBuilders.AdminLogin("admin@example.com", "admin123").then((response) => {
        expect(response.status).to.eq(200);
      });
      return UserManagementBuilders.DeleteUser(1, true).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq({ success: true });
        UserManagementBuilders.GetUserById(1).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });
  it("Change the toggle to Inactive", () => {
    UserManagementBuilders.ChangeUserStatus(3, "Inactive").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        ...user3,
        age: +user3.age,
        subscriptions: user3.subscriptions.join(', '),
        status: "Inactive"
      });
    });
  });
    it("Change the toggle to Active", () => {
      UserManagementBuilders.ChangeUserStatus(2, "Active").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include({
          ...user2,
          age: +user2.age,
          subscriptions: user2.subscriptions.join(','),
          status: "Active"
        });
      });
    });
  });

