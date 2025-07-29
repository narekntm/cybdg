// AuthBuilder.ts
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import { UserCredentials, UserFields, UserSummary } from "Models/Arthur/QuizManager/QuizManagerModels";

export class AuthBuilder {
  static verifyAuthMe(user: UserCredentials, failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ url: QuizManagerEndpoints.authMe, failOnStatusCode }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.email).to.eq(user.email);
      expect(res.body.role).to.eq(user.role);
    });
  }

  static denyAccess(failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({
        method: "GET",
        url: QuizManagerEndpoints.authMe,
        failOnStatusCode,
      })
      .then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
      });
  }

  static denyUserList(failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({
        method: "GET",
        url: QuizManagerEndpoints.users,
        failOnStatusCode,
      })
      .then((res) => {
        expect(res.status).to.eq(403);
        expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
      });
  }

  static loadUsersList(failOnStatusCode = true): Cypress.Chainable {
    return cy.request({ url: QuizManagerEndpoints.users, failOnStatusCode }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an("array");
      (res.body as UserSummary[]).forEach((user) => {
        expect(user).to.have.all.keys(UserFields.Id, UserFields.Email, UserFields.Role);
        expect(user.role).to.eq("user");
      });
    });
  }

  static loginFails(email: string, password: string, failOnStatusCode = true): Cypress.Chainable {
    return cy
      .request({
        method: "POST",
        url: QuizManagerEndpoints.login,
        body: { email, password },
        failOnStatusCode,
      })
      .then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.InvalidCredentials);
      });
  }

  static denyRoutes(urls: string[], failOnStatusCode = true): void {
    urls.forEach((url) => {
      cy.request({
        method: "GET",
        url,
        failOnStatusCode,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
      });
    });
  }
}
