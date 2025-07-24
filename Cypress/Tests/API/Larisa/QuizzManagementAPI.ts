import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { UserManagementModels } from "Models/Larisa/UserManagementModels";

describe("QuizzManagement Suite", () => {
  let manager: UserManagementModels.User;
  let user: UserManagementModels.User;

  let adminLogin: UserManagementModels.Login;
  let userLogin: UserManagementModels.Login;

  before(() => {
    QuizzManagementBuilders.auth().then((responce) => {
      cy.setCookie("authToken", responce.body.token);
    });

    manager = QuizzManagementGenerators.user(UserManagementModels.UserRole.Manager);
    QuizzManagementBuilders.postUser(manager).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
      Cypress.env("manager", manager);
      adminLogin = { email: manager.email, password: manager.password };
    });

    user = QuizzManagementGenerators.user(UserManagementModels.UserRole.User);
    QuizzManagementBuilders.postUser(user).then((responce) => {
      expect(responce.status).to.be.oneOf([200, 201]);
      expect(responce.statusText).to.eq("Created");
      Cypress.env("user", user);
      userLogin = { email: user.email, password: user.password };
    });
  });

  context("Login to Quizz Suite", () => {
    it("Login as Admin, Positive case", () => {
      QuizzManagementBuilders.adminLogin(adminLogin).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Login as User, Positive case", () => {
      QuizzManagementBuilders.adminLogin(userLogin).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });
  });

  context("Add New Quizz Suite", () => {
    beforeEach(() => {
      QuizzManagementBuilders.adminLogin(adminLogin).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Add a quizz, Positive case, submit", () => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Add and Publish a Quiz", () => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
        .then((response) => {
          const quizId = response.body.id;
          return QuizzManagementBuilders.publishQuizz(quizId);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.statusText).to.eq("OK");
        });
    });

    it("Add and Archive a Quiz", () => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
        .then((response) => {
          const quizId = response.body.id;
          return QuizzManagementBuilders.archiveQuizz(quizId);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.statusText).to.eq("OK");
        });
    });

    it("Add and Delete a Quiz", () => {
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz)
        .then((response) => {
          const quizId = response.body.id;
          return QuizzManagementBuilders.deleteQuizz(quizId);
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.statusText).to.eq("OK");
        });
    });

    it("Logout user", () => {
      QuizzManagementBuilders.logout().then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Submit Quizz", () => {
      const answers = QuizzManagementGenerators.generateAnswers(QuizzManagementGenerators.quizz);
      QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((response) => {
        QuizzManagementBuilders.submitQuizz(response.body.id, { answers }).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });
  });
});
