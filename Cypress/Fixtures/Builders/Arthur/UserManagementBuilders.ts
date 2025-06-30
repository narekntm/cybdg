import { UserManagementEndpoints } from "EndPoints/Arthur/UserManagementEndpoints";
import { Gender , Role, Status, Subscription, UserFormData, UserInput } from "Models/Arthur/UserManagementModels";


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

  static ResetData = () => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.reset,
    });
  };

  static GetUsers = (id?: number) => {
    return cy.request({
      method: "GET",
      url: UserManagementEndpoints.Users(id),
    });
  };

  //chatGPT suggested to use overrides, need to clarify with Narek

  static CreateUser = (overrides: Partial<UserFormData> = {}) => {
    const user: UserFormData = {
      name: "TestUser",
      email: "test@example.com",
      role: "Viewer",
      age: "25",
      gender: "Male",
      subscriptions: ["Product Updates"],
      ...overrides,
    };

    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.Users(),
      body: {
        ...user,
        subscriptions: user.subscriptions?.join(","),
      },
      failOnStatusCode: false,
    });
  };

  static UpdateUser = (id: number, overrides: Partial<UserFormData> = {}) => {
    return cy.request({
      method: "PUT",
      url: UserManagementEndpoints.Users(id),
      body: {
        ...overrides,
        subscriptions: overrides.subscriptions?.join(","),
      },
      failOnStatusCode: false,
    });
  };

  static DeleteUser = (id: number, isAdmin: boolean = true) => {
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.Users(id),
      body: { isAdmin },
      failOnStatusCode: false,
    });
  };

  static ToggleUserStatus = (id: number, status: "Active" | "Inactive") => {
    return cy.request({
      method: "PATCH",
      url: UserManagementEndpoints.Status(id),
      body: { status },
      failOnStatusCode: false,
    });
  };

  static seedData(users: UserInput[]) {
    return cy.request({
      method: "POST",
      url: "/api/seed",
      body: {
        users,
        overwrite: false,
      },
    });
  }
}
