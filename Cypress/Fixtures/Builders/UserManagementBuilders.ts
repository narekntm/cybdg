import { UserManagementEndpoints } from 'EndPoints/UserManagementEndpoints';

export class UserManagementBuilders {

  static AdminLogin = (email: string, password: string) => {
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