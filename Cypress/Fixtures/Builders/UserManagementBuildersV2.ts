import { UserManagementEndPointsV2 } from "EndPoints/UserManagementEndPointsV2";
import { UserManagementModels } from "Models/UserManagementModels";

export class UserManagementBuildersV2 {
  static adminLogin = (login: UserManagementModels.Login) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPointsV2.adminLogin,
      body: {
        email: login.email,
        password: login.password,
      },
      failOnStatusCode: false,
    });
  };

  static resetData = () => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPointsV2.reset,
    });
  };

  static postUser = (user: UserManagementModels.User) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPointsV2.Users(),
      body: user,
      failOnStatusCode: false,
    });
  };

  static getUsers = () => {
    return cy.request({
      method: "GET",
      url: UserManagementEndPointsV2.Users(),
    });
  };

  static putUser = (id: number, updatedUser: UserManagementModels.User) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndPointsV2.Users(id),
      body: updatedUser,
    });
  };

  static deleteUser = (id: number, isAdmin: boolean = false) => {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndPointsV2.Users(id),
      body: {
        isAdmin: isAdmin,
      },
    });
  };

  static patchUser = (id: number, status: string) => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndPointsV2.Status(id),
      body: {
        status: status,
      },
    });
  };

  static seedData(users: UserManagementModels.UserInput[]) {
    return cy.request({
      method: "POST",
      url: UserManagementEndPointsV2.seed(),
      body: {
        users,
        overwrite: false,
      },
    });
  }
}
