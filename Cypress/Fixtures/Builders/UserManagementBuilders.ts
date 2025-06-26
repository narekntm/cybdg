import { Login, User } from "Cypress/Fixtures/Models/UserManagementModels";
import { UserManagementEndPoints } from 'EndPoints/UserManagementEndPoints';

export class UserManagementBuilders {

  static AdminLogin = (login: Login) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.adminLogin,
      body: {
        email: login.email,
        password: login.password
      },
      failOnStatusCode: false
    })
  };

  static ResetData = () => {
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.reset
    })
  };

  static PostUser = (user: User) => {
    console.log('user: ', user)
    return cy.request({
      method: "POST",
      url: UserManagementEndPoints.Users(),
      body: {
        name: user.name,
        role: user.role,
        age: user.age,
        email: user.email,
        gender: user.gender,
        subscription: user.subscription
      },
      failOnStatusCode: false
    });
  };

  static GetUsers = () => {
    return cy.request({
      method: "GET",
      url: UserManagementEndPoints.Users(),
    });
  };

  static PutUser = (id: number, updatedUser: User ) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndPoints.Users(id),
      body: {
        name: updatedUser.name,
        role: updatedUser.role,
        age: updatedUser.age,
        email: updatedUser.email,
        gender: updatedUser.gender,
        subscription: updatedUser.subscription
      }
    });
  };

  static DeleteUser = (id: number, isAdmin: boolean) => {
    return cy.request({
      method: 'DELETE',
      url: UserManagementEndPoints.Users(id),
      body: {
        isAdmin: isAdmin
      }
    });
  };

  static PatchUser = (id: number, status: string) => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndPoints.Status(id),
      body: {
        status: status
      }
    });
  };
}