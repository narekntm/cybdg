import { UserManagementEndpoints } from "EndPoints/UserManagementEndpoints";
import { UserFormInput } from "Models/UserManagementModels";

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
  static UserDeleteAsAdmin(id: number) {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: {
        isAdmin: true,
      },
      failOnStatusCode: false,
    });
  }
  static UserDeleteAsViewer(id: number) {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: {
        isAdmin: false,
      },
      failOnStatusCode: false,
    });
  }
  static UserCreate(user: UserFormInput) {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.Users(),
      body: user,
      failOnStatusCode: false,
    });
  }
  static UserUpdate(id: number) {
    return cy.request({
      method: "PUT",
      url: UserManagementEndpoints.Users(id),
    });
  }
  static UserStatusUpdate(id: number) {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndpoints.Status(id),
    });
  }
  static GetUsers() {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.Users(),
      failOnStatusCode: false,
    });
  }
}
