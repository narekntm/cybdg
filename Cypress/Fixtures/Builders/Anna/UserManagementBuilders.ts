import { UserManagementEndpoints } from "EndPoints/Anna/UserManagementEndpoints";
import { UserManagementModels } from "Models/Anna/UserManagementModels";

export class UserManagementBuilders {
  static AdminLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  };

  static ResetData() {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.reset,
    });
  }

  static CreateUser = (user: { name: string; role: string; age: number; email: string; gender: string; subscriptions?: string[] }) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.Users(),
      body: user,
      failOnStatusCode: false,
    });
  };

  static EditUser(id: number) {
    return cy.request({
      method: "PUT",
      url: UserManagementEndpoints.Users(id),
    });
  }

  static DeleteUserAsAdmin(id: number) {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: { isAdmin: true },
    });
  }

  static DeleteUserLogout(id: number) {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: { isAdmin: false },
    });
  }

  static UserStatusEdit(id: number) {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndpoints.Status(id),
    });
  }

  static GetUsers() {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.getUsers(),
      failOnStatusCode: false,
    });
  }

  static seedData(users: UserManagementModels.UserInput[]) {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.Seed(),
      body: { users, overwrite: false },
    });
  }

  static resetData() {
    cy.log("Resetting data");
    return cy.request("POST", UserManagementEndpoints.reset);
  }
}
