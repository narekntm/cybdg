import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { UserGenerator } from "Generators/Arthur/QuizManager/UserGenerator";
import { TokenGenerator } from "Generators/Arthur/QuizManager/TokenGenerator";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import {
  clearAuth,
  loginViaApi,
  logoutViaApi,
} from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { AuthErrorMessages } from "Models/Arthur/QuizManager/QuizManagerErrorMessages";
import {
  UserCredentials,
  UserFields,
  UserRole,
  UserSummary,
} from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Auth API Tests", () => {
  const authMe = QuizManagerEndpoints.authMe;

  let manager: UserCredentials;
  let user: UserCredentials;

  before(() => {
    TestUserBuilder.createUser(UserRole.Manager).then((createdManager) => {
      manager = createdManager;
    });

    TestUserBuilder.createUser(UserRole.User).then((createdUser) => {
      user = createdUser;
    });
  });

  context("Positive login scenarios", () => {
    it("Should login as Manager and access /auth/me", () => {
      loginViaApi(manager).then(() => {
        cy.request(authMe).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.email).to.eq(manager.email);
          expect(res.body.role).to.eq(UserRole.Manager);
        });
      });
    });

    it("Should login as User and access /auth/me", () => {
      loginViaApi(user).then(() => {
        cy.request(authMe).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body.email).to.eq(user.email);
          expect(res.body.role).to.eq(UserRole.User);
        });
      });
    });

    it("Should logout and block access to /auth/me", () => {
      loginViaApi(user).then(() => {
        logoutViaApi().then(() => {
          cy.request({
            method: "GET",
            url: authMe,
            failOnStatusCode: false,
          }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
          });
        });
      });
    });

    it("Should allow Manager to access /api/users", () => {
      loginViaApi(manager).then(() => {
        cy.request(QuizManagerEndpoints.users).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.be.an("array");

          (res.body as UserSummary[]).forEach((user) => {
            expect(user).to.have.all.keys(
              UserFields.Id,
              UserFields.Email,
              UserFields.Role
            );
            expect(user.role).to.eq(UserRole.User);
          });
        });
      });
    });
  });

  context("Negative login scenarios", () => {
    beforeEach(() => {
      clearAuth();
    });

    it("Should not login with invalid email", () => {
      const invalid = UserGenerator.invalidUser();

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.login,
        body: { email: invalid.email, password: invalid.password },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.InvalidCredentials);
      });
    });

    it("Should not login with wrong password", () => {
      const wrong = UserGenerator.withWrongPassword(user.email);

      cy.request({
        method: "POST",
        url: QuizManagerEndpoints.login,
        body: { email: wrong.email, password: wrong.password },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.InvalidCredentials);
      });
    });

    it("Should block access to /auth/me without login", () => {
      cy.request({
        method: "GET",
        url: authMe,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
      });
    });

    it("Should not allow User to access /api/users (manager only)", () => {
      loginViaApi(user).then(() => {
        cy.request({
          method: "GET",
          url: QuizManagerEndpoints.users,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(403);
          expect(res.body.error).to.eq(AuthErrorMessages.Forbidden);
        });
      });
    });

    it("Should reject request with invalid authToken cookie", () => {
      cy.setCookie("authToken", TokenGenerator.invalidToken());

      cy.request({
        method: "GET",
        url: authMe,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
      });
    });

    it("Should block access to protected routes without login", () => {
      const urls = [
        QuizManagerEndpoints.quizzes,
        QuizManagerEndpoints.users,
        QuizManagerEndpoints.mySubmissions,
      ];

      urls.forEach((url) => {
        cy.request({
          method: "GET",
          url,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
          expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
        });
      });
    });

    it("Should reject access if token is syntactically correct but not in session", () => {
      cy.setCookie("authToken", TokenGenerator.validLookingButFakeToken());

      cy.request({
        method: "GET",
        url: QuizManagerEndpoints.authMe,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.error).to.eq(AuthErrorMessages.Unauthorized);
      });
    });
  });
});
