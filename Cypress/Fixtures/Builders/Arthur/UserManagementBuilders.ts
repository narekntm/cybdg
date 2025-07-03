import { UserManagementEndpoints } from "EndPoints/Arthur/UserManagementEndpoints";
import { UserFormData, UserInput } from "Models/Arthur/UserManagementModels";

export class UserManagementBuilders {
  static AdminLogin = (email: string, password: string, failOnStatusCode: boolean = false) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin,
      body: { email, password },
      failOnStatusCode,
    });
  };

  static ResetData = (failOnStatusCode: boolean = true) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.reset,
      failOnStatusCode,
    });
  };

  static GetUsers = (id?: number, failOnStatusCode: boolean = true) => {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.Users(id),
      failOnStatusCode,
    });
  };

  static CreateUser = (user: UserFormData, failOnStatusCode: boolean = false) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.Users(),
      body: {
        ...user,
        subscriptions: user.subscriptions?.join(",") || "",
      },
      failOnStatusCode,
    });
  };

  static UpdateUser = (id: number, user: UserFormData, failOnStatusCode: boolean = false) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndpoints.Users(id),
      body: {
        ...user,
        subscriptions: user.subscriptions?.join(",") || "",
      },
      failOnStatusCode,
    });
  };

  static DeleteUser = (id: number, isAdmin: boolean = true, failOnStatusCode: boolean = false) => {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: { isAdmin },
      failOnStatusCode,
    });
  };

  static ToggleUserStatus = (id: number, status: "Active" | "Inactive", failOnStatusCode: boolean = false) => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndpoints.Status(id),
      body: { status },
      failOnStatusCode,
    });
  };

  static seedData = (users: UserInput[], overwrite = false, failOnStatusCode = true) => {
    return cy.request({
      method: "POST",
      url: "/api/seed",
      body: {
        users,
        overwrite,
      },
      failOnStatusCode,
    });
  };
}
