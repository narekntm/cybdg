import { UserManagementBuilders } from "Builders/anahit-tadevosyan/UserManagementBuilders";

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
        expect(response.body).to.not.include("Eve");
      });
    });
    it("Delete user as non-admin", () => {
      it("Delete user as admin", () => {
        UserManagementBuilders.adminLogin("admin@example.com", "admin").then((response) => {
          expect(response.status).to.eq(401);
        });
        UserManagementBuilders.deleteUser(2, true).then((response) => {
          expect(response.status).to.eq(200);
        });

        UserManagementBuilders.getUsers().then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.include("Eve");
        });
      });
      UserManagementBuilders.deleteUser(2, true).then((response) => {
        expect(response.status).to.eq(200);
      });

      UserManagementBuilders.getUsers().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.include("Eve");
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
        expect(response.body).to.not.include("Alice");
      });
    });
  });
  it("Change the toggle to Inactive", () => {
    UserManagementBuilders.changeUserStatus(3, "Inactive").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        id: 3,
        name: "Eve",
        role: "Editor",
        age: 28,
        email: "eve@site.com",
        gender: "Other",
        subscriptions: "Newsletter, Product Updates",
        status: "Inactive",
      });
    });

    it("Change the toggle to Active", () => {
      UserManagementBuilders.changeUserStatus(2, "Active").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include({
          id: 2,
          name: "Bob",
          role: "Viewer",
          age: 25,
          email: "bob@site.com",
          gender: "Male",
          subscriptions: "Product Updates",
          status: "Active",
        });
      });
    });
  });
});
