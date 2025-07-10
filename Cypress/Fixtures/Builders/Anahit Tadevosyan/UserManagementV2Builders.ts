import { UserManagementEndpoints } from "EndPoints/Anahit Tadevosyan/UserManagementV2EndPoints";
import { UserData } from "Models/Anahit Tadevosyan/UserManagementV2Model";

export class UserManagementBuilders {
  static adminLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin(),
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  };

  static resetData() {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.reset(),
    });
  }
  static getUsers() {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.users(),
      failOnStatusCode: false,
    });
  }
  static addUser(user: UserData) {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.users(),
      body: user,
      failOnStatusCode: false,
    });
  }
  static editUser(id: number, editedUser: Partial<UserData>) {
    return cy.request({
      method: "PUT",
      url: UserManagementEndpoints.users(id),
      body: editedUser,
      failOnStatusCode: false,
    });
  }

  static deleteUser(id: number, isAdmin: boolean) {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.users(id),
      body: {
        isAdmin,
      },
      failOnStatusCode: false,
    });
  }
  static changeUserStatus(id: number, status: "Active" | "Inactive") {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndpoints.status(id),
      body: { status },
      failOnStatusCode: false,
    });
  }

  static getUserById(id: number, user?: UserData) {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.users(id),
      body: { user },
      failOnStatusCode: false,
    });
  }

  static seedData(users: UserData[]) {
    return cy.request({
      method: "POST",
      url: "/api/seed",
      body: { users, overwrite: false },
      failOnStatusCode: false,
    });
  }
}
