import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementEndPoints } from "EndPoints/UserManagementEndPoints";

export class UserManagementBuilders {
  static AdminLogin = (login: UserManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.adminLogin,
      body: {
        email: login.email,
        password: login.password,
      },
      failOnStatusCode: false,
    });
  };

  static ResetData = () => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.reset,
    });
  };

  static PostUser = (user: UserManagementModels.User) => {
    console.log("user: ", user);
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.Users(),
      body: {
        user,
      },
      failOnStatusCode: false,
    });
  };

  static GetUsers = () => {
    return cy.request({
      method: "GET",
      url: UserManagementEndPoints.Users(),
    });
  };

  static PutUser = (id: number, updatedUser: UserManagementModels.User) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndPoints.Users(id),
      body: {
        updatedUser,
      },
    });
  };

  static DeleteUser = (id: number, isAdmin: boolean) => {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndPoints.Users(id),
      body: {
        isAdmin: isAdmin,
      },
    });
  };

  static PatchUser = (id: number, status: string) => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndPoints.Status(id),
      body: {
        status: status,
      },
    });
  };
}
