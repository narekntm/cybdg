import {UserManagementEndpoints} from "EndPoints/Lecture/UserManagementEndpoints";

export class UserManagementBuilders {

  static adminLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: UserManagementEndpoints.adminLogin,
      body: {
        email,
        password
      },
      failOnStatusCode: false,
    })
  };
}