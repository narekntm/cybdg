import { UserManagementEndpoints } from "EndPoints/UserManagementEndpoints";
import { QuizManagerEndpoints } from "EndPoints/Ani/QuizManagerEndpoints";

export class QuizManagerBuilders {
  static CreateAndLoginTestUser(role = 'user') {
    const id = crypto.randomUUID()
    const email = `${id}@test.com`
    const password = 'Test1234!'

    // Replace this with your real user creation endpoint
    return cy.request('POST', 'http://127.0.0.1:5353/be/api/test/users', {
      id,
      email,
      password,
      role
    }).then(() => {
      // Login using the UI
      cy.visit('/login') // change this if your login page is different
      cy.get('#email').type(email)
      cy.get('#password').type(password)
      cy.get('button[type=submit]').click()

      return { email, password }
    })
  }
  static ManagerLogin = (email: string, password: string) => {
    return cy.request({
      method: "POST",
      url: QuizManagerEndpoints.managerLogin,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  };
}
