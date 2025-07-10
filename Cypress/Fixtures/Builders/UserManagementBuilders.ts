import { UserManagementModels } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementEndPoints } from "EndPoints/UserManagementEndPoints";

export class UserManagementBuilders {
  static adminLogin = (login: UserManagementModels.Login) => {
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

  static resetData = () => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.reset,
    });
  };

  static postUser = (user: UserManagementModels.User) => {
    console.log("user: ", user);
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.users(),
      body: {
        user,
      },
      failOnStatusCode: false,
    });
  };

  static getUsers = () => {
    return cy.request({
      method: "GET",
      url: UserManagementEndPoints.users(),
    });
  };

  static putUser = (id: number, updatedUser: UserManagementModels.User) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndPoints.users(id),
      body: {
        updatedUser,
      },
    });
  };

  static deleteUser = (id: number, isAdmin: boolean) => {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndPoints.users(id),
      body: {
        isAdmin: isAdmin,
      },
    });
  };

  static patchUser = (id: number, status: string) => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndPoints.status(id),
      body: {
        status: status,
      },
    });
  };
}
