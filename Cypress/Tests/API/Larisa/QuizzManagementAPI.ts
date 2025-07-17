import { QuizzManagementBuilders } from "Builders/Larisa/QuizzManagementBuilders";
import { QuizzManagementGenerators } from "Generators/Larisa/QuizzManagementGenerators";
import { QuizzManagementModels } from "Models/Larisa/QuizzManagementModels";

describe("QuizzManagement Suite", () => {
  const baseURL = "/login";

  const loginAdminPositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("ADMIN_EMAIL"),
    password: Cypress.env("ADMIN_PASSWORD"),
  };

  const loginUser1PositiveCase: QuizzManagementModels.Login = {
    email: Cypress.env("USER1_EMAIL"),
    password: Cypress.env("USER1_PASSWORD"),
  };

  beforeEach(() => {
    cy.visit(baseURL);
  });

  context("Login to Quizz Management Suite", () => {
    it("Login as Admin, Positive case", () => {
      QuizzManagementBuilders.adminLogin(loginAdminPositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });

    it("Login as User, Positive case", () => {
      QuizzManagementBuilders.adminLogin(loginUser1PositiveCase).then((responce) => {
        expect(responce.status).to.eq(200);
        expect(responce.statusText).to.eq("OK");
      });
    });
  });

  context("Add New Quizz Suite", () => {
    it("Add a quizz, Positive case, submit", () => {
      QuizzManagementBuilders.adminLogin(loginAdminPositiveCase).then(() => {
        QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
          expect(responce.status).to.eq(200);
          expect(responce.statusText).to.eq("OK");
        });
      });
    });

    it("Add a quizz and Publish Test", () => {
      QuizzManagementBuilders.adminLogin(loginAdminPositiveCase).then(() => {
        QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
          QuizzManagementBuilders.publishQuizz(responce.body.id).then((responce) => {
            expect(responce.status).to.eq(200);
            expect(responce.statusText).to.eq("OK");
          });
        });
      });
    });

    it("Archive Quizz Test", () => {
      QuizzManagementBuilders.adminLogin(loginAdminPositiveCase).then(() => {
        QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
          QuizzManagementBuilders.archiveQuizz(responce.body.id).then((responce) => {
            expect(responce.status).to.eq(200);
            expect(responce.statusText).to.eq("OK");
          });
        });
      });
    });

    it("Delete Quizz Test", () => {
      QuizzManagementBuilders.adminLogin(loginAdminPositiveCase).then(() => {
        QuizzManagementBuilders.postQuizz(QuizzManagementGenerators.quizz).then((responce) => {
          QuizzManagementBuilders.deleteQuizz(responce.body.id).then((responce) => {
            expect(responce.status).to.eq(200);
            expect(responce.statusText).to.eq("OK");
          });
        });
      });
    });
  });
});
