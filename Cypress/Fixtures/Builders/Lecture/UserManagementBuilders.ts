import { UserManagementEndpoints } from "EndPoints/Lecture/UserManagementEndpoints";
import { UserManagementGenerators } from "Generators/Lecture/UserManagementGenerators";
import { UserManagementModels } from "Models/Lecture/UserManagementModels";
import { QuizzManagerEndpoints } from "EndPoints/Anna/QuizzManagerEndpoints/QuizzManagerEndpoints";

export class UserManagementBuilders {
  /**
   * Perform admin login via API
   * @param email admin email
   * @param password admin password
   */
  static adminLogin(email: string, password: string) {
    cy.log(`Logging in as admin: ${email}`);
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin,
      body: { email, password },
      failOnStatusCode: false,
    });
  }

  /** Reset backend to the initial state */
  static resetData() {
    cy.log("Resetting data");
    return cy.request("POST", UserManagementEndpoints.reset);
  }

  /** Fetch all users */
  static getUsers() {
    cy.log("Fetching users");
    return cy.request<UserManagementModels.User[]>("GET", UserManagementEndpoints.users());
  }

  /** Create a new user via API */
  static createUser(user: UserManagementModels.UserUpdate) {
    cy.log(`Creating user: ${user.name}`);
    return cy.request<UserManagementModels.User>({
      method: "POST",
      url: UserManagementEndpoints.users(),
      body: user,
    });
  }

  /** Update user data (everything except status) */
  static updateUser(id: number, userData: UserManagementModels.UserUpdate) {
    cy.log(`Updating user #${id}`);
    return cy.request<UserManagementModels.User>({
      method: "PUT",
      url: UserManagementEndpoints.users(id),
      body: userData,
    });
  }

  /** Delete a user by ID */
  static deleteUser(id: number, isAdmin: boolean = false) {
    cy.log(`Deleting user #${id}`);
    return cy.request({
      method: "DELETE",
      url: UserManagementEndpoints.users(id),
      body: { isAdmin },

    });
  }

  /** Toggle a user's status */
  static toggleStatus(id: number, status: UserManagementModels.Status) {
    cy.log(`Toggling status of user #${id} to ${status}`);
    return cy.request<{ status: UserManagementModels.Status }>({
      method: "PATCH",
      url: UserManagementEndpoints.status(id),
      body: { status },
    });
  }

  static seedData() {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.seed(),
      body: { user: UserManagementGenerators.userDataPositive(50), overwrite: false },
    });
  }

  static AdminLogin = (email: string, password: string, failOnStatusCode: boolean = true) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin,
      body: {
        email,
        password,
      },
      failOnStatusCode: failOnStatusCode,
    });
  };
}
