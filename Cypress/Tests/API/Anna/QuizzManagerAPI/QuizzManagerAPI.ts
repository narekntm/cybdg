import { QuizzManagerBuilders } from "Builders/Anna/QuizzmanagerBuilders/QuizzManagerBuilders";
import { QuizzManagerGenerators } from "Generators/Anna/QuizzManagerGenerators/QuizzManagerGenerators";


describe("Quiz-Manager -API ", () => {
  const baseURL = "/login";

  const managerEmail = Cypress.env("MANAGER_EMAIL");
  const managerPassword = Cypress.env("MANAGER_PASSWORD");

  const user1Email = Cypress.env("USER1_EMAIL");
  const user1Password = Cypress.env("USER1_PASSWORD");

  const user2Email = Cypress.env("USER2_EMAIL");
  const user2Password = Cypress.env("USER2_PASSWORD");

  const invalidEmail = "managerxxxxxx@example.com";
  const invalidPassword = "manager####";


  beforeEach(() => {
    cy.visit(baseURL);
  });


  describe("Login to Quizz Manager suite", () => {
    it("Login is Admin as manager, Positive case", () => {
      QuizzManagerBuilders.AdminLogin(managerEmail, managerPassword).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("success", true);
      })
    });

    it("Login  as user1, Positive case", () => {
      QuizzManagerBuilders.AdminLogin(user1Email, user1Password).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("success", true);
      })
    });

    it("Login as user2, Positive case", () => {
      QuizzManagerBuilders.AdminLogin(user1Email, user1Password).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("success", true);
      })
    });

    it("Login as user2, Positive case", () => {
      QuizzManagerBuilders.AdminLogin(user2Email, user2Password).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("success", true);
      })
    });

    it("Login is Admin ,Negative case", () => {
      QuizzManagerBuilders.AdminLogin(invalidEmail, invalidPassword).then((resp) => {
        expect(resp.status).to.eq(401);
        expect(resp.body).to.have.property("success", false);
      })
    });

  })

  describe("Add new Quizz", () => {
    it("Add new Quizz  and Submit, positive case", () => {
      QuizzManagerBuilders.AdminLogin(managerEmail, managerPassword).then(() => {
        QuizzManagerBuilders.postQuizz(QuizzManagerGenerators.quizz).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body).to.have.property("success", true);
        });
      });
    });

    it("Add new quizz and Publish Test", () => {
      QuizzManagerBuilders.AdminLogin(managerEmail, managerPassword).then(() => {
        QuizzManagerBuilders.postQuizz(QuizzManagerGenerators.quizz).then((resp) => {
          QuizzManagerBuilders.publishQuizz(resp.body.quizId).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("success", true);
          });
        });
      });
    });

    it("Add new quizz and Archive Quizz Test", () => {
      QuizzManagerBuilders.AdminLogin(managerEmail, managerPassword).then(() => {
        QuizzManagerBuilders.postQuizz(QuizzManagerGenerators.quizz).then((resp) => {
          QuizzManagerBuilders.archiveQuizz(resp.body.quizId).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("success", true);
          });
        });
      });
    });

    it("Delete Quizz Test", () => {
      QuizzManagerBuilders.AdminLogin(managerEmail, managerPassword).then(() => {
        QuizzManagerBuilders.postQuizz(QuizzManagerGenerators.quizz).then((resp) => {
          QuizzManagerBuilders.deleteQuizz(resp.body.quizId).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("success", true);
          });
        });
      });
    });

  })
})