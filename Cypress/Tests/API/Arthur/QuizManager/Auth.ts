import { AuthBuilder } from "Builders/Arthur/QuizManager/AuthBuilder";
import { TestUserBuilder } from "Builders/Arthur/QuizManager/TestUserBuilder";
import { QuizManagerEndpoints } from "EndPoints/Arthur/QuizManager/QuizManagerEndpoints";
import { TokenGenerator } from "Generators/Arthur/QuizManager/TokenGenerator";
import { UserGenerator } from "Generators/Arthur/QuizManager/UserGenerator";
import { clearAuth, loginViaApi, logoutViaApi } from "Helpers/Arthur/QuizManager/QuizManagerHelpers";
import { UserCredentials, UserRole } from "Models/Arthur/QuizManager/QuizManagerModels";

describe("Auth API Tests", () => {
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
        AuthBuilder.verifyAuthMe(manager);
      });
    });

    it("Should login as User and access /auth/me", () => {
      loginViaApi(user).then(() => {
        AuthBuilder.verifyAuthMe(user);
      });
    });

    it("Should logout and block access to /auth/me", () => {
      loginViaApi(user).then(() => {
        logoutViaApi().then(() => {
          AuthBuilder.denyAccess(false);
        });
      });
    });

    it("Should allow Manager to access /api/users", () => {
      loginViaApi(manager).then(() => {
        AuthBuilder.loadUsersList();
      });
    });
  });

  context("Negative login scenarios", () => {
    beforeEach(() => {
      clearAuth();
    });

    it("Should not login with invalid email", () => {
      const invalid = UserGenerator.invalidUser();
      AuthBuilder.loginFails(invalid.email, invalid.password, false);
    });

    it("Should not login with wrong password", () => {
      const wrong = UserGenerator.withWrongPassword(user.email);
      AuthBuilder.loginFails(wrong.email, wrong.password, false);
    });

    it("Should block access to /auth/me without login", () => {
      AuthBuilder.denyAccess(false);
    });

    it("Should not allow User to access /api/users (manager only)", () => {
      loginViaApi(user).then(() => {
        AuthBuilder.denyUserList(false);
      });
    });

    it("Should reject request with invalid authToken cookie", () => {
      cy.setCookie("authToken", TokenGenerator.invalidToken());
      AuthBuilder.denyAccess(false);
    });

    it("Should block access to protected routes without login", () => {
      const urls = [QuizManagerEndpoints.quizzes, QuizManagerEndpoints.users, QuizManagerEndpoints.mySubmissions];
      AuthBuilder.denyRoutes(urls, false);
    });

    it("Should reject access if token is syntactically correct but not in session", () => {
      cy.setCookie("authToken", TokenGenerator.validLookingButFakeToken());
      AuthBuilder.denyAccess(false);
    });
  });
});
