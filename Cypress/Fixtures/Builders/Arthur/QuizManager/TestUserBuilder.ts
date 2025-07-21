import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { UserGenerator } from "Generators/Arthur/QuizManager/UserGenerator";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

export class TestUserBuilder {
  static getToken(): Cypress.Chainable<string> {
    const email = Cypress.env("TEST_MANAGER_EMAIL");
    const password = Cypress.env("TEST_MANAGER_PASSWORD");

    if (!email || !password) {
      throw new Error("Missing TEST_MANAGER_EMAIL or TEST_MANAGER_PASSWORD in Cypress.env");
    }

    return cy.request<{ token: string }>("POST", QuizManagerEndpoints.testAuth, { email, password }).then((res) => res.body.token);
  }

  static createUser(role: UserRole, overrides = {}): Cypress.Chainable<UserCredentials> {
    const user = UserGenerator.generateUser(role);

    return this.getToken().then((token) => {
      return cy
        .request({
          method: "POST",
          url: QuizManagerEndpoints.testUsers,
          headers: { Authorization: `Bearer ${token}` },
          body: { ...user, ...overrides },
        })
        .then(() => ({ ...user, ...overrides }));
    });
  }
}
